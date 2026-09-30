import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";

const raw = join(process.cwd(), ".work-capture", "renoir-visual");
const output = join(process.cwd(), "src", "assets", "img", "editorial");
const ogOutput = join(process.cwd(), "public", "og");
await mkdir(output, { recursive: true });
await mkdir(ogOutput, { recursive: true });

type Crop = { name: string; source: string; width: number; height: number; quality?: number; position?: "right" | "centre" };
const jobs: Crop[] = [
  { name: "hero-desktop", source: "hero-desktop.png", width: 1800, height: 750, quality: 85 },
  { name: "hero-mobile", source: "hero-mobile.png", width: 900, height: 1125, quality: 85 },
  { name: "about-process", source: "about-process.png", width: 720, height: 720 },
  { name: "about-result", source: "about-result.png", width: 720, height: 720 },
  { name: "about-cta", source: "about-cta.png", width: 1800, height: 600, quality: 84 },
];

for (const service of ["marketing", "internal", "design", "care"]) {
  jobs.push({ name: `service-${service}-hero`, source: `service-${service}.png`, width: 1500, height: 700, quality: 84 });
  jobs.push({ name: `service-${service}-thumb`, source: `service-${service}.png`, width: 720, height: 720, quality: 84 });
}

for (const note of ["bought", "running", "speed"]) {
  jobs.push({ name: `note-${note}-article`, source: `note-${note}.png`, width: 1200, height: 648, quality: 84 });
  jobs.push({ name: `note-${note}-list`, source: `note-${note}.png`, width: 1000, height: 540, quality: 83 });
  jobs.push({ name: `note-${note}-card`, source: `note-${note}.png`, width: 700, height: 480, quality: 82 });
  jobs.push({ name: `note-${note}-thumb`, source: `note-${note}.png`, width: 180, height: 180, quality: 80, position: note === "bought" ? "right" : "centre" });
}

for (const job of jobs) {
  const source = join(raw, job.source);
  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height || metadata.width < job.width || metadata.height < job.height) {
    throw new Error(`Source too small for ${job.name}: ${metadata.width}×${metadata.height}`);
  }
  const dest = join(output, `${job.name}.webp`);
  await sharp(source)
    .resize(job.width, job.height, { fit: "cover", position: job.position ?? "centre", withoutEnlargement: true })
    .webp({ quality: job.quality ?? 82, effort: 6, smartSubsample: true })
    .toFile(dest);
  const bytes = (await stat(dest)).size;
  console.log(`${job.name}.webp ${job.width}×${job.height} ${(bytes / 1024).toFixed(0)} KB`);
}

const sourceScreens = [
  ["home-proof-website", "maxy-ai"],
  ["home-proof-system", "order-sales"],
] as const;
for (const [name, project] of sourceScreens) {
  const screen = join(process.cwd(), "src", "assets", "img", "work", project, "desktop.webp");
  const inset = await sharp(screen).resize(600, 375, { fit: "contain", background: "#fff", withoutEnlargement: true }).png().toBuffer();
  const dest = join(output, `${name}.webp`);
  await sharp({ create: { width: 720, height: 720, channels: 4, background: "#f5f7fb" } })
    .composite([{ input: inset, left: 60, top: 172 }])
    .webp({ quality: 84, effort: 6 })
    .toFile(dest);
  console.log(`${name}.webp 720×720 ${((await stat(dest)).size / 1024).toFixed(0)} KB`);
}

const mark = '<path d="M27 11 43 2v36L27 47V11Z"/><path d="M3 45 24 33 42 44 21 56 3 45Z"/><path d="M47 31 63 40v20L46 50V31Z"/>';
for (const [locale, line, footer] of [
  ["en", "Design and engineering, one studio", "IDENTITY  /  WEBSITES  /  SYSTEMS"],
  ["id", "Desain dan rekayasa, satu studio", "IDENTITAS  /  WEBSITE  /  SISTEM"],
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
  await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(dest);
  console.log(`renoir-${locale}.jpg 1200×630 ${((await stat(dest)).size / 1024).toFixed(0)} KB`);
}
