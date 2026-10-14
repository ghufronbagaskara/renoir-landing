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
