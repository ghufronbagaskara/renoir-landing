import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import "./compose-campaign-images.ts";
import "./compose-note-images.ts";
const ogOutput = join(process.cwd(), "public", "og");
await mkdir(ogOutput, { recursive: true });
const mark =
  '<path d="M27 11 43 2v36L27 47V11Z"/><path d="M3 45 24 33 42 44 21 56 3 45Z"/><path d="M47 31 63 40v20L46 50V31Z"/>';
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#17191c"/>
    <g fill="#1d4ed8" transform="translate(80 84) scale(1.45)">${mark}</g>
    <text x="190" y="160" fill="#fff" font-family="Arial, sans-serif" font-size="88" font-weight="700">Renoir</text>
    <path d="M80 262h1040" stroke="#3a3f49" stroke-width="2"/>
    <text x="80" y="388" fill="#fff" font-family="Arial, sans-serif" font-size="48" font-weight="600">${line}</text>
    <text x="80" y="548" fill="#aeb4c0" font-family="Arial, sans-serif" font-size="26" letter-spacing="2">${footer}</text>
  </svg>`;
  const dest = join(ogOutput, `renoir-${locale}.jpg`);
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(dest);
  console.log(
    `renoir-${locale}.jpg 1200×630 ${((await stat(dest)).size / 1024).toFixed(0)} KB`,
  );
}
