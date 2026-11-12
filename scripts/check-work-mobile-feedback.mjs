import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4322";
const output = ".work-capture/mobile-polish/work-feedback";
const projects = ["order-sales", "industrial-coatings", "field-projects", "expert-profile", "maxy-ai", "ai-ceo-circle", "activity-review", "operations-control"];
const aiProjects = new Set(["order-sales", "industrial-coatings", "field-projects", "activity-review"]);
const browser = await chromium.launch({ channel: "chrome" });
await mkdir(output, { recursive: true });
let checks = 0;
const errors = [];

async function load(page, route) {
  assert.equal((await page.goto(base + route, { waitUntil: "domcontentloaded" })).status(), 200);
  await page.evaluate(() => document.fonts.ready);
}

try {
  for (const width of [320, 394, 767, 820, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 852 }, isMobile: width < 768, hasTouch: width < 768, reducedMotion: "reduce" });
    page.on("pageerror", (error) => errors.push(error.message));
    for (const locale of ["en", "id"]) {
      await load(page, locale === "en" ? "/services/" : "/id/layanan/");
      const menu = page.locator(".home-menu-button:visible");
      if (width < 768) {
        await page.waitForFunction(() => getComputedStyle(document.querySelector(".home-menu-button")).color === "rgb(23, 25, 28)");
        await menu.hover();
        await page.keyboard.press("Tab");
        await menu.focus();
        assert.equal(await menu.evaluate((el) => getComputedStyle(el).color), "rgb(23, 25, 28)", "Ink controls on the initial white mobile pill, including hover/focus");
        assert.equal(await menu.evaluate((el) => getComputedStyle(el).outlineStyle), "solid", "Header keyboard focus stays visible");
      }
      const cta = page.locator(".floating-contact");
      const before = await cta.boundingBox();
      await page.evaluate(() => scrollTo(0, 900));
      await page.waitForFunction(() => document.querySelector(".inner-header").classList.contains("header-sticky-black"));
      const after = await cta.boundingBox();
      assert.equal(await cta.evaluate((el) => getComputedStyle(el).position), "fixed");
      assert.ok(Math.abs(before.y - after.y) <= 1 && after.y >= 0 && after.y + after.height <= 852, "CTA follows the viewport while scrolling");
      if (await menu.count()) assert.equal(await menu.evaluate((el) => getComputedStyle(el).color), "rgb(23, 25, 28)");
      checks++;

      for (const slug of projects) {
        const route = `${locale === "en" ? "/portfolio/" : "/id/karya/"}${slug}/`;
        await load(page, route);
        const layout = await page.locator(".work-case").evaluate((el) => {
          const desktop = el.querySelector(".work-case-screen-desktop").getBoundingClientRect();
          const mobile = el.querySelector(".work-case-screen-mobile").getBoundingClientRect();
          const hero = el.querySelector(".work-case-hero").getBoundingClientRect();
          return { desktop: desktop.toJSON(), mobile: mobile.toJSON(), hero: hero.height, overflow: document.documentElement.scrollWidth - innerWidth };
        });
        assert.ok(layout.desktop.right < layout.mobile.left, `${route}/${width}: desktop left, phone right`);
        assert.ok(Math.max(layout.desktop.top, layout.mobile.top) < Math.min(layout.desktop.bottom, layout.mobile.bottom), "Screens share a horizontal band");
        assert.ok(layout.overflow <= 1 && layout.mobile.width >= 40, `${route}/${width}: contained pair`);
        if (width < 768) assert.ok(layout.hero <= 852, `${route}: hero fits one phone screen`);
        const ai = page.locator(".work-case-ai");
        assert.equal(await ai.count(), aiProjects.has(slug) ? 1 : 0, `${route}: AI claims only on audited integrations`);
        if (aiProjects.has(slug)) {
          assert.equal(await ai.locator("li").count(), 3);
          if (width < 768) assert.ok((await ai.boundingBox()).height <= 852, `${route}: AI explanation fits one screen`);
        }
        for (const link of await page.locator(".work-service-list a").all()) {
          const url = new URL(await link.getAttribute("href"), base);
          assert.equal(url.pathname, locale === "en" ? "/portfolio/" : "/id/karya/");
          assert.ok(["marketing", "internal", "design", "care"].includes(url.searchParams.get("service")));
          assert.ok((await link.boundingBox()).height >= 44);
        }
        assert.equal(await page.locator(".work-case-neighbours a[rel=prev] > i, .work-case-neighbours a[rel=next] > i").count(), 2);
        assert.ok(await page.locator(".work-case-neighbours a > i").evaluateAll((icons) => icons.every((el) => el.getBoundingClientRect().width >= 44)));
        if (width === 394 && slug === "order-sales") {
          await page.locator(".work-case-hero").screenshot({ path: `${output}/${locale}-pair.png` });
          await page.locator(".work-case-ai").screenshot({ path: `${output}/${locale}-ai.png` });
          await page.locator(".work-case-neighbours").screenshot({ path: `${output}/${locale}-navigation.png` });
        }
        checks++;
      }
    }
    await page.close();
    console.log(`PASS ${width}px: EN/ID header, floating CTA and eight Work studies`);
  }

  const page = await browser.newPage({ viewport: { width: 394, height: 852 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  page.on("pageerror", (error) => errors.push(error.message));
  for (const locale of ["en", "id"]) {
    const prefix = locale === "en" ? "/portfolio/" : "/id/karya/";
    for (const [slug, service] of [["order-sales", "internal"], ["order-sales", "design"], ["order-sales", "care"], ["industrial-coatings", "marketing"]]) {
      await load(page, prefix + slug + "/");
      const chip = page.locator(`.work-service-list a[href*="service=${service}"]`);
      await chip.tap();
      await page.waitForURL(`${base}${prefix}?service=${service}#all-work-title`);
      await page.waitForFunction((id) => document.querySelector(`[data-work-service="${id}"]`)?.getAttribute("aria-pressed") === "true", service);
      assert.ok(await page.locator("[data-work-card]:visible").evaluateAll((cards, id) => cards.length > 0 && cards.every((card) => card.dataset.services.split(" ").includes(id)), service));
      checks++;
    }
    for (const direction of ["prev", "next"]) {
      await load(page, prefix + "order-sales/");
      const neighbour = page.locator(`.work-case-neighbours a[rel=${direction}]`);
      const href = await neighbour.getAttribute("href");
      await neighbour.focus();
      await page.keyboard.press("Enter");
      await page.waitForURL(base + href);
      checks++;
    }
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: ${checks} Work/mobile feedback scenarios; no page errors. Screenshots: ${output}`);
} finally {
  await browser.close();
}
