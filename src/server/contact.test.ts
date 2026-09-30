import { describe, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import { handleContact, leadText, toResponse, type ContactDeps, type Sink, type Submission } from "./contact";

const valid = {
  name: "Ada Lovelace",
  company: "Analytical Engines",
  email: "ada@example.com",
  build_type: "marketing",
  message: "I would like a new marketing site.",
  timeline: "quarter",
  budget: "",
  locale: "id",
  source: "contact",
  "cf-turnstile-response": "token",
};
const meta = { ip: "203.0.113.7", userAgent: "test" };

function deps(overrides: Partial<ContactDeps> = {}) {
  const calls = { delivered: [] as Submission[] };
  const d: ContactDeps = {
    rateLimit: async () => true,
    verifyTurnstile: async () => true,
    sinks: [async (s) => (calls.delivered.push(s), true)],
    ...overrides,
  };
  return { d, calls };
}

const run = (raw: unknown, d: ContactDeps) => Effect.runPromise(toResponse(handleContact(raw, meta, d)));
const down: Sink = async () => Promise.reject(new Error("sink down"));
const unset: Sink = async () => false;

describe("contact handler", () => {
  test("valid submission is delivered without the IP or form-only fields", async () => {
    const { d, calls } = deps();
    expect(await run(valid, d)).toEqual({ http: 200, status: "sent" });
    expect(calls.delivered).toHaveLength(1);
    const lead = calls.delivered[0];
    expect(lead.build_type).toBe("marketing");
    expect(lead.locale).toBe("id");
    expect("ip" in lead).toBe(false);
    expect("cf-turnstile-response" in lead).toBe(false);
    expect("budget" in lead).toBe(false); // "" from an unselected <select> is dropped
  });

  test("design inquiry is accepted", async () => {
    const { d, calls } = deps();
    expect(await run({ ...valid, build_type: "design" }, d)).toEqual({ http: 200, status: "sent" });
    expect(calls.delivered[0].build_type).toBe("design");
  });

  test("honeypot pretends success and delivers nothing", async () => {
    const { d, calls } = deps();
    expect(await run({ ...valid, company_website: "spam.example" }, d)).toEqual({ http: 200, status: "sent" });
    expect(calls.delivered).toHaveLength(0);
  });

  test("invalid input is rejected", async () => {
    const { d, calls } = deps();
    expect(await run({ ...valid, email: "nope" }, d)).toEqual({ http: 400, status: "invalid" });
    expect(await run({ ...valid, source: "evil" }, d)).toEqual({ http: 400, status: "invalid" });
    expect(await run({ ...valid, build_type: "website" }, d)).toEqual({ http: 400, status: "invalid" });
    expect(await run({ ...valid, locale: "fr" }, d)).toEqual({ http: 400, status: "invalid" });
    expect(calls.delivered).toHaveLength(0);
  });

  test("rate limited", async () => {
    const { d, calls } = deps({ rateLimit: async () => false });
    expect(await run(valid, d)).toEqual({ http: 429, status: "rate_limited" });
    expect(calls.delivered).toHaveLength(0);
  });

  test("failed turnstile delivers nothing", async () => {
    const { d, calls } = deps({ verifyTurnstile: async () => false });
    expect(await run(valid, d)).toEqual({ http: 403, status: "captcha" });
    expect(calls.delivered).toHaveLength(0);
  });

  test("one sink down still succeeds when another delivers", async () => {
    const { d, calls } = deps();
    d.sinks.unshift(down);
    expect(await run(valid, d)).toEqual({ http: 200, status: "sent" });
    expect(calls.delivered).toHaveLength(1);
  });

  test("no sink delivering returns 500", async () => {
    expect(await run(valid, deps({ sinks: [down, down] }).d)).toEqual({ http: 500, status: "error" });
    expect(await run(valid, deps({ sinks: [unset, unset] }).d)).toEqual({ http: 500, status: "error" });
    expect(await run(valid, deps({ sinks: [] }).d)).toEqual({ http: 500, status: "error" });
  });
});

test("leadText puts triage details first", () => {
  const text = leadText({ ...valid, budget: "25-50", timeline: "quarter", build_type: "internal", userAgent: null } as Submission);
  expect(text.split("\n")[0]).toBe("New enquiry: internal · budget 25-50 · quarter");
  expect(text).toContain("Email: ada@example.com");
});
