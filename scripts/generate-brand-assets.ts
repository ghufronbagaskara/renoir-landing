import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { brandColors, brandPaths } from "../src/data/brand.ts";
import { writeImage } from "./write-image.ts";

const paths = (base: string, accent = base) =>
  `<path d="${brandPaths.base}" fill="${base}"/><path d="${brandPaths.accent}" fill="${accent}"/>`;
const symbol = (base: string, accent = base) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${paths(base, accent)}</svg>\n`;
await mkdir("public/brand", { recursive: true });
await writeFile("public/brand/katalhys-symbol.svg", symbol(brandColors.primary, brandColors.accent));
await writeFile("public/brand/katalhys-symbol-white.svg", symbol("#ffffff"));
await writeFile("public/brand/katalhys-symbol-mono.svg", symbol(brandColors.ink));

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 320 320"><rect width="320" height="320" fill="#ffffff"/><g transform="translate(32 32)">${paths(brandColors.primary, brandColors.accent)}</g></svg>\n`;
await writeFile("public/favicon.svg", favicon);
await writeImage("public/favicon.png", await sharp(Buffer.from(favicon)).resize(64, 64).png().toBuffer());
await writeImage("public/apple-touch-icon.png", await sharp(Buffer.from(favicon), { density: 288 }).resize(180, 180).png().toBuffer());
console.log("Generated Katalhys color, white, monochrome SVGs and opaque white-background icons");
