import { describe, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import { handleContact, toResponse } from "./contact";
import { deleteLead, getLead, leadEvents, listLeads, saveLead, updateLead, type Db } from "./db";
import { memoryDb } from "./test-db";

const quiz = {
  name: "Budi",
  whatsapp: "+62 812 3456 7890",
  channel: "whatsapp",
  locale: "id",
  source: "quiz",
  submission_id: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  quiz_industry: "distribution",
  quiz_goal: "workflow",
  quiz_current: "manual",
  quiz_detail: "several-teams",
  quiz_size: "small",
  quiz_timing: "quarter",
  budget: "25-50",
};
const meta = { ip: "203.0.113.7", userAgent: "test" };

async function submit(db: Db, raw: unknown) {
  return Effect.runPromise(toResponse(handleContact(raw, meta, { rateLimit: async () => true, verifyTurnstile: async () => true, sinks: [(s) => saveLead(db, s)] })));
}

describe("leads", () => {
  test("quiz lead is stored once with the server-derived recommendation", async () => {
    const db = memoryDb();
    expect(await submit(db, quiz)).toEqual({ http: 200, status: "sent" });
    expect(await submit(db, quiz)).toEqual({ http: 200, status: "sent" }); // retry, same submission id
    const { leads, total } = await listLeads(db, {});
    expect(total).toBe(1);
    expect(leads[0].build_type).toBe("internal");
    expect(JSON.parse(leads[0].quiz!).recommendation).toBe("internal");
    expect(JSON.parse(leads[0].quiz!).scope).toBe("focused");
    expect(leads[0].budget).toBe("25-50");
    expect(leads[0].email).toBeNull();
  });

  test("quiz answers outside the goal's branch are rejected", async () => {
    const db = memoryDb();
    expect(await submit(db, { ...quiz, quiz_detail: "slow" })).toEqual({ http: 400, status: "invalid" });
    expect(await submit(db, { ...quiz, whatsapp: "" })).toEqual({ http: 400, status: "invalid" });
    expect(await submit(db, { ...quiz, budget: "" })).toEqual({ http: 400, status: "invalid" });
    expect(await submit(db, { ...quiz, quiz_industry: "mining" })).toEqual({ http: 400, status: "invalid" });
  });

  test("unsure goal resolves through the priority question", async () => {
    const db = memoryDb();
    await submit(db, { ...quiz, quiz_goal: "unsure", quiz_detail: "unknown" });
    expect((await listLeads(db, {})).leads[0].build_type).toBe("unsure");
  });

  test("filters, search, status history and deletion", async () => {
    const db = memoryDb();
    await submit(db, quiz);
    await submit(db, { name: "Ada", email: "ada@example.com", build_type: "marketing", message: "A new marketing site please", locale: "en", source: "contact" });
    expect((await listLeads(db, { source: "quiz" })).total).toBe(1);
    expect((await listLeads(db, { q: "ada@" })).total).toBe(1);
    expect((await listLeads(db, { q: "100%" })).total).toBe(0);

    await db.prepare("INSERT INTO admin_users (email, name, password_hash, created_at) VALUES ('o@example.com', 'Owner', 'x', '2026-11-13')").run();
    const id = quiz.submission_id;
    expect(await updateLead(db, id, 1, { status: "contacted", notes: "Called", follow_up_on: "2026-11-20" })).toBe(true);
    expect((await getLead(db, id))?.status).toBe("contacted");
    expect((await leadEvents(db, id)).map((e) => e.kind).sort()).toEqual(["follow_up", "notes", "status"]);
    expect((await listLeads(db, { status: "contacted" })).counts.contacted).toBe(1);

    expect(await deleteLead(db, id)).toBe(true);
    expect(await getLead(db, id)).toBeNull();
    expect(await leadEvents(db, id)).toHaveLength(0);
  });
});
