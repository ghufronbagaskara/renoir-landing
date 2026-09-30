import type { APIRoute } from "astro";
import { abs } from "~/lib/seo";

export const prerender = true;

// Search engines and AI crawlers are welcome: being cited by answer engines is part of the brief (GEO).
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /
Disallow: /api/
Content-Signal: search=yes, ai-input=yes, ai-train=no

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${abs("/sitemap.xml")}
`,
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
