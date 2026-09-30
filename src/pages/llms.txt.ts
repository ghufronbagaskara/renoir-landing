import type { APIRoute } from "astro";
import { child, path, t } from "~/i18n";
import { getNotes, getServices, noteSlug, serviceCopy } from "~/lib/content";
import { abs } from "~/lib/seo";

export const prerender = true;

// https://llmstxt.org — a plain summary of who Renoir is and where the key pages are, for LLMs and agents.
export const GET: APIRoute = async () => {
  const en = t("en");
  const id = t("id");
  const services = await getServices();
  const notes = await getNotes("en");
  const body = `# Renoir

> ${en.site.description}

Renoir (pronounced ren-WAHR) is an independent digital studio based in Indonesia and working remotely worldwide. One team designs, builds from scratch, deploys, and maintains marketing sites and custom internal business systems. Projects start with a written scope and a fixed price. Every project is handed over running, with documentation and full ownership of the code. Languages: English and Indonesian.

## Services

${services
  .map((s) => {
    const c = serviceCopy(s, "en");
    return `- [${c.title}](${abs(child("services", "en", c.slug))}): ${c.metaDescription}`;
  })
  .join("\n")}

## Company

- [About Renoir](${abs(path("about", "en"))}): ${en.about.metaDescription}
- [Process](${abs(path("process", "en"))}): ${en.process.metaDescription}
- [Start a project](${abs(path("contact", "en"))}): ${en.contact.metaDescription}

## Notes

${notes.map((n) => `- [${n.data.title}](${abs(child("notes", "en", noteSlug(n)))}): ${n.data.description}`).join("\n")}

## Bahasa Indonesia

- [Beranda](${abs(path("home", "id"))}): ${id.home.metaDescription}
- [Layanan](${abs(path("services", "id"))}): ${id.services.metaDescription}
- [Proses](${abs(path("process", "id"))}): ${id.process.metaDescription}

## Optional

- [Full text for LLMs](${abs("/llms-full.txt")}): services, process, and FAQ in one Markdown file.
- [Sitemap](${abs("/sitemap.xml")})
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
