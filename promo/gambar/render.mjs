// Render an Instagram post folder to numbered JPEGs.
//
//   node promo/gambar/render.mjs promo/gambar/<NN-post-name> [--scale 2]
//
// The post's index.html holds one #canvas with data-slides / data-w / data-h; slide i is the
// region x = i * w. Each slide is captured at `scale`× and downsampled with Lanczos for crisp text,
// then written to <post>/renders/<post-name>-NN.jpg (plus <post-name>-panorama.jpg when slides > 1).
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const repo = resolve(import.meta.dirname, "../..");
const req = createRequire(join(repo, "package.json"));
const { chromium } = req("playwright");
const sharp = req("sharp");

const dir = resolve(process.argv[2] ?? "");
const scaleArg = process.argv.indexOf("--scale");
const SCALE = scaleArg > 0 ? Number(process.argv[scaleArg + 1]) : 2;
const name = basename(dir);
const outDir = join(dir, "renders");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const probe = await browser.newPage();
await probe.goto(pathToFileURL(join(dir, "index.html")).href);
const { n, w, h } = await probe.$eval("#canvas", (el) => ({ n: +el.dataset.slides, w: +el.dataset.w, h: +el.dataset.h }));
await probe.close();

const page = await browser.newPage({ viewport: { width: n * w, height: h }, deviceScaleFactor: SCALE });
await page.goto(pathToFileURL(join(dir, "index.html")).href, { waitUntil: "load" });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => i.decode()));
});
assert.equal(await page.locator(".s").count(), n, "Slide count must match canvas metadata");
assert(await page.evaluate(() => [...document.querySelectorAll("h1, h2, h3, h4, h5, h6, h1 span, h2 span, .action")]
  .every(el => !el.textContent.trim().endsWith("."))), "Headings and CTA labels must not end with a period");
assert(await page.evaluate(() => document.fonts.check('600 96px "General Sans"') && document.fonts.check('400 34px Inter')), "Brand fonts must load before export");
const overflow = await page.evaluate(() => [...document.querySelectorAll(".s")].flatMap((slide, index) => {
  const bounds = slide.getBoundingClientRect();
  const footer = slide.querySelector(".footer").getBoundingClientRect();
  return [...slide.querySelectorAll("h1 span, h2 span, h3, p, figcaption, .label, .series, .footer span, .action")].flatMap((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const rect = range.getBoundingClientRect();
    const bottom = el.closest(".footer") ? bounds.bottom - 24 : footer.top - 12;
    return rect.left < bounds.left + 24 || rect.right > bounds.right - 24 || rect.bottom > bottom
      ? [`Slide ${index + 1}: ${el.textContent.trim().slice(0, 75)}`] : [];
  });
}));
assert.deepEqual(overflow, [], "Text must stay inside its slide and above the footer");

const jpeg = (img) => img.jpeg({ quality: 95, mozjpeg: true, chromaSubsampling: "4:4:4" });
for (let i = 0; i < n; i++) {
  const png = await page.screenshot({ type: "png", clip: { x: i * w, y: 0, width: w, height: h } });
  const file = join(outDir, `${name}-${String(i + 1).padStart(2, "0")}.jpg`);
  await jpeg(sharp(png).resize(w, h, { kernel: "lanczos3" })).toFile(file);
  console.log(file);
}
if (n > 1) {
  const full = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: n * w, height: h } });
  const file = join(outDir, `${name}-panorama.jpg`);
  await jpeg(sharp(full).resize(Math.round((n * w) / 2), Math.round(h / 2), { kernel: "lanczos3" })).toFile(file);
  console.log(file);
}
await browser.close();
