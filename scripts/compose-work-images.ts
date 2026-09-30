import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";

type Box = { left: number; top: number; width: number; height: number };
type Redactions = Record<string, Record<string, Box[]>>;
const [slug] = process.argv.slice(2);
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  throw new Error("Usage: bun scripts/compose-work-images.ts <slug>");
}

const rawDir = join(".work-capture", slug);
const imageDir = join("src", "assets", "img", "work", slug);
const ogDir = join("public", "og", "work");
const redactions = JSON.parse(await readFile(join("scripts", "work-redactions.json"), "utf8")) as Redactions;
const supporting: Record<string, string[]> = {
  "order-sales": ["order-detail", "receivables", "sales-mobile"],
  "industrial-coatings": ["catalogue", "product", "chat", "quote", "quote-submit"],
  "field-projects": ["project-detail", "daily-mobile", "review"],
  "expert-profile": ["resources", "resource-modal"],
  "maxy-ai": ["agentic", "web-app"],
  "ai-ceo-circle": ["program", "application"],
  "activity-review": ["timeline", "anomalies"],
  "operations-control": [],
};
if (!supporting[slug]) throw new Error(`Unknown work project: ${slug}`);
await mkdir(imageDir, { recursive: true });
await mkdir(ogDir, { recursive: true });

async function source(name: string) {
  const path = join(rawDir, `${name}.png`);
  let image = sharp(path).rotate();
  const meta = await image.metadata();
  const boxes = redactions[slug]?.[name] ?? [];
  for (const box of boxes) {
    if (box.left < 0 || box.top < 0 || box.left + box.width > (meta.width ?? 0) || box.top + box.height > (meta.height ?? 0)) {
      throw new Error(`Redaction outside ${slug}/${name}`);
    }
  }
  if (boxes.length) {
    const layers = await Promise.all(boxes.map(async (box) => ({
      input: await sharp(path).extract(box).blur(36).png().toBuffer(),
      left: box.left,
      top: box.top,
    })));
    image = image.composite(layers);
  }
  return image.png().toBuffer();
}

for (const name of supporting[slug]) {
  await sharp(await source(name)).webp({ quality: 93, effort: 6 }).toFile(join(imageDir, `${name}.webp`));
}

const desktop = await source("desktop");
const mobile = await source("mobile");
await sharp(desktop).webp({ quality: 93, effort: 6 }).toFile(join(imageDir, "desktop.webp"));
await sharp(mobile).webp({ quality: 93, effort: 6 }).toFile(join(imageDir, "mobile.webp"));

const background = Buffer.from(`<svg width="1800" height="1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="1800" height="1000" fill="#f2f5fa"/>
  <rect x="48" y="81" width="1334" height="838" rx="15" fill="#151a22"/>
  <rect x="1412" y="129" width="340" height="742" rx="24" fill="#151a22"/>
  <circle cx="73" cy="101" r="5" fill="#a7b5cd"/><circle cx="91" cy="101" r="5" fill="#a7b5cd"/>
  <rect x="1504" y="140" width="154" height="6" rx="3" fill="#596272"/>
</svg>`);
const desktopFit = await sharp(desktop).resize(1322, 826, { fit: "contain", withoutEnlargement: true }).webp({ quality: 94 }).toBuffer();
const mobileFit = await sharp(mobile).resize(328, 710, { fit: "contain", withoutEnlargement: true }).webp({ quality: 94 }).toBuffer();
const dm = await sharp(desktopFit).metadata();
const mm = await sharp(mobileFit).metadata();
const pair = await sharp(background).composite([
  { input: desktopFit, left: 54 + Math.floor((1322 - (dm.width ?? 0)) / 2), top: 87 + Math.floor((826 - (dm.height ?? 0)) / 2) },
  { input: mobileFit, left: 1418 + Math.floor((328 - (mm.width ?? 0)) / 2), top: 151 + Math.floor((710 - (mm.height ?? 0)) / 2) },
]).webp({ quality: 93, effort: 6 }).toBuffer();
await sharp(pair).toFile(join(imageDir, "pair.webp"));
await sharp(pair).resize(1200, 630, { fit: "contain", background: "#f2f5fa" }).jpeg({ quality: 90 }).toFile(join(ogDir, `${slug}.jpg`));
console.log(`${slug}: ${supporting[slug].length} supporting screens, desktop, mobile, pair, OG`);
