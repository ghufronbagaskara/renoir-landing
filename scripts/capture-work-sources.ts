import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const [slug, url, desktopPath = "", mobilePath = ""] = process.argv.slice(2);
if (!slug || !url || !/^[a-z0-9-]+$/.test(slug)) {
  throw new Error("Usage: node --experimental-strip-types scripts/capture-work-sources.ts <slug> <url> [desktop-path] [mobile-path]");
}

const output = join(".work-capture", slug);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const [name, width, height, path] of [
    ["desktop", 1440, 900, desktopPath],
    ["mobile", 390, 844, mobilePath || desktopPath],
  ] as const) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    await page.goto(new URL(path, url).href, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 20_000 }).catch(() => {});
    await page.waitForTimeout(1800);
    if (new URL(path, url).hash) await page.locator(new URL(path, url).hash).scrollIntoViewIfNeeded();
    await page.screenshot({ path: join(output, `${name}.png`), animations: "disabled" });
    console.log(`${slug} ${name}: ${await page.title()}`);
    await page.close();
  }
} finally {
  await browser.close();
}
