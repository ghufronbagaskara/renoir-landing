// End-to-end test of the built Worker: runs dist/server in a local workerd (Alchemy's cloudflare-runtime, the
// same runtime `bun run build` prerenders with) with a fresh local D1, the rate-limit binding, static assets and
// Turnstile's always-pass test keys. Nothing touches Cloudflare. Then exercises /api/contact, D1 and /admin/* over
// HTTP and in Chrome (desktop and phone).
//   bun run build && bun scripts/e2e-worker.ts
import { layerRuntime, Runtime } from "@alchemy.run/cloudflare-runtime/core";
import { Assets, D1, RateLimit, Text } from "@alchemy.run/cloudflare-runtime/core/bindings";
import * as NodeServices from "@effect/platform-node/NodeServices";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { chromium, type Page } from "playwright";

const SETUP = "e2e-setup-token";
const DB_ID = "dev:e2e-leads";
const storage = mkdtempSync(join(tmpdir(), "katalhys-e2e-"));
const results: string[] = [];
const pass = (name: string) => { results.push(name); console.log(`PASS ${name}`); };

function serverModules() {
  const root = "dist/server";
  const files = (readdirSync(root, { recursive: true }) as string[]).filter((f) => f.endsWith(".mjs")).map((f) => f.replace(/\\/g, "/"));
  files.sort((a, b) => (a === "entry.mjs" ? -1 : b === "entry.mjs" ? 1 : a.localeCompare(b)));
  return files.map((name) => ({ name, type: "ESModule" as const, content: readFileSync(join(root, name), "utf8") }));
}

// Applies migrations/*.sql through a tiny helper worker bound to the same local database.
const MIGRATE = `export default { async fetch(req, env) {
  const sql = (await req.text()).replace(/--.*$/gm, "");
  const statements = sql.split(";").map((s) => s.trim()).filter(Boolean);
  await env.DB.batch(statements.map((s) => env.DB.prepare(s)));
  return new Response(String(statements.length));
} };`;

const program = Effect.gen(function* () {
  const runtime = yield* Runtime;
  const db = D1.local({ binding: "DB", id: DB_ID });
  const migrateUrl = yield* runtime.start({
    name: "e2e-migrate",
    compatibilityDate: "2026-09-01",
    compatibilityFlags: ["nodejs_compat"],
    bindings: [db],
    modules: [{ name: "main.mjs", type: "ESModule", content: MIGRATE }],
  });
  for (const file of readdirSync("migrations").filter((f) => f.endsWith(".sql")).sort()) {
    const res = yield* Effect.promise(() => fetch(migrateUrl, { method: "POST", body: readFileSync(join("migrations", file), "utf8") }));
    assert.equal(res.status, 200, `migration ${file}`);
  }
  const url = yield* runtime.start({
    name: "renoir-landing",
    compatibilityDate: "2026-09-01",
    compatibilityFlags: ["nodejs_compat"],
    bindings: [
      db,
      RateLimit.local({ binding: "THROTTLE", namespaceId: "1001", simple: { limit: 5, period: 60 } }),
      Assets.local("ASSETS"),
      Text.local("TURNSTILE_SITEKEY", "1x00000000000000000000AA"),
      Text.local("TURNSTILE_SECRET", "1x0000000000000000000000000000000AA"),
      Text.local("TELEGRAM_BOT_TOKEN", ""),
      Text.local("TELEGRAM_CHAT_ID", ""),
      Text.local("LEADS_WEBHOOK_URL", ""),
      Text.local("LEADS_WEBHOOK_SECRET", ""),
      Text.local("ADMIN_SETUP_TOKEN", SETUP),
    ],
    modules: serverModules(),
    // Worker exceptions and console output go to stderr (E2E_VERBOSE=1 adds workerd INFO logs).
    logging: { verbose: process.env.E2E_VERBOSE === "1", onOutput: (chunk) => process.stderr.write(chunk) },
    assets: { directory: join(process.cwd(), "dist/client"), htmlHandling: "auto-trailing-slash", notFoundHandling: "404-page", runWorkerFirst: ["/api/*", "/admin", "/admin/*"] }, // keep in sync with alchemy.run.ts
  });
  yield* Effect.promise(() => run(url.href.replace(/\/$/, "")));
});

// ---- Tests ---------------------------------------------------------------------------------------------
const form = (data: Record<string, string>) => new URLSearchParams(data);
const TOKEN = "XXXX.DUMMY.TOKEN.XXXX";
const quiz = {
  source: "quiz", locale: "id", name: "Budi E2E", channel: "whatsapp", whatsapp: "+62 812 0000 1111",
  quiz_industry: "distribution", quiz_goal: "workflow", quiz_current: "manual", quiz_detail: "several-teams",
  quiz_size: "small", quiz_timing: "quarter", budget: "25-50", submission_id: "4a1f6c2e-8a51-4c1f-9a39-1d2b3c4d5e6f",
  "cf-turnstile-response": TOKEN,
};

async function run(base: string) {
  // API calls share one client IP; the browser flows use another, so each stays under the 5/min limit.
  // Browsers always send Origin on POST; Astro rejects cross-site form posts without it.
  const json = { accept: "application/json", "cf-connecting-ip": "203.0.113.10", origin: base };
  const post = (path: string, body: URLSearchParams, headers: Record<string, string> = {}) =>
    // keepalive: false — a rejected cross-site POST leaves its body unread and workerd closes that socket.
    fetch(base + path, { method: "POST", body, headers, redirect: "manual", keepalive: false });

  // Static pages come from the asset layer; unknown paths get the 404 page.
  for (const path of ["/", "/id/", "/id/mulai/", "/start/", "/id/cara-kerja/", "/privacy/"]) assert.equal((await fetch(base + path)).status, 200, path);
  assert.equal((await fetch(base + "/does-not-exist/")).status, 404);
  pass("static pages and 404 through the asset layer");

  assert.deepEqual(await (await fetch(base + "/api/contact/")).json(), { sitekey: "1x00000000000000000000AA" });
  assert.equal((await post("/api/contact/", form({ ...quiz, source: "bogus" }), json)).status, 400);
  assert.equal((await post("/api/contact/", form(quiz), { ...json, origin: "https://evil.example" })).status, 403, "cross-site form post refused");
  pass("contact API: sitekey and schema rejection");

  const ok = async (body: Record<string, string>) => {
    const res = await post("/api/contact/", form(body), json);
    assert.deepEqual([res.status, await res.json()], [200, { status: "sent" }]);
  };
  await ok(quiz);
  await ok(quiz); // retry with the same submission id
  await ok({ source: "contact", locale: "en", name: "Ada E2E", email: "ada@example.com", build_type: "marketing", message: "We need a new marketing site.", "cf-turnstile-response": TOKEN });
  const noJs = await post("/api/contact/", form({ ...quiz, name: "NoJs E2E", submission_id: "9b2e1d4c-7f6a-4e3b-8c2d-1a0b9c8d7e6f", locale: "en" }), { "cf-connecting-ip": json["cf-connecting-ip"], origin: base });
  assert.equal(noJs.status, 303);
  assert.equal(new URL(noJs.headers.get("location")!, base).pathname + new URL(noJs.headers.get("location")!, base).search, "/start/?sent=1");
  pass("contact API: quiz, idempotent retry, contact form and no-JS redirect");

  // Admin is private before an account exists.
  const toLogin = await fetch(base + "/admin/", { redirect: "manual" });
  assert.equal(toLogin.status, 302);
  assert.match(toLogin.headers.get("location")!, /\/admin\/login\/$/);
  const setupPage = await fetch(base + "/admin/setup/");
  assert.equal(setupPage.status, 200);
  assert.equal(setupPage.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.equal(setupPage.headers.get("cache-control"), "no-store");
  const origin = { origin: base };
  const account = { name: "Owner E2E", email: "owner@example.com", password: "correct horse battery", confirm: "correct horse battery" };
  assert.equal((await post("/admin/setup/", form({ ...account, token: SETUP }), { origin: "https://evil.example" })).status, 403);
  assert.equal((await post("/admin/setup/", form({ ...account, token: "wrong" }), origin)).status, 400);
  assert.equal((await post("/admin/setup/", form({ ...account, token: SETUP }), origin)).status, 303);
  assert.equal((await fetch(base + "/admin/setup/")).status, 404, "setup closes after the first account");
  pass("admin setup: noindex/no-store, origin check, token check, closes afterwards");

  assert.equal((await post("/admin/login/", form({ email: account.email, password: "wrong password!" }), origin)).status, 401);
  const login = await post("/admin/login/", form({ email: account.email, password: account.password }), origin);
  assert.equal(login.status, 303);
  const cookie = login.headers.get("set-cookie")!;
  assert.match(cookie, /^__Host-katalhys_admin=/);
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /Secure/i);
  assert.match(cookie, /SameSite=Strict/i);
  const session = { cookie: cookie.split(";")[0] };
  pass("admin login: wrong password refused, secure session cookie");

  const list = await (await fetch(base + "/admin/", { headers: session })).text();
  assert.equal((list.match(/Budi E2E/g) ?? []).length, 1, "retried quiz lead stored once");
  assert.ok(list.includes("Ada E2E"));
  const quizOnly = await (await fetch(base + "/admin/?source=quiz", { headers: session })).text();
  assert.ok(quizOnly.includes("Budi E2E") && !quizOnly.includes("Ada E2E"));
  const searched = await (await fetch(base + "/admin/?q=ada%40", { headers: session })).text();
  assert.ok(searched.includes("Ada E2E") && !searched.includes("Budi E2E"));
  pass("admin list: stored leads, idempotency, source filter, search");

  const detailPath = `/admin/leads/${quiz.submission_id}/`;
  const detail = await (await fetch(base + detailPath, { headers: session })).text();
  for (const text of ["Distribusi, manufaktur, atau grosir", "Beberapa tim saling menyerahkan pekerjaan", "6–20 orang", "Rp25–50 juta", "Satu rilis pertama yang fokus", "wa.me/6281200001111"]) assert.ok(detail.includes(text), `detail shows ${text}`);
  assert.equal((await post(detailPath, form({ action: "update", status: "contacted", notes: "Called", follow_up_on: "2026-11-20" }), { ...session, origin: "https://evil.example" })).status, 403);
  const saved = await post(detailPath, form({ action: "update", status: "contacted", notes: "Called", follow_up_on: "2026-11-20" }), { ...session, ...origin });
  assert.equal(saved.status, 303);
  assert.match(saved.headers.get("location")!, /\?saved=1$/);
  const updated = await (await fetch(new URL(saved.headers.get("location")!, base), { headers: session })).text();
  assert.ok(updated.includes("Perubahan tersimpan") && updated.includes("status new → contacted") && updated.includes("2026-11-20"));
  pass("admin detail: quiz answers, cross-origin update refused, status/notes/follow-up history");

  const users = await post("/admin/users/", form({ action: "create", name: "Second", email: "second@example.com", password: "another long password" }), { ...session, ...origin });
  assert.equal(users.status, 200);
  assert.ok((await users.text()).includes("second@example.com"));
  const second = await post("/admin/login/", form({ email: "second@example.com", password: "another long password" }), origin);
  assert.equal(second.status, 303);
  pass("admin accounts: create and sign in a second admin");

  assert.equal((await post(detailPath, form({ action: "delete", confirm: "nope" }), { ...session, ...origin })).status, 400);
  assert.equal((await post(detailPath, form({ action: "delete", confirm: "HAPUS" }), { ...session, ...origin })).status, 303);
  assert.equal((await fetch(base + detailPath, { headers: session })).status, 404);
  pass("admin delete: confirmation required, lead removed");

  await browserFlows(base, account);

  // Fifth submission from the API client is accepted, the sixth inside the minute is rate limited.
  await ok({ ...quiz, name: "Fifth E2E", submission_id: "5e4d3c2b-1a09-4f8e-9d7c-6b5a4f3e2d1c" });
  const limited = await post("/api/contact/", form({ ...quiz, submission_id: "0c9d8e7f-6a5b-4c3d-9e2f-1a2b3c4d5e6f" }), json);
  assert.deepEqual([limited.status, await limited.json()], [429, { status: "rate_limited" }]);
  pass("contact API: rate limit after five submissions");

  const out = await post("/admin/logout/", form({}), { ...session, ...origin });
  assert.equal(out.status, 303);
  assert.equal((await fetch(base + "/admin/", { headers: session, redirect: "manual" })).status, 302, "session ended");
  pass("admin logout ends the session");
}

async function browserFlows(base: string, account: { email: string; password: string }) {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const errors: string[] = [];
  const open = async (viewport: { width: number; height: number }) => {
    const page = await browser.newPage({ viewport });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => localStorage.setItem("katalhys.consent.v1", JSON.stringify({ v: 1, analytics: false, marketing: false, at: "e2e" })));
    return page;
  };
  try {
    // Phone: answer the questionnaire and send the summary through the real form, Turnstile and API.
    const phone = await open({ width: 390, height: 844 });
    await phone.goto(base + "/id/mulai/");
    await phone.locator("[data-quiz-start]").click();
    for (const value of ["services", "leads", "existing", "search", "solo", "now", "10-25"]) {
      await phone.locator(`[data-quiz-step]:not([hidden]) input[value="${value}"]`).click();
      await phone.waitForTimeout(350);
    }
    assert.equal(await phone.locator("[data-result]:not([hidden])").getAttribute("data-result"), "marketing");
    await phone.locator("[data-quiz-send]").click();
    await phone.locator("#quiz-name").fill("Sari Browser");
    await phone.locator('input[name="channel"][value="email"]').check();
    await phone.locator("#quiz-email").fill("sari@example.com");
    await phone.locator("#quiz-note").fill("Website kami lama dan jarang mendatangkan pertanyaan.");
    await phone.locator("[data-quiz-contact] [type=submit]").click();
    await phone.waitForFunction(() => document.querySelector("[data-quiz-contact] [data-form-status]")?.getAttribute("data-state") === "ok", null, { timeout: 30000 });
    assert.equal(await phone.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    pass("browser (phone): seven-question quiz submitted through Turnstile to D1");

    // Phone: admin sign-in, lead list and detail stay usable without page overflow.
    // A real browser navigation (Sec-Fetch-Mode: navigate) must reach the Worker, not the 404 page.
    assert.equal((await phone.goto(base + "/admin/login/"))?.status(), 200, "admin login reachable by navigation");
    await phone.locator("#email").fill(account.email);
    await phone.locator("#password").fill(account.password);
    await phone.locator("button[type=submit]").click();
    await phone.waitForURL("**/admin/");
    assert.ok(await phone.getByText("Sari Browser").isVisible());
    assert.equal(await phone.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "admin list fits the phone (table scrolls inside its card)");
    await phone.getByRole("link", { name: "Sari Browser" }).click();
    await phone.waitForURL("**/admin/leads/**");
    assert.ok(await phone.getByText("Situs marketing untuk mendatangkan pertanyaan").isVisible());
    assert.equal(await phone.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "lead detail fits the phone");
    await phone.locator("#status").selectOption("qualified");
    await phone.getByRole("button", { name: "Simpan" }).click();
    await phone.waitForURL("**?saved=1");
    assert.equal(await phone.locator("#status").inputValue(), "qualified");
    pass("browser (phone): admin login, list, detail and status update");

    // Desktop: contact page form end to end.
    const desk = await open({ width: 1366, height: 860 });
    await desk.goto(base + "/contact/");
    const contact = desk.locator("[data-contact-form]").first();
    await contact.locator('input[name="name"]').fill("Desk Browser");
    await contact.locator('input[name="email"]').fill("desk@example.com");
    await contact.locator('select[name="build_type"]').selectOption("internal");
    await contact.locator('textarea[name="message"]').fill("Our orders live in three spreadsheets.");
    await contact.locator("[type=submit]").click();
    await desk.waitForFunction(() => document.querySelector("[data-contact-form] [data-form-status]")?.getAttribute("data-state"), null, { timeout: 30000 });
    assert.equal(await contact.locator("[data-form-status]").getAttribute("data-state"), "ok", await contact.locator("[data-form-status]").textContent() ?? "");
    pass("browser (desktop): contact form submitted through Turnstile to D1");
    assert.deepEqual(errors, [], "no page errors");
  } finally {
    await browser.close();
  }
}

const layer = layerRuntime({ api: { accountId: "e2e-local" }, storage: { directory: storage } }).pipe(
  Layer.provideMerge(Layer.mergeAll(NodeServices.layer, FetchHttpClient.layer)),
);
let code = 0;
try {
  await Effect.runPromise(program.pipe(Effect.scoped, Effect.provide(layer)) as Effect.Effect<void>);
  console.log(`PASS: ${results.length} Worker end-to-end scenarios`);
} catch (error) {
  console.error(error);
  code = 1;
} finally {
  try { rmSync(storage, { recursive: true, force: true }); } catch { /* workerd may still hold files on Windows */ }
  process.exit(code);
}
