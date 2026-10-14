import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import sharp from 'sharp';

const browser = await chromium.launch();
const routes = { services: ['services', 'id/layanan'], process: ['process', 'id/proses'], portfolio: ['portfolio', 'id/karya'], about: ['about', 'id/tentang'], notes: ['notes', 'id/catatan'], contact: ['contact', 'id/kontak'] };
const results = [];
const base = 'http://127.0.0.1:4392/';
async function load(route, width, javaScriptEnabled = true) {
  const page = await browser.newPage({ viewport: { width, height: 852 }, isMobile: width <= 767, hasTouch: width <= 767, reducedMotion: 'reduce', javaScriptEnabled });
  await page.goto(base + route + '/');
  await page.evaluate(async () => { for (const img of document.images) img.loading = 'eager'; await document.fonts.ready; });
  await page.waitForTimeout(350);
  return page;
}
try {
  for (const [name, translations] of Object.entries(routes)) {
    for (const route of translations) for (const width of [320, 394, 430, 768, 1440]) {
      console.log(`Checking ${route} ${width}`);
      const page = await load(route, width);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert(overflow <= 1, `${route} ${width}: ${overflow}px overflow`);
      assert.equal(await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || !img.naturalWidth).length), 0, `${route}: failed image`);
      if (width <= 767) {
        if (name === 'portfolio' || name === 'notes') {
          if (name === 'portfolio') assert(await page.locator('.work-featured-image img').first().evaluate(img => img.currentSrc !== img.src), `${route}: responsive mobile thumbnail`);
          const selector = name === 'portfolio' ? '.work-featured-card' : '[data-note-card]';
          const boxes = await page.locator(selector).evaluateAll(nodes => nodes.slice(0, 2).map(n => { const r = n.getBoundingClientRect(); return { x: r.x, y: r.y }; }));
          assert(Math.abs(boxes[0].y - boxes[1].y) < 1 && boxes[1].x > boxes[0].x, `${route}: two-column layout`);
          await page.locator('.mobile-card-details summary').first().click();
          assert(await page.locator('.mobile-card-details').first().getAttribute('open') !== null);
        }
        if (name === 'process') {
          await page.locator('.process-mobile summary').nth(2).click();
          assert.equal(await page.locator('.process-mobile details[open]').count(), 1);
          assert(await page.locator('.process-mobile details').nth(2).getAttribute('open') !== null);
          const button = page.locator('#process-faq button').nth(1);
          await button.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(350);
          assert.equal(await button.getAttribute('aria-expanded'), 'true');
          assert(await page.locator(`#${await button.getAttribute('aria-controls')}`).isVisible());
        }
        if (name === 'services') {
          await page.locator('.engagement-item summary').nth(1).click(); await page.waitForTimeout(350);
          assert(await page.locator('.engagement-item').nth(1).getAttribute('open') !== null);
        }
        if (name === 'contact') {
          assert(await page.locator('#project-form').evaluate(el => el.getBoundingClientRect().height) < 720);
          const fields = await page.locator('#project-form :is(input:not([type=hidden]),select,textarea)').evaluateAll(nodes => nodes.filter(n => n.name !== 'company_website').map(n => ({ name: n.name, height: n.getBoundingClientRect().height, label: n.labels?.[0]?.getBoundingClientRect().height, font: getComputedStyle(n).fontSize })));
          for (const field of fields) assert(field.height >= 44 && field.label > 0 && parseFloat(field.font) >= 16, `${route}: ${field.name} field`);
          assert.equal(await page.locator('#project-form form').evaluate(f => f.checkValidity()), false);
        }
      }
      results.push({ route, width, overflow });
      if (width === 394) {
        await page.evaluate(async () => { for (const img of document.images) { try { await img.decode(); } catch {} } });
        for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 700) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(60); }
        await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(200);
        await page.screenshot({ path: `docs/design/mobile/qa/final-${route.replaceAll('/', '-')}.png`, fullPage: true });
      }
      await page.close();
    }
  }
  for (const [name, translations] of Object.entries(routes)) {
    const page = await load(translations[0], 394, false);
    assert(await page.locator('main').isVisible());
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    if (name === 'process') {
      await page.locator('.process-mobile summary').nth(1).click();
      assert(await page.locator('.process-mobile details').nth(1).getAttribute('open') !== null);
      assert.equal(await page.locator('#process-faq .accordion-collapse').evaluateAll(nodes => nodes.filter(n => getComputedStyle(n).display !== 'none').length), 6);
    }
    await page.close();
  }
  const work = await load('portfolio', 394);
  await work.locator('[data-work-service="marketing"]').click();
  assert(await work.locator('[data-work-card]:visible').count() < 8);
  await work.locator('[data-work-service=""]').click();
  await work.locator('#work-search-input').fill('this-query-has-no-project');
  await work.locator('[data-work-search]').evaluate(f => f.requestSubmit());
  assert(await work.locator('[data-work-empty]').isVisible());
  await work.close();
  const notes = await load('notes', 394);
  await notes.locator('[data-notes-category]').first().click();
  assert.equal(await notes.locator('[data-note-card]:visible').count(), 1);
  await notes.close();
  const failed = await browser.newPage({ viewport: { width: 394, height: 852 } });
  await failed.route('**/*.{webp,png,jpg,svg}', route => route.abort());
  await failed.goto(base + 'services/');
  assert(await failed.locator('.si-service-2-box h3').first().isVisible());
  assert(await failed.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await failed.close();
  for (const width of [394, 1440]) {
    const original = await sharp(await readFile(`docs/design/mobile/qa/home-before-${width}.png`)).raw().toBuffer({ resolveWithObject: true });
    const final = await sharp(await readFile(`docs/design/mobile/qa/home-after-${width}.png`)).raw().toBuffer({ resolveWithObject: true });
    assert.deepEqual(final.info, original.info, `Home ${width}: unchanged dimensions`);
    const home = await browser.newPage({ viewport: { width, height: 852 }, reducedMotion: 'reduce' });
    await home.goto(base); await home.evaluate(() => document.fonts.ready);
    const images = await home.locator('img').evaluateAll(nodes => nodes.map(n => { const r = n.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; }));
    let changed = 0, imageTimingChannels = 0;
    for (let i = 0; i < original.data.length; i++) if (original.data[i] !== final.data[i]) {
      const pixel = Math.floor(i / original.info.channels), x = pixel % width, y = Math.floor(pixel / width);
      // Lazy images and hover thumbnails can finish at different times between captures.
      if (images.some(r => x >= Math.floor(r.left) && x < Math.ceil(r.right) && y >= Math.floor(r.top) && y < Math.ceil(r.bottom))) imageTimingChannels++;
      else changed++;
    }
    assert.equal(changed, 0, `Home ${width}: changed non-image pixel channels`);
    console.log(`Home ${width}: unchanged geometry and non-image pixels; ${imageTimingChannels} image-timing channels`);
    await home.close();
  }
  await writeFile('docs/design/mobile/qa/results.json', JSON.stringify({ screens: results, checks: ['two-column Work/Notes', 'touch/keyboard disclosures', 'visible labels and native form validation', 'search and filters', 'no JavaScript', 'failed images', 'reduced motion', 'Home geometry and non-image pixel equality at 394/1440; lazy-image timing excluded'] }, null, 2));
  console.log(`PASS: ${results.length} EN/ID route/viewport checks; disclosure, form, filter, fallback and Home isolation checks.`);
} finally { await browser.close(); }
