import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const base = process.env.REVIEW_BASE || "http://127.0.0.1:4392";
const routes = ["/services/internal-systems/", "/id/layanan/sistem-internal/"];
const browser = await chromium.launch({ headless: true });
const results = [];
async function captureSection(page, root, destination) {
  await page.evaluate(() => scrollTo(0, 0));
  const bounds = await root.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return {
      left: Math.floor(rect.left),
      top: Math.floor(rect.top),
      width: Math.floor(rect.width),
      height: Math.floor(rect.height),
    };
  });
  const screenshot = await page.screenshot({ fullPage: true });
  await sharp(screenshot)
    .extract(bounds)
    .jpeg({ quality: 85 })
    .toFile(destination);
}
async function check(name, run) {
  try {
    await run();
    results.push({ name, status: "PASS" });
    console.log("PASS " + name);
  } catch (error) {
    results.push({ name, status: "FAIL", error: String(error) });
    console.error("FAIL " + name, error);
  }
}
try {
  for (const route of routes)
    for (const width of [390, 768, 1440]) {
      await check(
        `${route} ${width}px: layout, all stages, keyboard, CTA and proof`,
        async () => {
          const page = await browser.newPage({
            viewport: { width, height: 1000 },
          });
          try {
            assert.equal((await page.goto(base + route)).status(), 200);
            const root = page.locator("[data-internal-flow]");
            await root
              .locator('[data-flow-step="0"]:not([disabled])')
              .waitFor();
            for (let index = 0; index < 4; index++) {
              await root.locator(`[data-flow-step="${index}"]`).click();
              assert.equal(
                await root
                  .locator(`[data-flow-step="${index}"]`)
                  .getAttribute("aria-pressed"),
                "true",
              );
              assert.equal(
                await root
                  .locator(`[data-flow-focus="${index}"]`)
                  .evaluate((el) => el.classList.contains("is-active")),
                true,
              );
            }
            await root.locator('[data-flow-step="1"]').focus();
            await page.keyboard.press("Enter");
            assert.equal(
              await root
                .locator('[data-flow-step="1"]')
                .getAttribute("aria-pressed"),
              "true",
            );
            assert.equal(
              await root
                .locator('[data-flow-step="1"]')
                .evaluate((el) => getComputedStyle(el).outlineStyle),
              "solid",
            );
            await root.locator("[data-flow-replay]").click();
            assert.equal(await root.getAttribute("data-playing"), "true");
            await root.locator("[data-flow-play]").click();
            assert.equal(await root.getAttribute("data-playing"), "false");
            assert.equal(
              await root.locator(".internal-flow-cta").getAttribute("href"),
              "#service-inquiry",
            );
            assert.equal(
              await page
                .locator('#service-inquiry form input[name="source"]')
                .inputValue(),
              "service:internal-systems",
            );
            assert.equal(
              await page
                .locator('#service-inquiry form input[name="company_website"]')
                .count(),
              1,
            );
            assert.equal(
              await page
                .locator(".service-main-screen img")
                .evaluate((el) => el.naturalWidth > 0),
              true,
            );
            assert.equal(
              await page.evaluate(
                () => document.documentElement.scrollWidth > innerWidth + 1,
              ),
              false,
            );
            await root.locator('[data-flow-step="3"]').click();
            await page.waitForTimeout(700);
            if (width < 768)
              assert.equal(
                await page.locator(".floating-contact").isVisible(),
                false,
              );
            await captureSection(
              page,
              root,
              resolve(
                import.meta.dirname,
                `qa/integrated-${route.startsWith("/id/") ? "id" : "en"}-${width}.jpg`,
              ),
            );
          } finally {
            await page.close();
          }
        },
      );
    }
  await check(
    "Finite 8-second playback; viewport and document visibility pause",
    async () => {
      const page = await browser.newPage({
        viewport: { width: 1440, height: 1000 },
      });
      try {
        await page.goto(base + routes[0]);
        const root = page.locator("[data-internal-flow]");
        await root.locator("[data-flow-replay]").click();
        await page.waitForTimeout(8400);
        assert.equal(await root.getAttribute("data-playing"), "false");
        assert.equal(
          await root
            .locator('[data-flow-step="3"]')
            .getAttribute("aria-pressed"),
          "true",
        );
        await root.locator("[data-flow-replay]").click();
        await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(250);
        assert.equal(await root.getAttribute("data-playing"), "false");
        await root.locator("[data-flow-replay]").click();
        const foreground = await browser.newPage();
        await foreground.bringToFront();
        // Headless visibility varies by browser: document event is also verified directly.
        await page.evaluate(() => {
          Object.defineProperty(document, "hidden", {
            configurable: true,
            value: true,
          });
          document.dispatchEvent(new Event("visibilitychange"));
        });
        assert.equal(await root.getAttribute("data-playing"), "false");
        await foreground.close();
      } finally {
        await page.close();
      }
    },
  );
  for (const mode of ["reduced", "no-js", "image-error"])
    await check(`${mode}: static information and fallback`, async () => {
      const page = await browser.newPage({
        viewport: { width: 390, height: 1000 },
        reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
        javaScriptEnabled: mode !== "no-js",
      });
      try {
        if (mode === "image-error")
          await page.route("**/*scene-*.webp", (request) => request.abort());
        await page.goto(base + routes[1]);
        const root = page.locator("[data-internal-flow]");
        assert.equal(await root.locator(".internal-flow-steps p").count(), 4);
        if (mode === "no-js") {
          assert.equal(
            await root.locator("[data-flow-controls]").isVisible(),
            false,
          );
          assert.equal(
            await root.locator('[data-flow-step="0"]').isDisabled(),
            true,
          );
        } else {
          assert.equal(
            await root.locator("[data-flow-play]").isDisabled(),
            true,
          );
        }
        if (mode === "image-error")
          await root.locator("[data-flow-error]:not([hidden])").waitFor();
        else
          assert.equal(
            await root.locator("[data-flow-scene]").isVisible(),
            true,
          );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1,
          ),
          false,
        );
        await root.screenshot({
          path: resolve(import.meta.dirname, `qa/integrated-${mode}.jpg`),
          type: "jpeg",
          quality: 80,
        });
      } finally {
        await page.close();
      }
    });
  await check(
    "Other service and homepage have no scene or runtime",
    async () => {
      const page = await browser.newPage();
      try {
        for (const route of ["/", "/id/", "/services/marketing-sites/"]) {
          const requests = [];
          page.on("request", (request) => requests.push(request.url()));
          await page.goto(base + route);
          assert.equal(await page.locator("[data-internal-flow]").count(), 0);
          assert.equal(
            requests.some((url) =>
              /InternalFlow|internal-flow|scene-1440|station-/.test(url),
            ),
            false,
          );
          page.removeAllListeners("request");
        }
      } finally {
        await page.close();
      }
    },
  );
} finally {
  await browser.close();
  await writeFile(
    resolve(import.meta.dirname, "qa/integration-results.json"),
    JSON.stringify(results, null, 2),
  );
}
if (results.some((result) => result.status === "FAIL")) process.exitCode = 1;
