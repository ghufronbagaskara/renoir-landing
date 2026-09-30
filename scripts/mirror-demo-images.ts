// One-off: download the real demo images (the local template ships grey placeholders)
// into src/assets/img, keeping the template's folder layout.
// NOTE: demo photos are preview-licensed only — replace with Renoir assets before go-live.
import { mkdir, copyFile, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const TEMPLATE = "averix-modern-creative-agency-html-template-2026-06-19-09-20-31-utc/template-for-landing/averix";
const DEMO = "https://html.sthemeit.com/averix-demo/";
const OUT = "src/assets/img";
const PAGES = [
  "index", "about-us", "service", "service-details", "team", "team-details",
  "pricing", "portfolio", "portfolio-details", "blog-standard", "blog-details", "contact",
];

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])),
  );
  return nested.flat();
}

const sources = [
  ...PAGES.map((p) => join(TEMPLATE, `${p}.html`)),
  ...(await walk(join(TEMPLATE, "assets/scss"))),
];

const paths = new Set<string>();
for (const file of sources) {
  const text = await readFile(file, "utf8");
  // HTML refs look like "assets/img/x.jpg"; SCSS refs look like "../img/x.jpg"
  for (const m of text.matchAll(/(?:assets\/|\.\.\/)img\/([\w\-./]+?\.(?:jpe?g|png|svg|webp|gif))/gi)) {
    paths.add(m[1]);
  }
}

const failed: string[] = [];
const queue = [...paths];
async function worker() {
  for (let p = queue.shift(); p; p = queue.shift()) {
    const dest = join(OUT, p);
    await mkdir(dirname(dest), { recursive: true });
    const res = await fetch(DEMO + "assets/img/" + p).catch(() => null);
    if (res?.ok) {
      await writeFile(dest, new Uint8Array(await res.arrayBuffer()));
    } else {
      failed.push(p);
      await copyFile(join(TEMPLATE, "assets/img", p), dest).catch(() => {});
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

console.log(`images: ${paths.size} referenced, ${paths.size - failed.length} mirrored`);
if (failed.length) console.log("fell back to local placeholder:\n  " + failed.join("\n  "));
