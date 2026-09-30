import type { APIRoute } from "astro";
import { abs } from "~/lib/seo";
import { allUrls } from "~/lib/urls";

export const prerender = true;

// One <url> per language version, each listing all alternates (Google's recommended hreflang sitemap form).
export const GET: APIRoute = async () => {
  const entries = (await allUrls()).flatMap(({ alternates }) => {
    const links = Object.entries(alternates)
      .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${abs(href!)}"/>`)
      .concat(alternates.en ? [`    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(alternates.en)}"/>`] : [])
      .join("\n");
    return Object.values(alternates).map((href) => `  <url>\n    <loc>${abs(href!)}</loc>\n${links}\n  </url>`);
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
};
