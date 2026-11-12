// D1 access for leads and admin accounts. `Db` is the structural subset of Cloudflare's D1Database we use,
// so tests can pass an in-memory SQLite adapter (db.test.ts) instead of the binding.
import type { Submission } from "./contact";

export interface Stmt {
  bind(...values: unknown[]): Stmt;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<{ meta: { changes: number } }>;
}
export interface Db {
  prepare(query: string): Stmt;
  batch(statements: Stmt[]): Promise<unknown[]>;
}

export const LeadStatuses = ["new", "contacted", "qualified", "won", "lost"] as const;
export type LeadStatus = (typeof LeadStatuses)[number];

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  source: string;
  locale: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  channel: string;
  company: string | null;
  build_type: string;
  message: string | null;
  timeline: string | null;
  budget: string | null;
  quiz: string | null;
  status: LeadStatus;
  notes: string | null;
  follow_up_on: string | null;
  user_agent: string | null;
}

/** Primary lead record. INSERT OR IGNORE keeps retries of the same submission id idempotent. */
export async function saveLead(db: Db | undefined, s: Submission) {
  if (!db) return false;
  await db
    .prepare(
      `INSERT OR IGNORE INTO leads (id, created_at, updated_at, source, locale, name, email, whatsapp, channel, company, build_type, message, timeline, budget, quiz, user_agent)
       VALUES (?1, ?2, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)`,
    )
    .bind(s.id, s.receivedAt, s.source, s.locale, s.name, s.email ?? null, s.whatsapp ?? null, s.channel, s.company ?? null, s.build_type, s.message ?? null, s.timeline ?? null, s.budget ?? null, s.quiz ? JSON.stringify(s.quiz) : null, s.userAgent)
    .run();
  return true;
}

export interface LeadFilter {
  q?: string;
  status?: string;
  source?: string;
  page?: number;
}
export const PAGE_SIZE = 50;

export async function listLeads(db: Db, f: LeadFilter) {
  const where: string[] = [];
  const args: unknown[] = [];
  if (f.status && (LeadStatuses as readonly string[]).includes(f.status)) where.push(`status = ?${args.push(f.status)}`);
  if (f.source === "quiz" || f.source === "contact") where.push(`source = ?${args.push(f.source)}`);
  else if (f.source === "service") where.push("source LIKE 'service:%'");
  if (f.q?.trim()) {
    const n = args.push(`%${f.q.trim().replace(/[\\%_]/g, (c) => `\\${c}`)}%`);
    where.push(`(name LIKE ?${n} ESCAPE '\\' OR email LIKE ?${n} ESCAPE '\\' OR whatsapp LIKE ?${n} ESCAPE '\\' OR company LIKE ?${n} ESCAPE '\\' OR message LIKE ?${n} ESCAPE '\\')`);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const page = Math.max(1, Math.floor(f.page ?? 1));
  const [rows, total, counts] = await Promise.all([
    db.prepare(`SELECT * FROM leads ${clause} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`).bind(...args).all<Lead>(),
    db.prepare(`SELECT COUNT(*) AS n FROM leads ${clause}`).bind(...args).first<{ n: number }>(),
    db.prepare("SELECT status, COUNT(*) AS n FROM leads GROUP BY status").all<{ status: LeadStatus; n: number }>(),
  ]);
  return { leads: rows.results, total: total?.n ?? 0, page, counts: Object.fromEntries(counts.results.map((r) => [r.status, r.n])) as Partial<Record<LeadStatus, number>> };
}

export const getLead = (db: Db, id: string) => db.prepare("SELECT * FROM leads WHERE id = ?1").bind(id).first<Lead>();

export const leadEvents = async (db: Db, id: string) =>
  (
    await db
      .prepare("SELECT e.at, e.kind, e.detail, u.name AS user FROM lead_events e LEFT JOIN admin_users u ON u.id = e.user_id WHERE e.lead_id = ?1 ORDER BY e.at DESC")
      .bind(id)
      .all<{ at: string; kind: string; detail: string | null; user: string | null }>()
  ).results;

/** Updates follow-up fields and records each change in lead_events. Returns false when the lead is gone. */
export async function updateLead(db: Db, id: string, userId: number, change: { status: LeadStatus; notes: string; follow_up_on: string }) {
  const lead = await getLead(db, id);
  if (!lead) return false;
  const now = new Date().toISOString();
  const event = (kind: string, detail: string) =>
    db.prepare("INSERT INTO lead_events (lead_id, user_id, at, kind, detail) VALUES (?1, ?2, ?3, ?4, ?5)").bind(id, userId, now, kind, detail);
  const events: Stmt[] = [];
  if (change.status !== lead.status) events.push(event("status", `${lead.status} → ${change.status}`));
  if (change.notes !== (lead.notes ?? "")) events.push(event("notes", "updated"));
  if (change.follow_up_on !== (lead.follow_up_on ?? "")) events.push(event("follow_up", change.follow_up_on || "cleared"));
  if (!events.length) return true;
  await db.batch([
    db.prepare("UPDATE leads SET status = ?2, notes = ?3, follow_up_on = ?4, updated_at = ?5 WHERE id = ?1").bind(id, change.status, change.notes || null, change.follow_up_on || null, now),
    ...events,
  ]);
  return true;
}

/** Permanent deletion for privacy requests; lead_events cascade. */
export const deleteLead = async (db: Db, id: string) => (await db.prepare("DELETE FROM leads WHERE id = ?1").bind(id).run()).meta.changes > 0;
