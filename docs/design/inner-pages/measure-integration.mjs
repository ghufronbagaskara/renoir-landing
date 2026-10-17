import { readFileSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
const results = [];
for (const route of [
  "services/internal-systems",
  "services/marketing-sites",
  "",
]) {
  const html = readFileSync(`dist/client/${route}/index.html`, "utf8");
  const sources = [
    ...html.matchAll(/<script\b[^>]*\bsrc=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/g),
  ].map((match) => match[1] || match[2] || match[3]);
  const sceneScripts = sources
    .filter((source) => source.startsWith("/_astro/"))
    .flatMap((source) => {
      const js = readFileSync("dist/client" + source);
      return js.toString().includes("data-internal-flow")
        ? [{ source, rawBytes: js.length, gzipBytes: gzipSync(js).length }]
        : [];
    });
  for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
    if (match[1].includes("data-internal-flow"))
      sceneScripts.push({
        source: "inline",
        rawBytes: Buffer.byteLength(match[1]),
        gzipBytes: gzipSync(match[1]).length,
      });
  }
  results.push({ route: route || "home", sceneScripts });
}
writeFileSync(
  `${import.meta.dirname}/qa/integration-assets.json`,
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
