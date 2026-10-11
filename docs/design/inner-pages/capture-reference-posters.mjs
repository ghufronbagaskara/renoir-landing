import {chromium} from 'playwright';
import {resolve} from 'node:path';
import {writeFile} from 'node:fs/promises';
import sharp from 'sharp';

// Author media URLs were inspected in the Codex in-app browser first.
const posters = [
  ['02-design-system', 'https://cdn.dribbble.com/userupload/5515451/file/original-983e92990075647a643825b6a7e33db0.png?resize=1504x1128&vertical=center'],
  ['03-tarka', 'https://cdn.dribbble.com/userupload/35756232/file/still-b0d4f0f54683b4ab2ddf758c9fc0c8f8.png'],
];
const browser = await chromium.launch({headless: true});
try {
  for (const [id, url] of posters) {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
    await page.goto(url);
    await page.waitForFunction(() => document.querySelector('img')?.naturalWidth > 0);
    const screenshot = await page.locator('img').screenshot();
    await sharp(screenshot).webp({quality: 85}).toFile(resolve(import.meta.dirname, `references/${id}.webp`));
    await page.close();
    console.log(`Captured visible author artwork: ${id}`);
  }
  await writeFile(resolve(import.meta.dirname, 'references/poster-sources.json'), JSON.stringify(posters, null, 2));
} finally {
  await browser.close();
}
