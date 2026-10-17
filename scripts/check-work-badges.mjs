import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4322";
const output = ".work-capture/work-badges";
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const [locale, route] of [["en", "/portfolio/"], ["id", "/id/karya/"]]) {
    for (const width of [1992, 1440, 412, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1131 } });
      await page.goto(base + route);
      await page.evaluate(() => document.fonts.ready);
      const checkBadges = async () => {
        const badges = await page.locator("[data-work-card]:not([hidden]) .work-service-badge-overlay").evaluateAll(items => items.map(badge => {
          const label = badge.getBoundingClientRect();
          const image = badge.parentElement.getBoundingClientRect();
          return { text: badge.textContent, contained: label.left >= image.left && label.top >= image.top && label.right <= image.right + 1 && label.bottom <= image.bottom + 1 };
        }));
        assert.ok(badges.length > 0);
        for (const badge of badges) assert.ok(badge.contained, `${locale}/${width}: ${badge.text} escaped its project thumbnail`);
      };
      await page.screenshot({ path: `${output}/${locale}-${width}-top.png` });
      await checkBadges();
      await page.locator(".work-filters").scrollIntoViewIfNeeded();
      await page.locator('[data-work-service="care"]').click();
      await checkBadges();
      assert.equal(await page.locator('[data-work-service="care"]').getAttribute("aria-pressed"), "true");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.locator("[data-work-card]:not([hidden])").first().scrollIntoViewIfNeeded();
      await page.waitForFunction(() => {
        const header = document.querySelector("#header-sticky-black");
        return getComputedStyle(header).position === "fixed" && header.getBoundingClientRect().top >= 0;
      });
      await page.screenshot({ path: `${output}/${locale}-${width}-cards.png` });
      await page.close();
      console.log(`PASS ${locale}/${width}: badges stay inside project thumbnails before and after filtering; sticky navigation and page width remain intact`);
    }
  }
} finally {
  await browser.close();
}
