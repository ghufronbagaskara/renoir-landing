import assert from 'node:assert/strict';
import { readdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

let before = 0, after = 0;
for (const entry of await readdir('src/assets/img/work', { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const directory = `src/assets/img/work/${entry.name}`;
  const original = sharp(`${directory}/pair.webp`);
  const mobile = await original.resize({ width: 720 }).webp({ quality: 85 }).toBuffer();
  assert.equal((await sharp(mobile).metadata()).width, 720);
  await sharp(mobile).toFile(`${directory}/pair-mobile.webp`);
  before += (await stat(`${directory}/pair.webp`)).size; after += mobile.length;
}
console.log(`Work mobile thumbnails: ${before} -> ${after} bytes; full-size originals retained.`);

const serviceProofs = ["order-sales/pair", "maxy-ai/pair", "expert-profile/pair", "operations-control/desktop"];
for (const proof of serviceProofs) {
  const preview = await sharp(`src/assets/img/work/${proof}.webp`).resize({ width: 320 }).webp({ quality: 85 }).toBuffer();
  assert.equal((await sharp(preview).metadata()).width, 320);
  await sharp(preview).toFile(`src/assets/img/work/${proof}-thumb.webp`);
}
console.log("Service proofs: four 320px thumbnails; full-size originals retained.");
