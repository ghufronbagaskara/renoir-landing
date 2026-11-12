// Built-site checks for the lead funnel: questionnaire (keyboard, pointer, branches, resume, channel),
// no-JS form, cookie choice, desktop menu panels and legal pages. Submission itself needs the Worker
// (covered by src/server/*.test.ts).
//   bun run build && bun run serve   then   node scripts/check-funnel.mjs [base]
import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4322";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = async (viewport, options = {}) => {
  const p = await browser.newPage({ viewport, ...options });
  p.on("pageerror", (e) => errors.push(e.message));
  return p;
};
let count = 0;
try {
  for (const [locale, route, expected] of [["en", "/start/", "A custom internal system"], ["id", "/id/mulai/", "Sistem internal custom"]]) {
    for (const viewport of [{ width: 1366, height: 860 }, { width: 375, height: 812 }]) {
      const p = await page(viewport);
      await p.goto(base + route);
      // Keyboard path: arrows browse without advancing; Next confirms.
      await p.locator("[data-quiz-start]").click();
      const goal = p.locator('[data-quiz-step="quiz_goal"]');
      await goal.locator("input").first().focus();
      await p.keyboard.press("Space");
      assert.ok(await goal.isVisible(), `${route}: keyboard choice does not auto-advance`);
      assert.equal(await p.locator("[data-quiz-progress-text]").textContent(), locale === "en" ? "Question 1 of 4" : "Pertanyaan 1 dari 4");
      await goal.locator("[data-quiz-next]").click();
      // Pointer path auto-advances.
      for (const value of ["manual", "several-teams", "quarter"]) {
        await p.locator(`[data-quiz-step]:not([hidden]) input[value="${value}"]`).click();
        await p.waitForTimeout(400);
      }
      const result = p.locator("[data-result]:not([hidden])");
      assert.equal(await result.getAttribute("data-result"), "internal");
      assert.equal((await result.locator("h3").textContent()).trim(), expected);
      assert.equal(await result.locator("[data-quiz-because] li").count(), 4);
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route}: no horizontal overflow`);

      // Draft survives a reload in the same tab.
      await p.reload();
      assert.equal(await p.locator("[data-result]:not([hidden])").getAttribute("data-result"), "internal", "draft resumes");

      // Editing the goal switches the branch question.
      await p.locator("[data-quiz-edit]").click();
      await p.locator('[data-quiz-step="quiz_goal"] input[value="leads"]').click();
      await p.waitForTimeout(400);
      await p.locator("[data-quiz-step]:not([hidden]) [data-quiz-next]").click();
      assert.equal(await p.locator("[data-quiz-step]:not([hidden])").getAttribute("data-branch"), "channel");
      await p.locator('[data-quiz-step]:not([hidden]) input[value="search"]').click();
      await p.waitForTimeout(400);
      await p.locator("[data-quiz-step]:not([hidden]) [data-quiz-next]").click();
      assert.equal(await p.locator("[data-result]:not([hidden])").getAttribute("data-result"), "marketing");

      // Contact step: only the chosen channel is required and submitted.
      await p.locator("[data-quiz-send]").click();
      await p.locator('input[name="channel"][value="whatsapp"]').check();
      const fields = await p.locator("[data-quiz-form]").evaluate((f) => [...new FormData(f).keys()]);
      assert.ok(fields.includes("whatsapp") && !fields.includes("email"), "WhatsApp channel submits only the number");
      assert.deepEqual(fields.filter((k) => k === "quiz_detail").length, 1, "one branch answer is submitted");
      assert.equal(await p.locator("#quiz-whatsapp").evaluate((i) => i.required), true);
      await p.close();
      count++;
    }
  }

  // Without JS every question is in one form that posts to /api/contact.
  const noJs = await page({ width: 390, height: 844 }, { javaScriptEnabled: false });
  await noJs.goto(base + "/id/mulai/");
  assert.equal(await noJs.locator("[data-quiz-form]").getAttribute("action"), "/api/contact");
  assert.ok((await noJs.locator("[data-quiz-step]:visible").count()) >= 4, "no-JS shows the questions");
  assert.ok(await noJs.locator("#quiz-name").isVisible());
  assert.equal(await noJs.locator("[data-consent-banner]").isVisible(), false, "no banner without JS");
  await noJs.close();
  count++;

  // Cookie choice persists, footer reopens settings, choice is announced.
  const c = await page({ width: 1366, height: 860 });
  await c.goto(base + "/");
  await c.locator("[data-consent-banner]").waitFor();
  await c.locator('[data-consent-banner] [data-consent="reject"]').click();
  assert.equal(await c.locator("[data-consent-banner]").isVisible(), false);
  assert.deepEqual(await c.evaluate(() => { const v = JSON.parse(localStorage.getItem("katalhys.consent.v1")); return [v.analytics, v.marketing]; }), [false, false]);
  await c.reload();
  assert.equal(await c.locator("[data-consent-banner]").isVisible(), false, "choice remembered");
  await c.evaluate(() => window.addEventListener("consent:change", (e) => (window.lastConsent = e.detail)));
  await c.locator("footer [data-consent-open]").click();
  await c.locator('[data-consent-dialog] input[name="analytics"]').check();
  await c.locator('[data-consent-dialog] [data-consent="save"]').click();
  assert.deepEqual(await c.evaluate(() => [window.lastConsent.analytics, window.lastConsent.marketing]), [true, false]);
  count++;

  // Desktop menu panels: hover for Services, click/Escape for Resources.
  await c.locator(".home-nav-links .nav-has-panel > a").first().hover();
  await c.waitForTimeout(250);
  assert.ok(await c.locator(".home-nav-links .nav-panel").first().isVisible(), "Services panel opens on hover");
  assert.equal(await c.locator(".home-nav-links .nav-panel").first().locator("a").count(), 5);
  await c.mouse.move(10, 600);
  const toggle = c.locator("[data-nav-toggle]");
  await toggle.click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "true");
  assert.ok(await c.locator("#" + (await toggle.getAttribute("aria-controls"))).isVisible());
  await c.keyboard.press("Escape");
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  await c.close();
  count++;

  // Legal and how-we-work pages: one index entry per section, footer links present.
  for (const route of ["/how-we-work/", "/privacy/", "/terms/", "/cookies/", "/id/cara-kerja/", "/id/privasi/", "/id/syarat/", "/id/cookie/"]) {
    const p = await page({ width: 390, height: 844 });
    await p.goto(base + route);
    assert.equal(await p.locator(".doc-toc li").count(), await p.locator(".doc-body section").count(), route);
    assert.equal(await p.locator(".footer-legal a").count(), 3, route);
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route}: no overflow`);
    await p.close();
    count++;
  }
  assert.deepEqual(errors, [], "no page errors");
  console.log(`PASS: ${count} funnel scenarios (questionnaire EN/ID desktop+phone, no-JS, cookie choice, menu panels, 8 trust pages)`);
} finally {
  await browser.close();
}
