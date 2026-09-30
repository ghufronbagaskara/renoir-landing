import type { APIRoute } from "astro";
import { child, t } from "~/i18n";
import { getServices, serviceCopy } from "~/lib/content";
import { abs } from "~/lib/seo";

export const prerender = true;

// The facts an answer engine needs to describe Renoir accurately, as one Markdown document (English master).
export const GET: APIRoute = async () => {
  const c = t("en");
  const services = await getServices();
  const qa = (items: { question: string; answer: string }[]) => items.map((q) => `### ${q.question}\n\n${q.answer}`).join("\n\n");

  const body = `# Renoir — ${c.site.tagline}

${c.site.description}

Pronunciation: ren-WAHR. Location: Indonesia, working remotely worldwide. Languages: English, Indonesian.
Website: ${abs("/")}

## What Renoir does

${services
  .map((s) => {
    const x = serviceCopy(s, "en");
    return `### ${x.title}

${x.excerpt}

${x.intro.join("\n\n")}

${x.summary}

Included: ${x.lists.flat().join("; ")}.

More: ${abs(child("services", "en", x.slug))}

${qa(x.faq)}`;
  })
  .join("\n\n")}

## How a project runs

${c.process.steps.map((s, i) => `${i + 1}. **${s.title}** — ${s.body}`).join("\n")}

## How engagements are priced

${c.home.engagements.cards.map((card) => `- **${card.title}** — ${card.audience} ${card.priceLine} ${card.note.replace("/", "")}.`).join("\n")}

## Why clients choose Renoir

${c.home.why.rows.map((r) => `- **${r.title}** — ${r.body}`).join("\n")}

## Who Renoir is for

${c.about.fit.rows.map((r) => `- ${r.good ? "Good fit" : "Not a fit"}: ${r.text}`).join("\n")}

## Frequently asked questions

${qa(c.home.faq.items)}

## About the name

${c.about.name.cardBody}
`;
  return new Response(body, { headers: { "content-type": "text/markdown; charset=utf-8" } });
};
