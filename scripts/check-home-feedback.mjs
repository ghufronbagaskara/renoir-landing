import assert from "node:assert/strict";
import { chromium } from "playwright";
const base = process.argv[2] ?? "http://localhost:4322";
const browser = await chromium.launch({ headless: true, channel: "chrome" });
try {
  for (const locale of ["en", "id"]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base + (locale === "en" ? "/" : "/id/"));
    await page.waitForSelector(".works-wheel.is-overview");
    assert.equal(await page.locator(".home-cinema-facts").count(), 0);
    assert.notEqual(await page.locator(".home-cinema-media").evaluate(e => getComputedStyle(e, "::after").backgroundImage), "none");
    assert.equal(await page.locator(".home-services").evaluate(e => getComputedStyle(e).backgroundColor), "rgb(29, 78, 216)");
    assert.equal(await page.locator("#selected-work").evaluate(e => getComputedStyle(e).backgroundColor), "rgb(255, 255, 255)");
    assert.ok(await page.locator(".home-services").evaluate(e => e.getBoundingClientRect().height) < 800);
    await page.locator(".works-wheel").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const card = page.locator('.wheel-card[data-service-index="1"]');
    const before = await card.getAttribute("style");
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(500);
    assert.ok(await page.locator(".works-wheel").evaluate(e => e.classList.contains("is-overview")));
    assert.notEqual(await card.getAttribute("style"), before, "Native scroll rotates the ring");
    await page.locator(".wheel-stage").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const image = page.locator('.wheel-card[data-service-index="0"] img');
    await image.hover();
    await page.waitForTimeout(300);
    assert.equal(await page.locator(".wheel-card-action").first().evaluate(e => getComputedStyle(e).opacity), "1");
    const box = await image.boundingBox();
    const transform = await card.getAttribute("style");
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 90, box.y + box.height / 2, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    assert.equal(new URL(page.url()).pathname, locale === "en" ? "/" : "/id/", "Dragging an image must not follow its link");
    assert.notEqual(await card.getAttribute("style"), transform, "Dragging the actual image rotates the ring");
    assert.ok(await page.locator(".works-wheel").evaluate(e => e.classList.contains("is-overview")));
    await page.locator("#service-tab-1").click();
    await page.waitForFunction(() => !document.querySelector(".wheel-content").inert);
    assert.equal(await page.locator("#service-panel-1").isVisible(), true);

    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForFunction(() => document.querySelector("#selected-work").getBoundingClientRect().top > innerHeight);
    const offscreen = await page.locator(".home-project-tabs [aria-selected=true]").getAttribute("id");
    await page.waitForTimeout(4200);
    assert.equal(await page.locator(".home-project-tabs [aria-selected=true]").getAttribute("id"), offscreen, "Offscreen projects do not advance");
    await page.mouse.move(720, 450);
    await page.locator("#selected-work").scrollIntoViewIfNeeded();
    await page.evaluate(() => document.activeElement?.blur());
    await page.locator(".home-project-panel:not([hidden]) .home-project-visual").hover();
    const selected = () => page.locator(".home-project-tabs [aria-selected=true]").getAttribute("id");
    const rotation = await page.evaluate(async () => {
      const root = document.querySelector("#selected-work");
      const selected = () => root.querySelector('[aria-selected="true"]').id;
      const first = selected();
      document.getElementById(first).click();
      document.activeElement?.blur();
      await Promise.resolve();
      const started = performance.now();
      let beforeDeadline;
      return new Promise((resolve, reject) => {
        const early = setTimeout(() => { beforeDeadline = selected(); }, 3500);
        const timeout = setTimeout(() => reject(new Error("Visible projects did not advance")), 7000);
        root.addEventListener("tabs:change", () => {
          clearTimeout(early);
          clearTimeout(timeout);
          resolve({ first, beforeDeadline, next: selected(), elapsed: performance.now() - started });
        }, { once: true });
      });
    });
    assert.equal(rotation.beforeDeadline, rotation.first, "Visible projects remain selected before 4 seconds");
    assert.notEqual(rotation.next, rotation.first, "Visible projects advance every 4 seconds");
    assert.ok(rotation.elapsed >= 3900, "Rotation waits four seconds");
    await page.locator(".home-project-tabs").hover();
    const hovered = await selected();
    await page.waitForTimeout(4200);
    assert.equal(await selected(), hovered, "Reading and hovering pauses rotation");
    await page.locator("[data-project-rotation]").click();
    assert.equal(await page.locator("[data-project-rotation]").evaluate(e => e.getAttribute("aria-label") === e.dataset.resume), true);
    await page.mouse.move(1, 1);
    await page.evaluate(() => document.activeElement?.blur());
    const paused = await selected();
    await page.waitForTimeout(4200);
    assert.equal(await selected(), paused, "Explicit pause persists");
    const stageHeight = await page.locator(".home-project-stage").evaluate(e => e.getBoundingClientRect().height);
    const outgoing = await selected();
    await page.locator("#work-tab-3").click();
    assert.equal(await page.locator("#work-tab-3").getAttribute("aria-selected"), "true");
    const transition = await page.locator("#work-panel-3").evaluate(e => e.getAnimations().map(a => a.effect.getTiming().duration));
    assert.ok(transition.includes(500), "Project changes use a 500ms crossfade");
    const previousPanel = page.locator("#" + outgoing.replace("tab", "panel"));
    if (outgoing !== "work-tab-3") {
      assert.equal(await previousPanel.evaluate(e => getComputedStyle(e).visibility), "visible");
      assert.equal(await previousPanel.getAttribute("aria-hidden"), "true");
      assert.equal(await previousPanel.evaluate(e => e.inert), true);
    }
    await page.waitForTimeout(600);
    assert.equal(await page.locator(".home-project-panel:visible").count(), 1);
    assert.ok(Math.abs(await page.locator(".home-project-stage").evaluate(e => e.getBoundingClientRect().height) - stageHeight) < 1, "Changing projects does not move the section below");
    await page.locator("#work-tab-0").click();
    await page.locator("#work-tab-4").click();
    await page.waitForTimeout(600);
    assert.equal(await page.locator(".home-project-panel:visible").count(), 1, "Rapid selection cancels stale crossfades");
    assert.equal(await page.locator("#work-tab-4").getAttribute("aria-selected"), "true");
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator("#work-tab-0").getAttribute("aria-selected"), "true", "Keyboard navigation wraps through all five projects");

    await page.locator(".engagement-item").nth(2).locator("summary").hover();
    await page.waitForFunction(() => document.querySelectorAll(".engagement-item")[2].open && document.querySelectorAll(".engagement-item[open]").length === 1);
    assert.equal(await page.locator(".engagement-item[open]").count(), 1);

    const faq = page.locator("#home-faq");
    assert.equal(await faq.getAttribute("data-hover-accordion"), "");
    assert.equal(await page.locator(".si-faq-area .handover-visual li").count(), 3);
    await faq.locator(".accordion-buttons").nth(1).hover();
    await page.waitForFunction(() => document.querySelectorAll("#home-faq .accordion-buttons")[1].getAttribute("aria-expanded") === "true");
    assert.equal(await faq.locator('.accordion-buttons[aria-expanded="true"]').count(), 1);

    for (const fallback of [false, true]) {
      if (fallback) { await page.route("**/pagefind/**", route => route.abort()); await page.goto(base + (locale === "en" ? "/" : "/id/")); }
      await page.locator(".home-nav-actions .si-search-open-btn").click();
      const input = page.locator("#site-search-input");
      const queries = locale === "en" ? [["internal", "/services/"], ["MAXY", "/portfolio/"], ["websites", "/notes/"]] : [["sistem", "/id/layanan/"], ["MAXY", "/id/karya/"], ["website", "/id/catatan/"]];
      for (const [query, route] of queries) {
        await input.fill(query);
        await page.waitForFunction(route => [...document.querySelectorAll("[data-search-results] a")].some(a => a.getAttribute("href").includes(route)) && !document.querySelector("[data-search-results]").hasAttribute("aria-busy"), route);
      }
      await input.fill("zzzznomatchzzzz");
      await page.waitForFunction(() => !document.querySelector("[data-search-results]").hasAttribute("aria-busy") && document.querySelectorAll("[data-search-results] a").length === 0);
      await input.fill("MAXY");
      await page.waitForSelector("[data-search-results] a");
      await page.keyboard.press("ArrowDown");
      assert.equal(await page.locator("[data-search-results] a").first().evaluate(e => e === document.activeElement), true);
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#site-search").evaluate(e => e.open), false);
      await page.goto(base + (locale === "en" ? "/?q=MAXY" : "/id/?q=MAXY"));
      await page.waitForFunction(() => document.querySelector("#site-search").open);
      await page.waitForSelector("[data-search-results] a");
      assert.equal(await page.locator("#main").evaluate(e => e.inert), true);
      await page.keyboard.press("Escape");
    }
    assert.deepEqual(errors, []);
    await page.goto(base + (locale === "en" ? "/about/" : "/id/tentang/"));
    assert.equal(await page.locator(".si-breadcumb-text h1").textContent(), locale === "en" ? "About" : "Tentang");
    const menu = page.locator(".home-menu-button");
    assert.deepEqual(await menu.locator(".home-menu-lines i").evaluateAll(bars => bars.map(e => getComputedStyle(e).backgroundColor)), ["rgb(255, 255, 255)", "rgb(255, 255, 255)"]);
    await menu.hover();
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".home-menu-button")).backgroundColor === "rgba(255, 255, 255, 0.08)");
    assert.deepEqual(await menu.locator(".home-menu-lines i").evaluateAll(bars => bars.map(e => getComputedStyle(e).backgroundColor)), ["rgb(255, 255, 255)", "rgb(255, 255, 255)"]);
    await page.evaluate(() => scrollTo(0, 600));
    await page.waitForFunction(() => document.querySelector("#header-sticky-black").classList.contains("header-sticky-black"));
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".home-menu-lines i")).backgroundColor === "rgb(23, 25, 28)");
    assert.deepEqual(await menu.locator(".home-menu-lines i").evaluateAll(bars => bars.map(e => getComputedStyle(e).backgroundColor)), ["rgb(23, 25, 28)", "rgb(23, 25, 28)"]);
    await page.goto(base + (locale === "en" ? "/services/" : "/id/layanan/"));
    assert.equal(await page.locator(".si-breadcumb-area").evaluate(e => getComputedStyle(e).backgroundColor), "rgb(23, 25, 28)");
    await page.evaluate(() => scrollTo(0, 600));
    await page.waitForFunction(() => document.querySelector("#header-sticky-black").classList.contains("header-sticky-black"));
    await page.waitForTimeout(1100);
    assert.equal(await page.locator("#header-sticky-black").evaluate(e => getComputedStyle(e).position), "fixed");
    assert.ok(await page.locator("#header-sticky-black").evaluate(e => e.getBoundingClientRect().top) >= 10);
    await page.screenshot({ path: `.work-capture/home-refresh/qa/${locale}-feedback-inner.png` });
    for (const width of [412, 320]) {
      await page.setViewportSize({ width, height: 915 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      const nav = page.locator("#header-sticky-black");
      assert.ok(await nav.evaluate(e => e.getBoundingClientRect().right) <= width);
      assert.equal(await nav.locator(".home-nav-shell").evaluate(e => getComputedStyle(e).borderRadius), "100px");
      await nav.locator(".home-menu-button").click();
      assert.equal(await page.locator("#main").evaluate(e => e.inert), true);
      await page.keyboard.press("Escape");
      await page.goto(base + (locale === "en" ? "/portfolio/order-sales/" : "/id/karya/order-sales/"));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.evaluate(() => scrollTo(0, 500));
      await page.waitForFunction(() => document.querySelector("#header-sticky-black").classList.contains("header-sticky-black"));
    }
    await page.close();
    console.log(`PASS ${locale}: ring/scroll/image drag/hover, project rotation/pause, engagement and Home FAQ hover/handover, indexed and fallback search, About title and menu contrast, inner navigation`);
  }
  const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 412, height: 915 } });
  await page.goto(base + "/id/");
  await page.locator("#selected-work").scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  await page.waitForTimeout(4300);
  assert.equal(await page.locator("#work-tab-0").getAttribute("aria-selected"), "true");
  await page.locator("#work-tab-3").click();
  assert.equal(await page.locator("#work-panel-3").evaluate(e => e.getAnimations().length), 0);
  assert.equal(await page.locator(".home-project-panel:visible").count(), 1);
  assert.equal(await page.locator("#work-panel-3").getAttribute("aria-hidden"), "false");
  console.log("PASS reduced motion: project autoplay starts paused and manual selection is immediate");
} finally { await browser.close(); }
