import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4322";
const output = ".work-capture/mobile-polish/after";
const catalog = JSON.parse(await readFile("dist/client/search-index.json", "utf8"));
const routes = [...new Set([...catalog.map((entry) => entry.url), "/404.html"])];
const browser = await chromium.launch({ channel: "chrome" });
const results = [];
const interactions = [];
await mkdir(output, { recursive: true });

async function load(page, route) {
  assert.equal((await page.goto(base + route)).status(), 200, route);
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const img of document.images) img.loading = "eager";
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
  });
}

try {
  for (const width of [320, 360, 390, 430, 600, 767, 768, 820, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      await load(page, route);
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        brokenImages: [...document.images].filter((img) => !img.naturalWidth).map((img) => img.src),
        clippedHeadings: [...document.querySelectorAll("main h1, main h2, main h3")].filter((el) => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent),
      }));
      assert.ok(state.overflow <= 1, `${route}/${width}: ${state.overflow}px page overflow`);
      assert.deepEqual(state.brokenImages, [], `${route}/${width}: image load`);
      assert.deepEqual(state.clippedHeadings, [], `${route}/${width}: heading overflow`);
      if (width < 768) {
        assert.ok(await page.locator(".home-nav-shell").evaluate((el) => el.getBoundingClientRect().height < 70), "compact navigation");
        for (const control of await page.locator(".home-nav-actions :is(a, button):visible").all()) {
          assert.ok(await control.evaluate((el) => { const r = el.getBoundingClientRect(); return r.width >= 44 && r.height >= 44; }), `${route}: header tap target`);
        }
        const contact = page.locator(".floating-contact:visible");
        if (await contact.count()) assert.ok(await contact.evaluate((el) => el.getBoundingClientRect().top >= document.querySelector("main").getBoundingClientRect().bottom - 1), `${route}: CTA follows content`);
        const fields = page.locator("[data-contact-form] :is(input:not([type=hidden]), select, textarea):visible");
        for (const field of await fields.all()) {
          assert.ok(await field.evaluate((el) => el.getBoundingClientRect().height >= 44 && parseFloat(getComputedStyle(el).fontSize) >= 16 && el.labels[0].getBoundingClientRect().height > 0), `${route}: field height, font and persistent label`);
        }
        assert.ok(await page.locator(".accordion-buttons").evaluateAll((buttons) => buttons.every((el) => {
          const button = el.getBoundingClientRect(), icon = el.querySelector(".accordion-icon").getBoundingClientRect();
          return !button.width || (icon.top >= button.top + 9 && icon.top <= button.bottom - 9 && parseFloat(getComputedStyle(el).fontSize) <= 17);
        })), `${route}: FAQ icons remain inside compact question buttons`);
        if (route === "/portfolio/" || route === "/id/karya/" || route === "/notes/" || route === "/id/catatan/") {
          const selector = route.includes("notes") || route.includes("catatan") ? "[data-note-card]" : ".work-featured-card";
          const positions = await page.locator(selector).evaluateAll((nodes) => nodes.slice(0, 2).map((el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y }; }));
          assert.ok(Math.abs(positions[0].y - positions[1].y) < 1 && positions[1].x > positions[0].x, `${route}: retained two-column catalogue`);
        }
      }
      results.push({ route, width, overflow: state.overflow });
      if (width === 390) {
        const slug = route === "/" ? "home" : route.replaceAll("/", "-").replace(/^-|-$/g, "");
        await page.screenshot({ path: `${output}/${slug}.png`, fullPage: true });
      }
    }
    assert.deepEqual(errors, [], `${width}: browser errors`);
    await page.close();
    console.log(`PASS ${width}px: ${routes.length} public routes`);
  }

  for (const locale of ["en", "id"]) {
    const home = locale === "en" ? "/" : "/id/";
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    await load(page, home);
    await page.locator(".home-menu-button").tap();
    assert.equal(await page.locator("#main").evaluate((el) => el.inert), true);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#main").evaluate((el) => el.inert), false);
    assert.equal(await page.locator(".home-menu-button").getAttribute("aria-expanded"), "false");
    interactions.push(`${locale}: menu tap opens; Escape closes and releases background`);
    await page.locator(".si-search-open-btn").tap();
    await page.locator("#site-search-input").fill("no-result-mobile-check-zzzz");
    await page.waitForFunction(() => document.querySelector("[data-search-results]").textContent.trim().length > 0 && !document.querySelector("[data-search-results] a"));
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#site-search").getAttribute("open"), null);
    interactions.push(`${locale}: search opens, empty results render, Escape closes`);
    for (let i = 0; i < 4; i++) {
      await page.locator(`#service-tab-${i}`).tap();
      assert.equal(await page.locator(`#service-panel-${i}`).isVisible(), true);
      assert.ok(await page.locator(`#service-tab-${i}`).evaluate((el) => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }));
    }
    interactions.push(`${locale}: all four visible service choices select their panel`);
    await page.locator(".process-mobile summary").nth(2).tap();
    assert.equal(await page.locator(".process-mobile p").first().evaluate((el) => getComputedStyle(el).fontSize), "13px");
    assert.equal(await page.locator(".process-mobile details[open]").count(), 1);
    assert.notEqual(await page.locator(".process-mobile details").nth(2).getAttribute("open"), null);
    await page.locator(".process-mobile summary").nth(1).focus();
    await page.keyboard.press("Enter");
    assert.notEqual(await page.locator(".process-mobile details").nth(1).getAttribute("open"), null);
    interactions.push(`${locale}: Process touch and keyboard open one complete stage`);
    await page.locator(".engagement-item summary").nth(2).tap();
    assert.notEqual(await page.locator(".engagement-item").nth(2).getAttribute("open"), null);
    const question = page.locator("#home-faq .accordion-buttons").nth(1);
    await question.tap();
    assert.equal(await question.getAttribute("aria-expanded"), "true");
    interactions.push(`${locale}: engagement and FAQ tap reveal their content`);
    await load(page, locale === "en" ? "/contact/" : "/id/kontak/");
    await page.locator("[data-contact-form] button[type=submit]").tap();
    assert.equal(await page.locator("[data-contact-form]").evaluate((form) => form.checkValidity()), false);
    assert.ok(await page.locator(":focus").evaluate((el) => el.matches("input:invalid, select:invalid, textarea:invalid")));
    interactions.push(`${locale}: empty contact submit focuses native invalid field`);
    await page.close();

    const noJs = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    await load(noJs, home);
    await noJs.locator(".process-mobile summary").nth(3).click();
    assert.notEqual(await noJs.locator(".process-mobile details").nth(3).getAttribute("open"), null);
    assert.equal(await noJs.locator(".home-project-panel:visible").count(), 5);
    interactions.push(`${locale}: no-JS Process disclosure and all Work panels remain available`);
    await noJs.close();
  }
  await writeFile(`${output}/results.json`, JSON.stringify({ screens: results, interactions }, null, 2));
  console.log(`PASS ${results.length} route/viewport checks; ${interactions.length} interaction/fallback checks`);
} finally {
  await browser.close();
}
