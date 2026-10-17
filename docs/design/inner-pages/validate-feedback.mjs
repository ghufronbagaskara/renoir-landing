import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true });
const routes = ['/about/', '/id/tentang/', '/services/', '/id/layanan/', '/process/', '/id/proses/'];
const results = [];
try {
  for (const width of [390, 768, 1440]) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, isMobile: width !== 1440, hasTouch: width !== 1440 });
      await page.goto('http://127.0.0.1:4392' + route);
      await page.evaluate(async () => { for (const img of document.images) img.loading = 'eager'; await document.fonts.ready; });
      await page.waitForTimeout(600);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${route} ${width}`);
      assert.equal(await page.locator('#magic-cursor').count(), 0);
      assert.equal(await page.locator('img[src*="porcelain"]').count(), 0);
      assert.equal(await page.locator('.floating-contact-long').textContent(), route.startsWith('/id/') ? 'Hubungi' : 'Make the call!');
      assert.equal(await page.evaluate(() => [...document.images].filter(img => !img.complete || img.naturalWidth === 0).length), 0);
      const items = page.locator('[data-hover-engagements] details');
      if (await items.count()) {
        for (let i = 0; i < 4; i++) {
          if (width === 1440) await items.nth(i).locator('summary').hover();
          else if (!await items.nth(i).getAttribute('open').then(v => v !== null)) await items.nth(i).locator('summary').click();
          await page.waitForTimeout(300);
          assert.equal(await items.nth(i).getAttribute('open'), '');
          assert.equal(await page.locator('[data-hover-engagements] details[open]').count(), 1);
          assert.equal(await page.locator('[data-engagement-proof]:not([hidden])').getAttribute('data-engagement-proof'), String(i));
        }
        if (width === 1440) {
          for (const i of [0, 1, 2, 3, 0]) { await items.nth(i).locator('summary').hover(); await page.waitForTimeout(30); }
          await page.waitForTimeout(350);
          assert.equal(await page.locator('[data-hover-engagements] details[open]').count(), 1);
          assert.equal(await items.first().getAttribute('open'), '');
        }
      }
      const questions = page.locator('[data-hover-accordion] button');
      if (await questions.count()) {
        for (let i = 0; i < await questions.count(); i++) {
          if (width === 1440) await questions.nth(i).hover();
          else if (await questions.nth(i).getAttribute('aria-expanded') !== 'true') await questions.nth(i).click();
          await page.waitForTimeout(300);
          assert.equal(await questions.nth(i).getAttribute('aria-expanded'), 'true');
          assert.equal(await page.locator('[data-hover-accordion] .show').count(), 1);
          assert.equal(await page.locator('[data-hover-accordion] .accordion-collapse:visible').count(), 1);
        }
      }
      if (width !== 768 && !route.startsWith('/id/')) {
        const section = page.locator(route === '/about/' ? '.studio-work' : '[data-hover-engagements]');
        await section.screenshot({ path: `docs/design/inner-pages/qa/feedback-${route.split('/')[1]}-${width}.png` });
      }
      results.push({ route, width, status: 'PASS' });
      await page.close();
    }
  }
  for (const route of ['/services/', '/process/']) {
    const page = await browser.newPage({ javaScriptEnabled: false });
    await page.goto('http://127.0.0.1:4392' + route);
    const second = page.locator('[data-hover-engagements] summary').nth(1);
    await second.click();
    assert.equal(await second.locator('..').getAttribute('open'), '');
    if (route === '/process/') assert.equal(await page.locator('[data-hover-accordion] .accordion-collapse').filter({ visible: true }).count(), 6);
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:4392/process/');
  await page.locator('[data-hover-engagements] summary').nth(2).hover();
  assert.equal(await page.locator('[data-hover-engagements] details[open]').count(), 1);
  await page.locator('[data-hover-engagements] summary').nth(1).focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('[data-hover-engagements] details').nth(1).getAttribute('open'), '');
  await page.close();
  const fallback = await browser.newPage({ viewport: { width: 390, height: 1000 } });
  await fallback.route('**/*.{webp,png,jpg}', route => route.abort());
  await fallback.goto('http://127.0.0.1:4392/about/');
  assert(await fallback.locator('.studio-work-screen figcaption').isVisible());
  assert(await fallback.locator('.studio-work-screen img').getAttribute('alt'));
  assert(await fallback.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await fallback.goto('http://127.0.0.1:4392/');
  assert.equal(await fallback.locator('[data-hover-engagements]').count(), 0);
  await fallback.close();
  await writeFile('docs/design/inner-pages/qa/feedback-results.json', JSON.stringify(results, null, 2));
  console.log(`${results.length} route/viewport checks passed; hover, rapid reversal, click, keyboard, no-JS, reduced motion passed.`);
} finally { await browser.close(); }
