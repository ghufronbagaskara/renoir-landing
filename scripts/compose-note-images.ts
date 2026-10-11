import sharp from "sharp";
import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const raw = ".work-capture/renoir-visual";
const out = "src/assets/img/editorial";
await mkdir(raw, { recursive: true });
const font = (
  await readFile("src/assets/fonts/GeneralSans-Semibold.woff2")
).toString("base64");
const browser = await chromium.launch({ headless: true });
const ink = "#17191c",
  blue = "#1d4ed8",
  paper = "#f5f7fb";
const rect = (x: number, y: number, w: number, h: number, fill = "#fff") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${ink}" stroke-width="2"/>`;
const text = (x: number, y: number, label: string, size = 25) =>
  `<text x="${x}" y="${y}" fill="${ink}" font-size="${size}">${label}</text>`;
const line = (x: number, y: number, w: number, color = ink) =>
  `<path d="M${x} ${y}h${w}" stroke="${color}" stroke-width="3"/>`;
const arrow = (x: number, y: number, w: number) =>
  `<path d="M${x} ${y}h${w}m-10-8 10 8-10 8" fill="none" stroke="${blue}" stroke-width="3"/>`;
function scene(note: string, locale: string) {
  const id = locale === "id";
  if (note === "bought") {
    let s = text(
      85,
      110,
      id ? "Struktur yang mengikuti kebutuhan" : "Structure follows the need",
      34,
    );
    for (let i = 0; i < 3; i++) {
      const x = 85 + i * 216;
      s +=
        rect(x, 190, 172, 310) +
        rect(x + 15, 213, 142, 68, "#e5eaf2") +
        line(x + 15, 311, 118) +
        line(x + 15, 333, 118) +
        line(x + 15, 355, 118) +
        rect(x + 15, 395, 61, 70, "#e5eaf2") +
        rect(x + 96, 395, 61, 70, "#e5eaf2");
    }
    s +=
      arrow(718, 345, 61) +
      rect(830, 170, 270, 350) +
      rect(849, 195, 156, 110, blue) +
      line(1020, 211, 55) +
      line(1020, 238, 45) +
      line(850, 335, 200) +
      line(850, 357, 152) +
      rect(849, 386, 232, 94, "#e5eaf2");
    return (
      s +
      text(85, 574, id ? "Seragam" : "Repeated", 22) +
      text(
        830,
        574,
        id ? "Disusun untuk isinya" : "Built around its content",
        22,
      )
    );
  }
  if (note === "running") {
    let s = text(
      85,
      110,
      id ? "Serah terima sampai bisa digunakan" : "Handover through to use",
      34,
    );
    s +=
      rect(85, 215, 250, 240, ink) +
      `<path d="m169 279-33 42 33 42m78-84 33 42-33 42m-26-90-22 95" stroke="#fff" stroke-width="4" fill="none"/>` +
      arrow(367, 335, 96) +
      rect(500, 185, 300, 300) +
      line(500, 231, 300);
    s +=
      `<circle cx="650" cy="341" r="55" fill="${blue}"/><path d="m620 341 21 22 40-45" stroke="#fff" stroke-width="5" fill="none"/>` +
      arrow(831, 335, 62);
    for (const [i, label] of (id
      ? ["Akses", "Pemantauan", "Backup"]
      : ["Access", "Monitoring", "Backups"]
    ).entries())
      s +=
        rect(930, 190 + i * 110, 180, 80) + text(947, 238 + i * 110, label, 22);
    return (
      s +
      text(85, 566, id ? "Kode" : "Code", 22) +
      text(500, 566, id ? "Aplikasi berjalan" : "Running application", 22)
    );
  }
  let s = text(
    85,
    110,
    id
      ? "Performa dirancang sejak awal"
      : "Performance starts in the specification",
    34,
  );
  const labels = id
    ? ["Konten muncul", "Layout stabil", "Langsung merespons"]
    : ["Content appears", "Layout stays still", "Interaction responds"];
  for (let i = 0; i < 3; i++) {
    const x = 85 + i * 370;
    s +=
      rect(x, 190, 290, 300) +
      line(x, 230, 290) +
      rect(x + 18, 250, 160, 70, "#e5eaf2") +
      line(x + 18, 346, 244) +
      line(x + 18, 369, 201) +
      rect(x + 18, 405, 125, 46, blue) +
      text(x, 563, labels[i]!, 22);
    if (i === 0)
      s += `<path d="M${x + 26} 285h53m-53 13h91" stroke="${blue}" stroke-width="4"/>`;
    if (i === 1)
      s += `<path d="M${x - 14} 249v204m-6-204h12m-12 204h12" stroke="${blue}" stroke-width="2"/>`;
    if (i === 2)
      s += `<path d="m${x + 100} 419 22 31 5-15 15-5Z" fill="#fff" stroke="${ink}" stroke-width="2"/>`;
  }
  return s;
}

try {
  for (const note of ["bought", "running", "speed"]) {
    for (const locale of ["en", "id"]) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="648" viewBox="0 0 1200 648"><rect width="1200" height="648" fill="${paper}"/>${scene(note, locale)}</svg>`;
      await writeFile(join(raw, `note-${note}-${locale}.svg`), svg);
      const page = await browser.newPage({
        viewport: { width: 1200, height: 648 },
      });
      await page.setContent(
        `<style>@font-face{font-family:General;src:url(data:font/woff2;base64,${font})}body{margin:0}svg{font-family:General,sans-serif}</style>${svg}`,
      );
      await page.evaluate(() => document.fonts.ready);
      const master = await page.screenshot();
      await page.close();
      await writeFile(join(raw, `note-${note}-${locale}.png`), master);
      for (const [role, width, height] of [
        ["article", 1200, 648],
        ["list", 1000, 540],
        ["card", 700, 480],
        ["thumb", 180, 180],
      ] as const) {
        await sharp(master)
          .resize(width, height, {
            fit: "contain",
            background: paper,
            withoutEnlargement: true,
          })
          .webp({ quality: 90, effort: 6 })
          .toFile(join(out, `note-${note}-${role}-${locale}.webp`));
      }
    }
  }
} finally {
  await browser.close();
}
