import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4322";
const output = ".work-capture/mobile-polish/notes-search";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
let checks = 0;
const errors = [];

async function open(page, route) {
  await page.goto(base + route, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".home-nav-actions .si-search-open-btn:visible").click();
  await page.locator("#site-search-input").waitFor();
}

async function centered(page) {
  const geometry = await page.locator("#site-search").evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height, vw: visualViewport.width, vh: visualViewport.height, overflow: el.scrollWidth - el.clientWidth };
  });
  assert.ok(Math.abs(geometry.x - (geometry.vw - geometry.right)) <= 1.5, `Balanced horizontal margins: ${JSON.stringify(geometry)}`);
  assert.ok(Math.abs(geometry.y - (geometry.vh - geometry.bottom)) <= 1.5, "Vertically centered dialog");
  assert.ok(geometry.y >= 15 && geometry.bottom <= geometry.vh - 15 && geometry.overflow <= 1, "Dialog stays within viewport");
  return geometry;
}

try {
  for (const [width, height] of [[320, 568], [360, 780], [394, 852], [430, 932], [767, 852], [1440, 1000]]) {
    const page = await browser.newPage({ viewport: { width, height }, isMobile: width < 768, hasTouch: width < 768, reducedMotion: "reduce" });
    page.on("pageerror", (error) => errors.push(error.message));
    for (const [locale, route] of [["en", "/notes/"], ["id", "/id/catatan/"]]) {
      await page.goto(base + route, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      const cards = await page.locator("[data-note-card]").evaluateAll((els) => els.map((el) => {
        const title = el.querySelector("h2");
        const byline = el.querySelector(".notes-card-byline");
        return { height: el.getBoundingClientRect().height, x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y, title: parseFloat(getComputedStyle(title).fontSize), clipped: title.scrollWidth - title.clientWidth, byline: byline.getBoundingClientRect().height, bylineLine: parseFloat(getComputedStyle(byline).lineHeight) };
      }));
      assert.equal(cards.length, 3);
      assert.ok(cards[1].x > cards[0].x && Math.abs(cards[0].y - cards[1].y) < 1, "Retained two-column Notes");
      assert.ok(cards.every((card) => card.clipped <= 1));
      if (width < 768) {
        assert.ok(cards.every((card) => card.title <= 14 && card.height <= (width <= 430 ? 390 : height)), `${locale}/${width}: compact closed cards`);
        if (width >= 394) assert.ok(cards.every((card) => card.byline <= card.bylineLine + 1), "Date and author share one row");
        await page.locator("[data-note-card] details summary").first().click();
        assert.ok((await page.locator("[data-note-card]").first().boundingBox()).height <= height, "Expanded summary fits a phone screen");
        await page.locator("[data-note-card] details summary").first().click();
      }
      if (width === 394) await page.locator(".notes-grid").screenshot({ path: `${output}/${locale}-cards.png` });
      const readLink = page.locator("[data-note-card] .si-blog-standard-btn a").first();
      const readHref = await readLink.getAttribute("href");
      if (width < 768) assert.ok(await readLink.evaluate((el) => { const r = el.getBoundingClientRect(); return r.width >= 44 && r.height >= 44; }), "Compact read control retains a 44px target");
      await readLink.click();
      await page.waitForURL(new URL(readHref, base).href);
      await page.goto(base + route, { waitUntil: "domcontentloaded" });
      await page.locator(".home-nav-actions .si-search-open-btn:visible").click();
      const input = page.locator("#site-search-input");
      assert.equal(await input.evaluate((el) => el === document.activeElement), true);
      if (width < 768) {
        await centered(page);
        assert.ok(await input.evaluate((el) => parseFloat(getComputedStyle(el).fontSize) >= 16));
        assert.equal(await page.locator(".search-command-form").evaluate((el) => getComputedStyle(el).outlineStyle), "solid");
      }
      assert.equal(await page.locator(".search-command-recent img").count(), 3);
      await page.locator(".search-command-recent a").last().scrollIntoViewIfNeeded();
      assert.ok(await page.locator(".search-command-recent a").evaluateAll((links) => links.every((el) => { const image = el.querySelector("img").getBoundingClientRect(), title = el.querySelector("strong").getBoundingClientRect(); return image.right < title.left && el.getBoundingClientRect().height >= 44; })));
      if (width === 394) await page.screenshot({ path: `${output}/${locale}-search.png` });
      const initialHeight = (await page.locator("#site-search").boundingBox()).height;
      await input.fill(locale === "en" ? "handover" : "serah terima");
      await page.waitForSelector("[data-search-results] a");
      await page.waitForFunction(() => !document.querySelector("[data-search-results]").hasAttribute("aria-busy"));
      if (width < 768) {
        assert.equal((await centered(page)).height, initialHeight, "Search input does not jump between default/results");
      }
      await input.press("ArrowDown");
      assert.equal(await page.locator("[data-search-results] a").first().evaluate((el) => el === document.activeElement), true);
      await input.fill("zzzznomatchzzzz1022");
      await page.waitForFunction(() => !document.querySelector("[data-search-results]").hasAttribute("aria-busy") && document.querySelectorAll("[data-search-results] a").length === 0);
      await input.fill("");
      await page.waitForFunction(() => !document.querySelector("[data-search-default]").hidden);
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#site-search").evaluate((el) => el.open), false);
      assert.equal(await page.locator(".home-nav-actions .si-search-open-btn:visible").evaluate((el) => el === document.activeElement), true);
      checks++;
    }
    await page.close();
    console.log(`PASS ${width}×${height}: EN/ID Notes, centered search, thumbnails and result states`);
  }

  const page = await browser.newPage({ viewport: { width: 394, height: 400 }, reducedMotion: "reduce" });
  page.on("pageerror", (error) => errors.push(error.message));
  await open(page, "/notes/");
  await centered(page);
  await page.locator(".search-command-recent a").last().scrollIntoViewIfNeeded();
  assert.ok(await page.locator(".search-command-recent a").last().isVisible());
  const recentHref = await page.locator(".search-command-recent a").last().getAttribute("href");
  await page.locator(".search-command-recent a").last().click();
  await page.waitForURL(base + recentHref);
  checks++;

  await page.route("**/pagefind/**", (route) => route.abort());
  await open(page, "/id/catatan/");
  await page.locator("#site-search-input").fill("website");
  await page.waitForSelector("[data-search-results] a");
  const resultHref = await page.locator("[data-search-results] a").first().getAttribute("href");
  await page.locator("[data-search-results] a").first().click();
  await page.waitForURL(new URL(resultHref, base).href);
  checks++;

  await page.route("**/search-index.json", (route) => route.fulfill({ status: 503, body: "unavailable" }));
  await open(page, "/notes/");
  await page.locator("#site-search-input").fill("handover");
  await page.waitForFunction(() => {
    const dialog = document.querySelector("#site-search");
    const list = dialog.querySelector("[data-search-results]");
    return !list.hasAttribute("aria-busy") && list.textContent === dialog.getAttribute("data-unavailable");
  });
  await centered(page);
  await page.locator(".si-search-close-btn").click();
  assert.equal(await page.locator("#site-search").evaluate((el) => el.open), false);
  checks++;

  await page.locator(".home-nav-actions .si-search-open-btn:visible").click();
  await page.mouse.click(2, 2);
  assert.equal(await page.locator("#site-search").evaluate((el) => el.open), false);
  assert.equal(await page.locator("#main").evaluate((el) => el.inert), false);
  checks++;

  for (const route of ["/notes/", "/id/catatan/"]) {
    for (const selector of [".search-command-paths a", ".search-command-recent a"]) {
      await open(page, route);
      const count = await page.locator(selector).count();
      for (let index = 0; index < count; index++) {
        if (index > 0) await open(page, route);
        const link = page.locator(selector).nth(index);
        const href = await link.getAttribute("href");
        await (selector.includes("recent") ? link.locator("img") : link).click();
        await page.waitForURL(new URL(href, base).href);
        checks++;
      }
    }
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: ${checks} Notes/search scenarios; no page errors. Screenshots: ${output}`);
} finally {
  await browser.close();
}
