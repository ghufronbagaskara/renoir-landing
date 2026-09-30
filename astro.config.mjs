import { defineConfig } from "astro/config";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name).replaceAll("\\", "/")])))).flat();
}

// All CSS is inlined per page (build.inlineStylesheets: "always") and then purged per page: each HTML
// file keeps only the selectors its own markup or the site's scripts use. No render-blocking stylesheet
// request, and a page never ships styles for the template's other pages (the template bundles all of
// Bootstrap plus every page's styles). Classes added at runtime must appear as strings in the JS
// bundles or be safelisted below.
const STYLE_TAG = /<style>([\s\S]*?)<\/style>/g;
const purgeUnusedCss = () => ({
  name: "purge-unused-css",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      const { PurgeCSS } = await import("purgecss");
      const files = await walk(fileURLToPath(dir));
      const scripts = files.filter((f) => /\.(js|mjs)$/.test(f));
      let before = 0;
      let after = 0;
      for (const file of files.filter((f) => f.endsWith(".html"))) {
        const html = await readFile(file, "utf8");
        const css = [...html.matchAll(STYLE_TAG)].map((m) => m[1]).join("\n");
        if (!css) continue;
        const [result] = await new PurgeCSS().purge({
          content: [{ raw: html.replace(STYLE_TAG, ""), extension: "html" }, ...scripts],
          css: [{ raw: css }],
          fontFace: false,
          keyframes: false,
          variables: false,
          safelist: {
            standard: [/^swiper/, /^is-/, /^has-/, /^show$/, /^collapsed$/, /^active$/, /^opened$/, /^with-blur$/],
            greedy: [/swiper/, /cf-turnstile/, /pagefind/, /form-status/, /si-lightbox/, /si-search-results/, /data-speed/],
          },
        });
        let first = true;
        // Replacer function: CSS may contain "$" sequences that a replacement string would interpret.
        const out = html.replace(STYLE_TAG, () => (first ? ((first = false), `<style>${result.css}</style>`) : ""));
        before += css.length;
        after += result.css.length;
        await writeFile(file, out);
      }
      logger.warn(`purged inline CSS ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB (all pages)`);
    },
  },
});

// Static full-text search index for the header search overlay (loaded on demand by src/scripts/search.ts).
const searchIndex = () => ({
  name: "pagefind-index",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      const pagefind = await import("pagefind");
      const root = fileURLToPath(dir);
      const { index } = await pagefind.createIndex({});
      if (!index) throw new Error("pagefind: could not create index");
      const { page_count } = await index.addDirectory({ path: root });
      await index.writeFiles({ outputPath: join(root, "pagefind") });
      await pagefind.close();
      logger.warn(`pagefind indexed ${page_count} pages`);
    },
  },
});

// No adapter here on purpose: Alchemy's Cloudflare.Website.Astro injects its own (see scripts/build.ts).
export default defineConfig({
  site: process.env.SITE_URL ?? "https://renoir.run",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "always" },
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  // Astro's content runner needs these CommonJS packages prebundled on Windows.
  vite: { environments: { astro: { optimizeDeps: { include: ["picomatch", "source-map-js"] } } } },
  integrations: [purgeUnusedCss(), searchIndex()],
});
