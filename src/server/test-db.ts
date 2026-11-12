// Test-only D1 stand-in: in-memory SQLite behind the Db subset in db.ts, with the real migration applied.
import { Database } from "bun:sqlite";
import { readFileSync } from "node:fs";
import type { Db, Stmt } from "./db";

export function memoryDb(): Db {
  const sqlite = new Database(":memory:");
  sqlite.exec("PRAGMA foreign_keys = ON;");
  sqlite.exec(readFileSync("migrations/0001_leads_admin.sql", "utf8"));
  const stmt = (query: string, values: unknown[] = []): Stmt => ({
    bind: (...v) => stmt(query, v),
    first: async <T,>() => (sqlite.query(query).get(...(values as never[])) as T) ?? null,
    all: async <T,>() => ({ results: sqlite.query(query).all(...(values as never[])) as T[] }),
    run: async () => ({ meta: { changes: sqlite.query(query).run(...(values as never[])).changes } }),
  });
  return { prepare: (q) => stmt(q), batch: async (list) => sqlite.transaction(() => list.map((s) => s.run()))() };
}

