// SEO/GEO guard for the built site: sitemap ↔ pages ↔ canonical ↔ hreflang ↔ JSON-LD ↔ llms.txt stay consistent.
//   bun run build && bun run check:seo
// check:copy already guards title/description length and the single H1.
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = existsSync("dist/client") ? "dist/client" : "dist";
const problems: string[] = [];
const fail = (m: string) => problems.push(m);

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])))).flat();
}
const pathOf = (url: string) => new URL(url).pathname;
const fileOf = (p: string) => join(DIST, p, p.endsWith("/") ? "index.html" : "");
const attr = (html: string, re: RegExp) => html.match(re)?.[1];

interface Page { path: string; noindex: boolean; canonical?: string; title: string; description: string; alternates: Map<string, string> }
const pages = new Map<string, Page>();
for (const file of (await walk(DIST)).filter((f) => f.endsWith("index.html") && !f.includes("pagefind"))) {
  const html = await readFile(file, "utf8");
  const path = "/" + file.slice(DIST.length + 1).replace(/\\/g, "/").replace(/index\.html$/, "");
  const page: Page = {
    path,
    noindex: /<meta name="robots" content="noindex/.test(html),
    canonical: attr(html, /<link rel="canonical" href="([^"]+)"/),
    title: attr(html, /<title>([^<]*)<\/title>/) ?? "",
    description: attr(html, /<meta name="description" content="([^"]*)"/) ?? "",
    alternates: new Map([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], pathOf(m[2])])),
  };
  pages.set(path, page);
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json); } catch { fail(`${path}: JSON-LD does not parse`); }
  }
  if (!page.noindex) {
    if (!page.canonical || pathOf(page.canonical) !== path) fail(`${path}: canonical ${page.canonical} is not self-referencing`);
    if (!/<meta property="og:image" content="[^"]+"/.test(html)) fail(`${path}: missing og:image`);
    for (const [lang, target] of page.alternates) if (lang !== "x-default" && !existsSync(fileOf(target))) fail(`${path}: hreflang ${lang} → missing ${target}`);
  }
}

// Reciprocal hreflang: every alternate lists this page back.
for (const page of pages.values()) {
  if (page.noindex) continue;
  for (const [lang, target] of page.alternates) {
    if (lang === "x-default" || target === page.path) continue;
    const other = pages.get(target);
    if (other && ![...other.alternates.values()].includes(page.path)) fail(`${page.path}: ${target} does not link back via hreflang`);
  }
}

// Unique titles and descriptions among indexable pages.
for (const key of ["title", "description"] as const) {
  const seen = new Map<string, string>();
  for (const page of pages.values()) {
    if (page.noindex) continue;
    const prev = seen.get(page[key]);
    if (prev) fail(`duplicate ${key}: ${prev} and ${page.path}`);
    else seen.set(page[key], page.path);
  }
}

// Sitemap: every entry is a built, indexable page; every indexable page is listed.
const sitemap = await readFile(join(DIST, "sitemap.xml"), "utf8");
const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => pathOf(m[1])));
for (const p of listed) {
  const page = pages.get(p);
  if (!page) fail(`sitemap: ${p} has no built page`);
  else if (page.noindex) fail(`sitemap: ${p} is noindex`);
}
for (const page of pages.values()) if (!page.noindex && !listed.has(page.path)) fail(`${page.path}: indexable but missing from sitemap`);

// llms.txt links resolve, robots keeps private paths out.
const llms = await readFile(join(DIST, "llms.txt"), "utf8");
for (const [, url] of llms.matchAll(/\]\((https?:[^)]+)\)/g)) {
  const p = pathOf(url);
  if (!p.endsWith(".txt") && !p.endsWith(".xml") && !pages.has(p)) fail(`llms.txt: ${p} has no built page`);
}
const robots = await readFile(join(DIST, "robots.txt"), "utf8");
for (const p of ["/api/", "/admin/"]) if (!robots.includes(`Disallow: ${p}`)) fail(`robots.txt: missing Disallow: ${p}`);

console.log(`checked SEO on ${pages.size} pages, ${listed.size} sitemap entries`);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
