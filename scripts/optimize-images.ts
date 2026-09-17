// Converts src/assets/img/**/*.{jpg,jpeg,png} to WebP next to the original, then deletes the original.
// Why: Alchemy's Cloudflare Astro adapter hardwires Astro's `passthrough` image service
// (workerd can't run sharp), so images must already be optimised at the source.
// Components keep using the template file names ("banner/banner-1.jpg"); ~/lib/images maps them to .webp.
//   bun run images:optimize
import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = "src/assets/img";
const MAX_WIDTH = 1920;

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])))).flat();
}

let before = 0;
let after = 0;
for (const file of (await walk(ROOT)).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const out = file.replace(/\.(jpe?g|png)$/i, ".webp");
  const input = sharp(file);
  const { width = 0, size = 0 } = await input.metadata();
  const info = await input
    .resize({ width: Math.min(width, MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 90, effort: 6 })
    .toFile(out);
  before += size || (await Bun.file(file).size);
  after += info.size;
  await rm(file);
}
console.log(`webp: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
