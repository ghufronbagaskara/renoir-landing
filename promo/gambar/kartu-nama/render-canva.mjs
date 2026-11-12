import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const [python, runtimeModules, output = join(import.meta.dirname, "renders", "v2", "katalhys-kartu-nama-canva.pptx"), review] =
  process.argv.slice(2);
if (!python || !runtimeModules) throw new Error("Isi path Python dan node_modules dari runtime Codex.");
const requireRuntime = createRequire(resolve(runtimeModules, "..", "resolve.cjs"));
const { Presentation, PresentationFile } =
  await import(pathToFileURL(requireRuntime.resolve("@oai/artifact-tool")).href);
const art = join(import.meta.dirname, ".review", "art-v2");
await mkdir(art, { recursive: true });
const artwork = new Map();
await Promise.all(["depan", "belakang"].map(async (side) => {
  const full = await sharp(join(import.meta.dirname, `art-${side}.svg`), { density: 1440 })
    .flatten({ background: "#101D37" }).png().toBuffer();
  await writeFile(join(art, `${side}-bleed.png`), full);
  artwork.set(side, await sharp(full).extract({ left: 60, top: 60, width: 1800, height: 1100 }).png().toBuffer());
}));
const logo = await sharp(join(import.meta.dirname, "../../../public/brand/katalhys-symbol.svg"), { density: 216 })
  .png().toBuffer();
await writeFile(join(art, "logo.png"), logo);
const { width, height, pages } = JSON.parse(execFileSync(python, [join(import.meta.dirname, "render.py"), art], {
  encoding: "utf8",
}));
const px = (mm) => mm * 96 / 25.4;
const box = (x, y, w, h) => ({ left: px(x), top: px(y), width: px(w), height: px(h) });
const deck = Presentation.create({ slideSize: { width: px(width), height: px(height) } });
const noLine = { fill: "none", width: 0 };

for (const [index, page] of pages.entries()) {
  const slide = deck.slides.add();
  slide.images.add({ blob: artwork.get(page.art), contentType: "image/png", alt: "Latar kartu Katalhys",
    fit: "contain", position: box(0, 0, width, height) });
  if (page.logo) {
    const [x, y, side] = page.logo;
    slide.images.add({ blob: logo, contentType: "image/png", alt: "Simbol Katalhys gradasi navy dan cyan",
      fit: "contain", position: box(x, y, side, side) });
  }
  for (const label of page.labels) {
    const shape = slide.shapes.add({ name: label.text, geometry: "textbox",
      position: box(label.x, label.y, label.width, label.size * 1.24 * 25.4 / 72),
      fill: "none", line: noLine });
    shape.text = label.text;
    shape.text.style = {
      typeface: "Arial", fontSize: label.size * 4 / 3, bold: label.bold, color: label.color,
      insets: 0, wrap: "none",
    };
  }
  if (review) {
    await mkdir(review, { recursive: true });
    const png = await deck.export({ slide, format: "png", scale: 3 });
    await writeFile(join(review, `canva-${index + 1}.png`), new Uint8Array(await png.arrayBuffer()));
  }
}

await (await PresentationFile.exportPptx(deck)).save(output);
