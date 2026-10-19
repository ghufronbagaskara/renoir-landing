import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:4322";
const output = ".work-capture/mobile-polish/density";
const browser = await chromium.launch({ channel: "chrome" });
const records = [];
await mkdir(output, { recursive: true });

async function fit(page, selector, label) {
  const bounds = await page.locator(selector).evaluate((el) => ({ height: el.getBoundingClientRect().height, viewport: innerHeight }));
  assert.ok(bounds.height <= bounds.viewport + 1, `${label}: ${Math.round(bounds.height)}px exceeds ${bounds.viewport}px`);
  records.push({ label, height: Math.round(bounds.height), viewport: bounds.viewport });
}

try {
  for (const [width, height] of [[320, 844], [360, 780], [390, 844], [430, 932]]) {
    const page = await browser.newPage({ viewport: { width, height }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    for (const locale of ["en", "id"]) {
      await page.goto(base + (locale === "en" ? "/" : "/id/"));
      await page.waitForSelector(".works-wheel.is-enhanced");
      await page.evaluate(() => document.fonts.ready);
      for (const section of await page.locator("main > section, footer").all()) {
        const name = await section.evaluate((el) => el.id || el.classList[0]);
        const bounds = await section.boundingBox();
        assert.ok(bounds.height <= height + 1, `${locale}/${width}/${name}: ${Math.round(bounds.height)}px exceeds ${height}px`);
        records.push({ label: `${locale}/${width}/${name}`, height: Math.round(bounds.height), viewport: height });
      }
      for (let index = 0; index < 4; index++) {
        await page.locator(`#service-tab-${index}`).tap();
        await page.waitForFunction(() => !document.querySelector(".works-wheel").classList.contains("is-overview"));
        await fit(page, ".home-services", `${locale}/${width}/service-${index}`);
        const selectedImage = page.locator(".wheel-card:not([inert]):visible");
        assert.equal(await selectedImage.count(), 1);
        assert.ok(await selectedImage.evaluate((el) => el.getBoundingClientRect().width >= 120), "Selected service artwork stays readable");
        await page.locator(".engagement-item summary").nth(index).tap();
        await page.waitForTimeout(60);
        await fit(page, ".engagement-rail", `${locale}/${width}/engagement-${index}`);
      }
      for (let index = 0; index < 5; index++) {
        await page.locator(`#work-tab-${index}`).tap();
        await fit(page, ".home-featured-work", `${locale}/${width}/work-${index}`);
        const extra = page.locator(`#work-panel-${index} .home-project-extra`);
        await extra.locator("summary").tap();
        assert.notEqual(await extra.getAttribute("open"), null);
        await fit(page, `#work-panel-${index}`, `${locale}/${width}/expanded-work-${index}`);
        await extra.locator("summary").tap();
      }
      for (const button of await page.locator("#home-faq .accordion-buttons").all()) {
        await button.tap();
        await page.waitForTimeout(60);
        await fit(page, ".si-faq-area", `${locale}/${width}/faq-${await button.getAttribute("aria-controls")}`);
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `${output}/${locale}-${width}-header.png` });
      await page.locator("#the-problem").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${output}/${locale}-${width}-problem.png` });
      await page.evaluate(() => scrollTo(0, innerHeight + 100));
      await page.waitForFunction(() => !document.body.classList.contains("home-hero-visible"));
      assert.equal(await page.locator(".home-header .renoir-brand").evaluate((el) => getComputedStyle(el).backgroundColor), "rgba(0, 0, 0, 0)");
      assert.equal(await page.locator(".home-header .renoir-wordmark").evaluate((el) => getComputedStyle(el).color), "rgb(23, 25, 28)");
      assert.equal(await page.locator(".home-menu-label").isVisible(), true);
      assert.equal(await page.locator(".home-nav-lang").isVisible(), false);
      await page.locator(".home-menu-button").tap();
      assert.equal(await page.locator(".offcanvas-lang").isVisible(), true);
      await page.keyboard.press("Escape");
      console.log(`PASS ${locale}/${width}x${height}: sections, expanded services/engagement/Work/FAQ, transparent logo and compact navigation`);
    }
    await page.close();
  }

  const catalog = JSON.parse(await readFile("dist/client/search-index.json", "utf8"));
  for (const width of [360, 430]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    for (const route of [...new Set(catalog.map((entry) => entry.url))]) {
      await page.goto(base + route);
      await page.evaluate(() => document.fonts.ready);
      const components = await page.locator(".si-service-2-box, .work-featured-card, [data-work-card]:visible, [data-note-card]:visible, .work-case-feature, .si-contact-main, .internal-flow, .studio-work-story, .about-fit-group, .notes-track .si-blog-box, footer").evaluateAll((elements) => elements.filter((el) => el.getBoundingClientRect().height > 0).map((el) => ({ name: el.className, height: el.getBoundingClientRect().height })));
      for (const component of components) {
        assert.ok(component.height <= 845, `${route}/${width}/${component.name}: ${Math.round(component.height)}px`);
        records.push({ label: `${route}/${width}/${component.name}`, height: Math.round(component.height), viewport: 844 });
      }
    }
    await page.close();
  }
  await writeFile(`${output}/results.json`, JSON.stringify(records, null, 2));
  console.log(`PASS ${records.length} section, state and component height checks`);
} finally {
  await browser.close();
}
