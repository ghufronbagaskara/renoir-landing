// Copy guard for built pages (brief §9–10). Fails on banned vocabulary, exclamation marks, leftover
// template copy, and page titles/descriptions outside SERP bounds.
//   bun run build && bun run check:copy
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = existsSync("dist/client") ? "dist/client" : "dist";

const BANNED = [
  // EN (brief §10)
  "solution provider", "one-stop", "digital solutions", "cutting-edge", "state-of-the-art", "world-class",
  "industry-leading", "passionate team", "we leverage", "synergy", "seamless", "robust", "empower", "unlock",
  "elevate", "revolutionise", "revolutionize", "game-changer", "next-level", "innovative", "dynamic", "bespoke",
  "holistic", "end-to-end", "turnkey", "in today's digital", "take your business to the next level",
  "leading", "premier", "best-in-class", "transform", "disrupt", "supercharge",
  // ID equivalents
  "solusi digital", "solusi terpadu", "terdepan", "berkelas dunia", "inovatif", "canggih", "mutakhir", "holistik",
  "memberdayakan", "merevolusi", "level berikutnya", "era digital",
];
const TEMPLATE = ["averix", "ovanta", "lorem", "ipsum", "nemo enim", "happy clients", "awards winner", "$99", "/monthly"];

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])))).flat();
}

const visibleText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ");

const problems: string[] = [];
const pages = (await walk(DIST)).filter((f) => f.endsWith(".html") && !f.includes("pagefind"));
for (const file of pages) {
  const html = await readFile(file, "utf8");
  const text = visibleText(html.slice(html.indexOf("<body")));
  const lower = text.toLowerCase();
  for (const word of BANNED) {
    if (new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(lower)) problems.push(`${file}: banned word "${word}"`);
  }
  {
    if (/!(\s|$)/.test(text)) problems.push(`${file}: exclamation mark in visible text`);
    for (const word of TEMPLATE) if (lower.includes(word)) problems.push(`${file}: template copy "${word}"`);

    const noindex = html.includes('content="noindex');
    if (!noindex) {
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
      if (title.length < 30 || title.length > 70) problems.push(`${file}: title length ${title.length} "${title}"`);
      if (description.length < 70 || description.length > 200) problems.push(`${file}: description length ${description.length}`);
      const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
      if (h1 !== 1) problems.push(`${file}: ${h1} <h1> elements`);
    }
  }
}

console.log(`checked copy on ${pages.length} pages`);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
