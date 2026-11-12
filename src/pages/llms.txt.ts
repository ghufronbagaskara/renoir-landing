import type { APIRoute } from "astro";
import { child, path, t } from "~/i18n";
import { getNotes, getServices, noteSlug, serviceCopy } from "~/lib/content";
import { abs } from "~/lib/seo";
import { docs } from "~/content/trust";
import { quizCopy } from "~/content/quiz";

export const prerender = true;

// https://llmstxt.org — a plain summary of who Katalhys is and where the key pages are, for LLMs and agents.
export const GET: APIRoute = async () => {
  const en = t("en");
  const id = t("id");
  const services = await getServices();
  const notes = await getNotes("en");
  const body = `# Katalhys

> ${en.site.description}

Katalhys is an independent digital studio based in Indonesia and working remotely worldwide. One team designs, builds from scratch, deploys, and maintains marketing sites and custom internal business systems. Projects start with a written scope and a fixed price. Every project is handed over running, with documentation and full ownership of the code. Languages: English and Indonesian.

## Services

${services
  .map((s) => {
    const c = serviceCopy(s, "en");
    return `- [${c.title}](${abs(child("services", "en", c.slug))}): ${c.metaDescription}`;
  })
  .join("\n")}

## Company

- [About Katalhys](${abs(path("about", "en"))}): ${en.about.metaDescription}
- [Process](${abs(path("process", "en"))}): ${en.process.metaDescription}
- [How we work and bug fixing](${abs(path("howWeWork", "en"))}): ${docs.en.howWeWork.metaDescription}
- [Find your first step](${abs(path("start", "en"))}): ${quizCopy.en.metaDescription}
- [Start a project](${abs(path("contact", "en"))}): ${en.contact.metaDescription}
- [Privacy policy](${abs(path("privacy", "en"))}): ${docs.en.privacy.metaDescription}

## Notes

${notes.map((n) => `- [${n.data.title}](${abs(child("notes", "en", noteSlug(n)))}): ${n.data.description}`).join("\n")}

## Bahasa Indonesia

- [Beranda](${abs(path("home", "id"))}): ${id.home.metaDescription}
- [Layanan](${abs(path("services", "id"))}): ${id.services.metaDescription}
- [Proses](${abs(path("process", "id"))}): ${id.process.metaDescription}
- [Cara kerja](${abs(path("howWeWork", "id"))}): ${docs.id.howWeWork.metaDescription}
- [Temukan langkah awal](${abs(path("start", "id"))}): ${quizCopy.id.metaDescription}

## Optional

- [Full text for LLMs](${abs("/llms-full.txt")}): services, process, and FAQ in one Markdown file.
- [Sitemap](${abs("/sitemap.xml")})
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
