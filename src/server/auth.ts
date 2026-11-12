// Admin authentication: PBKDF2 password hashes, opaque session tokens (stored hashed), same-origin checks.
// Web Crypto only, so it runs unchanged in the Worker and in `bun test`.
import type { Db } from "./db";

// Workers cap PBKDF2 at 100k iterations; the count is stored per hash so it can be raised later.
const ITERATIONS = 100_000;
const SESSION_DAYS = 7;
export const SESSION_COOKIE = "__Host-katalhys_admin";

const enc = new TextEncoder();
const b64 = (bytes: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function pbkdf2(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2-sha256$${ITERATIONS}$${b64(salt)}$${b64(await pbkdf2(password, salt, ITERATIONS))}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, iterations, salt, hash] = stored.split("$");
  if (scheme !== "pbkdf2-sha256" || !salt || !hash) return false;
  const actual = new Uint8Array(await pbkdf2(password, unb64(salt), Number(iterations)));
  const expected = unb64(hash);
  // Constant-time comparison.
  let diff = actual.length ^ expected.length;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ (expected[i] ?? 0);
  return diff === 0;
}

/** Password rule shared by setup and user creation. */
export const passwordProblem = (p: string) => (p.length < 12 ? "short" : p.length > 200 ? "long" : null);

const sha256 = async (s: string) => b64(await crypto.subtle.digest("SHA-256", enc.encode(s)));

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

// A fixed hash keeps the timing of unknown-email logins close to a wrong password.
const DUMMY = "pbkdf2-sha256$100000$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

export async function login(db: Db, email: string, password: string) {
  const user = await db
    .prepare("SELECT id, email, name, password_hash FROM admin_users WHERE email = ?1 AND active = 1")
    .bind(email.trim())
    .first<AdminUser & { password_hash: string }>();
  const ok = await verifyPassword(password, user?.password_hash ?? DUMMY);
  if (!user || !ok) return null;
  const token = b64(crypto.getRandomValues(new Uint8Array(32)));
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 86_400_000);
  await db
    .prepare("INSERT INTO admin_sessions (token_hash, user_id, created_at, expires_at) VALUES (?1, ?2, ?3, ?4)")
    .bind(await sha256(token), user.id, now.toISOString(), expires.toISOString())
    .run();
  return { token, expires, user: { id: user.id, email: user.email, name: user.name } };
}

export async function sessionUser(db: Db, token: string | undefined) {
  if (!token) return null;
  return db
    .prepare(
      `SELECT u.id, u.email, u.name FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
       WHERE s.token_hash = ?1 AND s.expires_at > ?2 AND u.active = 1`,
    )
    .bind(await sha256(token), new Date().toISOString())
    .first<AdminUser>();
}

export async function logout(db: Db, token: string | undefined) {
  if (token) await db.prepare("DELETE FROM admin_sessions WHERE token_hash = ?1").bind(await sha256(token)).run();
}

/** Every admin POST must come from a page on this origin (SameSite=Strict is the first layer). */
export const sameOrigin = (request: Request) => request.headers.get("origin") === new URL(request.url).origin;

export const countUsers = async (db: Db) => (await db.prepare("SELECT COUNT(*) AS n FROM admin_users").first<{ n: number }>())?.n ?? 0;

export async function createUser(db: Db, u: { email: string; name: string; password: string }) {
  const result = await db
    .prepare("INSERT OR IGNORE INTO admin_users (email, name, password_hash, created_at) VALUES (?1, ?2, ?3, ?4)")
    .bind(u.email.trim(), u.name.trim(), await hashPassword(u.password), new Date().toISOString())
    .run();
  return result.meta.changes > 0;
}

export const listUsers = async (db: Db) =>
  (await db.prepare("SELECT id, email, name, active, created_at FROM admin_users ORDER BY id").all<AdminUser & { active: number; created_at: string }>()).results;

/** Deactivating ends the user's sessions. Nobody can deactivate themself, so one active admin always remains. */
export async function setUserActive(db: Db, actor: AdminUser, id: number, active: boolean) {
  if (id === actor.id) return false;
  await db.batch([
    db.prepare("UPDATE admin_users SET active = ?2 WHERE id = ?1").bind(id, active ? 1 : 0),
    ...(active ? [] : [db.prepare("DELETE FROM admin_sessions WHERE user_id = ?1").bind(id)]),
  ]);
  return true;
}

/** Changing a password ends every other session of that user. */
export async function changePassword(db: Db, user: AdminUser, current: string, next: string, keepToken: string) {
  const row = await db.prepare("SELECT password_hash FROM admin_users WHERE id = ?1").bind(user.id).first<{ password_hash: string }>();
  if (!row || !(await verifyPassword(current, row.password_hash))) return false;
  await db.batch([
    db.prepare("UPDATE admin_users SET password_hash = ?2 WHERE id = ?1").bind(user.id, await hashPassword(next)),
    db.prepare("DELETE FROM admin_sessions WHERE user_id = ?1 AND token_hash != ?2").bind(user.id, await sha256(keepToken)),
  ]);
  return true;
}
