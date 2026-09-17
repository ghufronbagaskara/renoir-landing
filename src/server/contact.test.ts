import { describe, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import { handleContact, toResponse, type ContactDeps, type Submission } from "./contact";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I would like a new marketing site.",
  source: "contact",
  "cf-turnstile-response": "token",
};
const meta = { ip: "203.0.113.7", userAgent: "test" };

function deps(overrides: Partial<ContactDeps> = {}) {
  const calls = { saved: [] as Submission[], notified: 0, marked: [] as [number, boolean, string | null][] };
  const d: ContactDeps = {
    rateLimit: async () => true,
    verifyTurnstile: async () => true,
    save: async (s) => (calls.saved.push(s), 1),
    notify: async () => (calls.notified++, true),
    markEmail: async (...args) => void calls.marked.push(args),
    ...overrides,
  };
  return { d, calls };
}

const run = (raw: unknown, d: ContactDeps) => Effect.runPromise(toResponse(handleContact(raw, meta, d)));

describe("contact handler", () => {
  test("valid submission is stored and emailed", async () => {
    const { d, calls } = deps();
    expect(await run(valid, d)).toEqual({ http: 200, status: "sent" });
    expect(calls.saved).toHaveLength(1);
    expect(calls.saved[0].ip).toBe(meta.ip);
    expect(calls.notified).toBe(1);
    expect(calls.marked).toEqual([[1, true, null]]);
  });

  test("honeypot pretends success and stores nothing", async () => {
    const { d, calls } = deps();
    expect(await run({ ...valid, company_website: "spam.example" }, d)).toEqual({ http: 200, status: "sent" });
    expect(calls.saved).toHaveLength(0);
  });

  test("invalid input is rejected", async () => {
    const { d, calls } = deps();
    expect(await run({ ...valid, email: "nope" }, d)).toEqual({ http: 400, status: "invalid" });
    expect(await run({ ...valid, source: "evil" }, d)).toEqual({ http: 400, status: "invalid" });
    expect(calls.saved).toHaveLength(0);
  });

  test("rate limited", async () => {
    const { d, calls } = deps({ rateLimit: async () => false });
    expect(await run(valid, d)).toEqual({ http: 429, status: "rate_limited" });
    expect(calls.saved).toHaveLength(0);
  });

  test("failed turnstile stores nothing", async () => {
    const { d, calls } = deps({ verifyTurnstile: async () => false });
    expect(await run(valid, d)).toEqual({ http: 403, status: "captcha" });
    expect(calls.saved).toHaveLength(0);
  });

  test("email failure still succeeds and records the error", async () => {
    const { d, calls } = deps({ notify: async () => Promise.reject(new Error("resend down")) });
    expect(await run(valid, d)).toEqual({ http: 200, status: "sent" });
    expect(calls.marked[0][1]).toBe(false);
    expect(calls.marked[0][2]).toContain("resend down");
  });

  test("storage failure returns 500", async () => {
    const { d } = deps({ save: async () => Promise.reject(new Error("d1 down")) });
    expect(await run(valid, d)).toEqual({ http: 500, status: "error" });
  });
});
