import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { brandArtwork, brandColors } from "../src/data/brand.ts";
import { writeImage } from "./write-image.ts";
import assert from "node:assert/strict";

const symbol = (variant: "color" | "white" | "current") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" color="${brandColors.ink}">${brandArtwork(variant)}</svg>\n`;
await mkdir("public/brand", { recursive: true });
await writeFile("public/brand/katalhys-symbol.svg", symbol("color"));
await writeFile("public/brand/katalhys-symbol-white.svg", symbol("white"));
await writeFile("public/brand/katalhys-symbol-mono.svg", symbol("current"));

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 320 320"><rect width="320" height="320" fill="#ffffff"/><g transform="translate(32 32)">${brandArtwork("color", "favicon")}</g></svg>\n`;
await writeFile("public/favicon.svg", favicon);
await writeImage("public/favicon.png", await sharp(Buffer.from(favicon)).resize(64, 64).png().toBuffer());
await writeImage("public/apple-touch-icon.png", await sharp(Buffer.from(favicon), { density: 288 }).resize(180, 180).png().toBuffer());
const icon = await sharp("public/favicon.png").ensureAlpha().raw().toBuffer();
for (let index = 3; index < icon.length; index += 4) assert.equal(icon[index], 255, "Favicon must be opaque");
assert.deepEqual([...icon.subarray(0, 4)], [255, 255, 255, 255], "Favicon must have a white background");
const white = await sharp(Buffer.from(symbol("white"))).resize(256, 256).ensureAlpha().raw().toBuffer();
assert.equal(white[(140 * 256 + 16) * 4 + 3], 0, "The flowing channel must remain transparent");
assert(white.some((value, index) => index % 4 === 3 && value > 0), "The white logo must remain visible");
console.log("Generated Katalhys color, white, monochrome SVGs and opaque white-background icons");
