import { describe, expect, test } from "bun:test";
import { changePassword, countUsers, createUser, login, logout, sessionUser, setUserActive, verifyPassword } from "./auth";
import { memoryDb } from "./test-db";

describe("admin auth", () => {
  test("login, session lookup, logout", async () => {
    const db = memoryDb();
    expect(await countUsers(db)).toBe(0);
    expect(await createUser(db, { email: "Owner@Example.com", name: "Owner", password: "correct horse battery" })).toBe(true);
    expect(await createUser(db, { email: "owner@example.com", name: "Dup", password: "correct horse battery" })).toBe(false);
    expect(await login(db, "owner@example.com", "wrong password here")).toBeNull();
    expect(await login(db, "nobody@example.com", "correct horse battery")).toBeNull();
    const s = (await login(db, "owner@example.com", "correct horse battery"))!;
    expect((await sessionUser(db, s.token))?.name).toBe("Owner");
    expect(await sessionUser(db, s.token + "x")).toBeNull();
    await logout(db, s.token);
    expect(await sessionUser(db, s.token)).toBeNull();
  });

  test("deactivation ends sessions; nobody can deactivate themself", async () => {
    const db = memoryDb();
    await createUser(db, { email: "a@example.com", name: "A", password: "correct horse battery" });
    await createUser(db, { email: "b@example.com", name: "B", password: "correct horse battery" });
    const a = (await login(db, "a@example.com", "correct horse battery"))!;
    const b = (await login(db, "b@example.com", "correct horse battery"))!;
    expect(await setUserActive(db, a.user, a.user.id, false)).toBe(false);
    expect(await setUserActive(db, a.user, b.user.id, false)).toBe(true);
    expect(await sessionUser(db, b.token)).toBeNull();
    expect(await login(db, "b@example.com", "correct horse battery")).toBeNull();
  });

  test("password change keeps only the current session", async () => {
    const db = memoryDb();
    await createUser(db, { email: "a@example.com", name: "A", password: "correct horse battery" });
    const one = (await login(db, "a@example.com", "correct horse battery"))!;
    const two = (await login(db, "a@example.com", "correct horse battery"))!;
    expect(await changePassword(db, one.user, "wrong", "another long password", one.token)).toBe(false);
    expect(await changePassword(db, one.user, "correct horse battery", "another long password", one.token)).toBe(true);
    expect(await sessionUser(db, one.token)).not.toBeNull();
    expect(await sessionUser(db, two.token)).toBeNull();
    expect(await verifyPassword("anything", "not-a-hash")).toBe(false);
  });
});
