import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4322";
const output = ".work-capture/mobile-polish/offcanvas";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
let checks = 0;
const errors = [];

async function open(page, route = "/") {
  await page.goto(base + route, { waitUntil: "domcontentloaded" });
  await page.locator(".si-offcanvas-open-btn:visible").click();
  await page.locator("#offcanvas.opened .si-offcanvas-wrapper").waitFor();
  await page.locator("#offcanvas .si-offcanvas-close-btn").click({ trial: true });
  await page.evaluate(() => document.fonts.ready);
}

try {
  for (const width of [320, 394, 430, 820]) {
    const page = await browser.newPage({ viewport: { width, height: 852 }, isMobile: true, hasTouch: true });
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of ["/", "/id/"]) {
      await open(page, route);
      const layout = await page.locator("#offcanvas").evaluate((el) => {
        const cta = el.querySelector(".offcanvas-cta").getBoundingClientRect();
        const language = el.querySelector(".offcanvas-lang").getBoundingClientRect();
        return {
          gap: Math.max(language.left - cta.right, language.top - cta.bottom),
          // Collapsed submenu links are display:none until their group is opened.
          targets: [...el.querySelectorAll("nav a, .offcanvas-actions a")].filter((a) => a.getClientRects().length).map((a) => a.getBoundingClientRect().height),
          right: Math.max(cta.right, language.right),
          viewport: innerWidth,
        };
      });
      assert.ok(layout.gap >= 11.5, `${width}/${route}: action gap ${layout.gap}`);
      assert.ok(layout.targets.every((height) => height >= 44), `${width}/${route}: 44px touch targets`);
      assert.ok(layout.right <= layout.viewport, `${width}/${route}: actions fit`);
      await page.keyboard.press("Tab");
      await page.locator(".si-offcanvas-menu nav a").nth(1).focus();
      assert.notEqual(await page.locator(".si-offcanvas-menu nav a").nth(1).evaluate((el) => getComputedStyle(el).outlineStyle), "none");
      if (width === 394) {
        await page.waitForFunction(() => getComputedStyle(document.querySelectorAll("#offcanvas nav a i")[1]).opacity === "1");
        await page.screenshot({ path: `${output}/${route === "/" ? "en" : "id"}-focus.png` });
      }
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#offcanvas").getAttribute("inert"), "");
      assert.equal(await page.locator("#main").getAttribute("inert"), null);
      checks++;
    }
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 394, height: 852 }, isMobile: true, hasTouch: true });
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of ["/", "/id/"]) {
    await open(page, route);
    const destinations = await page.locator("#offcanvas a[href]").evaluateAll((links) => links.map((a) => ({ href: a.href, label: a.textContent.trim() })));
    for (let index = 0; index < destinations.length; index++) {
      if (index > 0) await open(page, route);
      const navigated = page.waitForEvent("framenavigated", { predicate: (frame) => frame === page.mainFrame() && frame.url() === destinations[index].href });
      const feedback = await page.locator("#offcanvas a[href]").nth(index).evaluate(async (link) => {
        if (!(link instanceof HTMLAnchorElement)) throw new Error("Expected a menu anchor");
        link.click();
        if (link.querySelector(".offcanvas-link-label")) await new Promise((resolve) => setTimeout(resolve, 35));
        return { pressed: link.classList.contains("is-link-pressed"), before: location.href, color: getComputedStyle(link).color };
      });
      assert.equal(feedback.pressed, true, `${route}/${destinations[index].label}: feedback before navigation`);
      assert.equal(feedback.before, base + route);
      if (index >= 1 && index <= 6) assert.equal(feedback.color, "rgb(23, 25, 28)", "Pressed navigation text becomes ink before leaving");
      await navigated;
      await page.waitForLoadState("domcontentloaded");
      assert.equal(await page.locator(".is-link-pressed").count(), 0);
      checks++;
    }
  }

  await open(page);
  const cancelled = await page.evaluate(() => {
    const link = document.querySelectorAll("#offcanvas nav a")[1];
    link.click();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    return !link.classList.contains("is-link-pressed");
  });
  assert.equal(cancelled, true);
  await page.waitForTimeout(180);
  assert.equal(page.url(), base + "/", "Escape cancels pending navigation");
  checks++;

  await open(page);
  const lastHref = await page.evaluate(() => {
    const links = document.querySelectorAll("#offcanvas nav a");
    links[1].click();
    links[2].click();
    return links[2].href;
  });
  await page.waitForURL(lastHref, { waitUntil: "domcontentloaded" });
  checks++;

  await open(page);
  // Block the browser default only after the app handler, to inspect native exceptions without opening tabs/downloads.
  const native = await page.evaluate(() => {
    const link = document.querySelectorAll("#offcanvas nav a")[1];
    const results = [];
    const record = (event) => { results.push({ prevented: event.defaultPrevented, pressed: link.classList.contains("is-link-pressed") }); event.preventDefault(); };
    window.addEventListener("click", record);
    for (const modifier of ["ctrlKey", "metaKey", "shiftKey", "altKey"]) link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, [modifier]: true }));
    link.target = "_blank";
    link.click();
    link.removeAttribute("target");
    link.setAttribute("download", "");
    link.click();
    link.removeAttribute("download");
    const href = link.href;
    link.href = location.href + "#main";
    link.click();
    link.href = "mailto:hello@example.invalid";
    link.click();
    link.href = "https://example.invalid/";
    link.click();
    link.href = href;
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 1 }));
    window.removeEventListener("click", record);
    return results;
  });
  assert.ok(native.every((state) => !state.prevented && !state.pressed), "Modifiers, new tabs, downloads, protocols, external destinations and same-page anchors stay native");
  checks += native.length;

  const service = page.locator("#offcanvas nav a").nth(1);
  const serviceHref = await service.getAttribute("href");
  await service.focus();
  await page.keyboard.press("Enter");
  await page.waitForURL(new URL(serviceHref, base).href, { waitUntil: "domcontentloaded" });
  await page.goBack({ waitUntil: "domcontentloaded" });
  assert.equal(await page.locator(".is-link-pressed").count(), 0, "Back does not restore stale pressed styling");
  checks++;

  await open(page);
  const touchHref = await page.locator("#offcanvas .offcanvas-lang").getAttribute("href");
  await page.locator("#offcanvas .offcanvas-lang").tap();
  await page.waitForURL(new URL(touchHref, base).href, { waitUntil: "domcontentloaded" });
  checks++;

  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page);
  const reduced = await page.locator("#offcanvas nav a").nth(1).evaluate((link) => {
    if (!(link instanceof HTMLAnchorElement)) throw new Error("Expected a menu anchor");
    let prevented;
    window.addEventListener("click", (event) => { prevented = event.defaultPrevented; }, { once: true });
    link.click();
    return { pressed: link.classList.contains("is-link-pressed"), prevented, transition: getComputedStyle(link.querySelector(".offcanvas-link-arrow")).transitionDuration };
  });
  assert.deepEqual(reduced, { pressed: false, prevented: false, transition: "0s" });
  await page.waitForURL(new URL(serviceHref, base).href, { waitUntil: "domcontentloaded" });
  checks++;
  assert.deepEqual(errors, []);
  console.log(`PASS: ${checks} offcanvas layout, navigation and feedback checks; no page errors. Screenshots: ${output}`);
} finally {
  await browser.close();
}
