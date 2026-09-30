// Fails if any built page links to an internal URL that doesn't exist in dist/, or uses href="#".
// Run after `astro build`: bun run check:links
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = existsSync("dist/client") ? "dist/client" : "dist";
const ON_DEMAND = new Set(["/api/contact"]);

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])))).flat();
}

const pages = (await walk(DIST)).filter((f) => f.endsWith(".html"));
const problems: string[] = [];
for (const file of pages) {
  const html = await readFile(file, "utf8");
  for (const [, attr, url] of html.matchAll(/\s(href|action)="([^"]*)"/g)) {
    if (url === "#" || url === "") { problems.push(`${file}: empty ${attr}="${url}"`); continue; }
    if (!url.startsWith("/") || url.startsWith("//")) continue;
    const path = decodeURI(url.split(/[?#]/)[0]);
    if (ON_DEMAND.has(path)) continue;
    const target = join(DIST, path);
    if (!(existsSync(join(target, "index.html")) || (existsSync(target) && !path.endsWith("/")))) {
      problems.push(`${file}: broken ${attr}="${url}"`);
    }
  }
}
console.log(`checked ${pages.length} pages`);
if (problems.length) {
  console.error([...new Set(problems)].join("\n"));
  process.exit(1);
}
