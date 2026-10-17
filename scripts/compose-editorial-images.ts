import sharp from "sharp";
import { mkdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { brandArtwork, brandColors } from "../src/data/brand.ts";
import { writeImage } from "./write-image.ts";
import "./compose-campaign-images.ts";
import "./compose-note-images.ts";
const ogOutput = join(process.cwd(), "public", "og");
await mkdir(ogOutput, { recursive: true });
const font = (await readFile("src/assets/fonts/GeneralSans-Semibold.woff2")).toString("base64");
const browser = await chromium.launch({ headless: true });
try {
  for (const [locale, line, footer] of [
    [
      "en",
      "Design and engineering, one studio",
      "IDENTITY  /  WEBSITES  /  SYSTEMS",
    ],
    [
      "id",
      "Desain dan rekayasa, satu studio",
      "IDENTITAS  /  WEBSITE  /  SISTEM",
    ],
  ] as const) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    const dest = join(ogOutput, `katalhys-${locale}.jpg`);
    try {
      await page.setContent(`<style>@font-face{font-family:General;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;background:${brandColors.primary};color:white;font-family:General,sans-serif}main{padding:80px}.brand{display:flex;align-items:center;gap:28px}.brand svg{width:90px;height:90px}.brand strong{font-size:88px;letter-spacing:-.055em;font-weight:600}.rule{height:2px;background:${brandColors.accent};margin:80px 0 60px}h1{font-size:48px;font-weight:600;margin:0}p{font-size:26px;letter-spacing:2px;color:${brandColors.panel};margin-top:100px}</style><main><div class="brand"><svg viewBox="0 0 256 256" fill="white">${brandArtwork("white")}</svg><strong>Katalhys</strong></div><div class="rule"></div><h1>${line}</h1><p>${footer}</p></main>`);
      await page.evaluate(() => document.fonts.ready);
      await writeImage(dest, await sharp(await page.screenshot()).jpeg({ quality: 88, mozjpeg: true }).toBuffer());
    } finally {
      await page.close();
    }
    console.log(
      `katalhys-${locale}.jpg 1200×630 ${((await stat(dest)).size / 1024).toFixed(0)} KB`,
    );
  }
} finally {
  await browser.close();
}
