import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4322";
const output = ".work-capture/home-refresh/qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
let checks = 0;
try {
  for (const locale of ["en", "id"]) {
    for (const width of [1440, 1240, 820, 412, 320]) {
      const context = await browser.newContext({ viewport: { width, height: width > 900 ? 900 : 915 } });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(base + (locale === "en" ? "/" : "/id/"));
      assert.equal(response.status(), 200);
      await page.waitForSelector(".works-wheel.is-enhanced");
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator(".wheel-card").count(), 9);
      assert.equal(await page.locator(".wheel-index [role=tab]").count(), 4);
      assert.equal(await page.locator(".wheel-card a").count(), 4);
      assert.equal(await page.locator(".home-project-tabs [role=tab]").count(), 5);
      assert.equal(await page.locator(".home-project-visual img[srcset]").count(), 5);
      assert.equal(await page.locator("#work-panel-0").evaluate(e => e.tagName), "DIV");
      assert.ok((await page.locator("#work-tab-3").innerText()).includes(locale === "en" ? "Field Project Monitoring" : "Pemantauan Proyek Lapangan"));
      assert.ok((await page.locator("#work-panel-3 .home-action").getAttribute("href")).endsWith("/field-projects/"));
      const geometry = await page.evaluate(() => {
        const nav = document.querySelector(".home-nav-shell");
        const menu = document.querySelector(".home-menu-button");
        const search = document.querySelector(".home-nav-actions .si-header-search");
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          radius: getComputedStyle(nav).borderRadius,
          height: nav.getBoundingClientRect().height,
          controlsAligned: Math.abs(menu.getBoundingClientRect().y - search.getBoundingClientRect().y) < 1,
        };
      });
      assert.equal(geometry.overflow, false, `${locale}/${width}: horizontal overflow`);
      assert.equal(geometry.radius, width < 768 ? "12px" : "100px");
      assert.ok(geometry.height < 85);
      assert.ok(geometry.controlsAligned);
      const problem = page.locator("#the-problem");
      assert.equal(await problem.locator(".problem-sources li").count(), 3);
      assert.equal(await problem.locator(".problem-fields > div").count(), 3);
      assert.equal(await problem.locator(".problem-assistance li").count(), 3);
      assert.ok((await problem.locator(".problem-service-link").getAttribute("href")).includes(locale === "en" ? "/services/internal-systems/" : "/id/layanan/sistem-internal/"));
      for (const card of await page.locator(".notes-track .si-blog-box").all()) {
        const links = await card.locator("a").evaluateAll(nodes => nodes.map(node => node.getAttribute("href")));
        assert.equal(links.length, 3);
        assert.equal(new Set(links).size, 1, "Note image/title/button lead to the same article");
        assert.equal(await card.evaluate(e => getComputedStyle(e).backgroundColor), "rgb(238, 242, 248)");
        assert.ok(await card.locator(".si-btn-one").evaluate(e => e.getBoundingClientRect().height) >= 44);
      }
      const benefits = page.locator("#benefits");
      assert.equal(await benefits.locator(".home-benefits-item").count(), 5);
      assert.equal(await benefits.locator(".home-benefits-item p").count(), 5);
      assert.equal(await benefits.locator(".home-benefits-icon svg").count(), 5);
      assert.equal(await benefits.locator(".home-benefits-package li").count(), 3);
      assert.ok((await benefits.locator(".home-benefits-item p").first().innerText()).startsWith(locale === "en" ? "No themes" : "Tanpa tema"));
      assert.equal(await benefits.evaluate((e) => getComputedStyle(e).backgroundColor), "rgb(23, 25, 28)");
      assert.equal(await benefits.locator(".home-benefits-item").first().evaluate((e) => getComputedStyle(e).display), "grid");
      assert.equal(await benefits.locator("h2").evaluate((e) => e.getAnimations({ subtree: true }).length), 0);
      assert.equal(await page.locator(".si-faq-area .handover-visual li").count(), 3);
      if (width < 768) {
        assert.equal(await page.locator("#home-faq").evaluate(e => [...e.querySelectorAll("button")].every(button => {
          const box = button.getBoundingClientRect();
          const icon = button.querySelector(".accordion-icon").getBoundingClientRect();
          return icon.top >= box.top + 9 && icon.top <= box.bottom - 9 && getComputedStyle(button).textAlign === "left";
        })), true, "Phone FAQ toggle icons stay inside their question buttons");
      }
      await page.waitForFunction(() => !document.querySelector("video").paused);
      await page.waitForFunction(() => document.querySelector("video").readyState >= 1);
      const media = await page.locator("video").evaluate(e => ({ src: e.currentSrc, width: e.videoWidth, height: e.videoHeight }));
      assert.ok(new URL(media.src).pathname.startsWith("/_astro/"), "Hero video uses a hashed cacheable URL");
      assert.equal(media.width, width < 768 ? 506 : 1600);
      assert.equal(media.height, 900);
      assert.ok((await page.request.head(media.src)).headers()["cache-control"].includes("immutable"));

      await page.locator("[data-video-toggle]").click();
      assert.equal(await page.locator("video").evaluate((e) => e.paused), true);
      await page.locator("[data-video-toggle]").click();
      await page.waitForFunction(() => !document.querySelector("video").paused);
      await page.screenshot({ path: `${output}/${locale}-${width}-hero.jpg`, type: "jpeg", quality: 85 });

      await page.locator(".home-menu-button").click();
      assert.equal(await page.locator("#main").evaluate((e) => e.inert), true);
      if (width < 1200) assert.equal(await page.locator(".si-offcanvas-menu").isVisible(), true);
      else assert.equal(await page.locator(".home-nav-links").isVisible(), true);
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#main").evaluate((e) => e.inert), false);
      assert.equal(await page.locator(".home-menu-button").getAttribute("aria-expanded"), "false");

      await page.locator(".works-wheel").scrollIntoViewIfNeeded();
      for (let i = 0; i < 4; i++) {
        await page.locator(`#service-tab-${i}`).click();
        assert.equal(await page.locator(`#service-panel-${i}`).isVisible(), true);
        assert.equal(await page.locator(".wheel-service:visible").count(), 1);
        assert.ok((await page.locator(`#service-panel-${i} a`).getAttribute("href")).includes(locale === "en" ? "/services/" : "/id/layanan/"));
      }
      await page.waitForFunction(() => !document.querySelector(".wheel-content").inert);
      assert.equal(await page.locator(".wheel-card").first().evaluate((e) => getComputedStyle(e).position), "absolute", "Wheel layout must survive production CSS purging");
      assert.equal(await page.locator(".wheel-card").evaluateAll((cards) => cards.some((e) => /NaN|Infinity/.test(e.style.transform))), false);
      await page.locator("#service-tab-3").focus();
      await page.keyboard.press("Home");
      assert.equal(await page.locator("#service-tab-0").getAttribute("aria-selected"), "true");
      await page.locator("[data-wheel-overview]").click();
      await page.waitForFunction(() => [...document.querySelectorAll(".wheel-card")].every((e) => e.style.opacity === "1"));
      await page.locator(".works-wheel").screenshot({ path: `${output}/${locale}-${width}-ring.jpg`, type: "jpeg", quality: 85 });
      await page.locator("[data-wheel-next]").click();
      const stage = await page.locator(".wheel-stage").boundingBox();
      await page.mouse.move(stage.x + stage.width / 2, stage.y + stage.height / 2);
      await page.mouse.down();
      await page.mouse.move(stage.x + stage.width / 2 - 100, stage.y + stage.height / 2, { steps: 5 });
      await page.mouse.up();
      assert.equal(await page.locator("#service-tab-1").getAttribute("aria-selected"), "true");
      assert.equal(await page.locator("video").evaluate((e) => e.paused), true);
      const before = await page.evaluate(() => scrollY);
      await page.locator(".wheel-stage").hover();
      await page.mouse.wheel(0, 350);
      await page.waitForFunction((old) => scrollY > old + 50, before);

      for (let i = 0; i < 5; i++) {
        await page.locator(`#work-tab-${i}`).click();
        assert.equal(await page.locator(`#work-panel-${i}`).isVisible(), true);
        assert.equal(await page.locator(".home-project-panel:not([hidden])").count(), 1);
      }
      await page.keyboard.press("Home");
      assert.equal(await page.locator("#work-tab-0").getAttribute("aria-selected"), "true");
      await page.waitForFunction(() => [...document.querySelectorAll(".home-project-panel")].every(panel => panel.getAnimations().length === 0));
      await page.locator("#selected-work").screenshot({ path: `${output}/${locale}-${width}-work.jpg`, type: "jpeg", quality: 85 });
      const images = await page.locator(".works-wheel img, .home-project-panel:not([hidden]) img").evaluateAll(async (images) => {
        await Promise.all(images.map((image) => image.decode().catch(() => {})));
        return images.filter((image) => !image.naturalWidth).map((image) => image.src);
      });
      assert.deepEqual(images, []);
      assert.equal(await page.locator("footer").evaluate((e) => getComputedStyle(e).backgroundColor), "rgb(23, 25, 28)");
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`PASS ${locale} ${width}px: navigation, wheel, tabs, images, scroll, footer`);
      checks++;
    }
  }
  const reduced = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 412, height: 915 } });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(base + "/id/");
  await reducedPage.waitForSelector(".works-wheel.is-enhanced");
  assert.equal(await reducedPage.locator("video").getAttribute("src"), null);
  assert.equal(await reducedPage.locator("video").evaluate((e) => e.paused), true);
  await reducedPage.locator("[data-video-toggle]").click();
  await reducedPage.waitForFunction(() => !document.querySelector("video").paused);
  await reducedPage.locator("#service-tab-1").click();
  await reducedPage.waitForFunction(() => document.querySelector("#service-panel-1").hidden === false);
  await reduced.close();
  checks++;

  const saveDataContext = await browser.newContext();
  await saveDataContext.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true } }));
  const saveDataPage = await saveDataContext.newPage();
  await saveDataPage.goto(base + "/");
  await saveDataPage.waitForSelector(".works-wheel.is-enhanced");
  assert.equal(await saveDataPage.locator("video").getAttribute("src"), null);
  await saveDataContext.close();
  checks++;

  const fontContext = await browser.newContext({ viewport: { width: 412, height: 915 } });
  await fontContext.addInitScript(() => {
    let release;
    const ready = new Promise(resolve => { release = resolve; });
    Object.defineProperty(document.fonts, "ready", { get: () => ready });
    window.releaseFonts = release;
  });
  const fontPage = await fontContext.newPage();
  await fontPage.goto(base + "/");
  await fontPage.locator("[data-video-toggle]:not([hidden])").waitFor();
  await fontPage.waitForTimeout(200);
  assert.equal(await fontPage.locator("video").getAttribute("src"), null, "Automatic video waits until typography is ready");
  await fontPage.evaluate(() => window.releaseFonts());
  await fontPage.waitForFunction(() => !document.querySelector("video").paused);
  await fontContext.close();
  checks++;

  const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 412, height: 915 } });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(base + "/id/");
  assert.equal(await staticPage.locator(".wheel-service:visible").count(), 4);
  assert.equal(await staticPage.locator(".home-project-panel:visible").count(), 5);
  assert.equal(await staticPage.locator("video").getAttribute("src"), null);
  assert.equal(await staticPage.locator("#home-faq .accordion-collapse:visible").count(), await staticPage.locator("#home-faq .accordion-collapse").count());
  assert.equal(await staticPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await staticContext.close();
  checks++;

  const failedContext = await browser.newContext();
  await failedContext.route("**/katalhys-hero*.mp4", (route) => route.abort());
  const failedPage = await failedContext.newPage();
  await failedPage.goto(base + "/");
  await failedPage.waitForFunction(() => document.querySelector("video").error !== null);
  assert.equal(await failedPage.locator("video").evaluate((e) => e.hidden), true);
  assert.equal(await failedPage.locator(".home-cinema picture img").evaluate((e) => e.complete && e.naturalWidth > 0), true);
  await failedContext.close();
  checks++;
  console.log(`PASS ${checks} scenarios, including reduced motion, save-data, no JavaScript, and video failure`);
} finally {
  await browser.close();
}
