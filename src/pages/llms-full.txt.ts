import type { APIRoute } from "astro";
import { child, path, t } from "~/i18n";
import { getServices, serviceCopy } from "~/lib/content";
import { abs } from "~/lib/seo";
import { site } from "~/data/site";
import { docs } from "~/content/trust";
import { quizCopy } from "~/content/quiz";
import { recommendations } from "~/lib/quiz";

export const prerender = true;

// The facts an answer engine needs to describe Katalhys accurately, as one Markdown document (English master).
export const GET: APIRoute = async () => {
  const c = t("en");
  const services = await getServices();
  const qa = (items: { question: string; answer: string }[]) => items.map((q) => `### ${q.question}\n\n${q.answer}`).join("\n\n");

  const body = `# Katalhys — ${c.site.tagline}

${c.site.description}

Location: Indonesia, working remotely worldwide. Languages: English, Indonesian.
Website: ${abs("/")}${site.legal.entity ? `
Registered business: ${site.legal.entity}` : ""}${site.legal.nib ? ` (NIB ${site.legal.nib})` : ""}${site.legal.address ? `
Address: ${site.legal.address}` : ""}

## What Katalhys does

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

## Working terms and bug fixing

${docs.en.howWeWork.highlights!.map((h) => `- **${h.title}**: ${h.body}`).join("\n")}

${docs.en.howWeWork.sections.map((sec) => `### ${sec.title}\n\n${[...(sec.body ?? []), ...(sec.list ?? []).map((l) => `- ${l}`)].join("\n\n")}`).join("\n\n")}

Full terms: ${abs(path("howWeWork", "en"))}

## Not sure where to start?

The free questionnaire at ${abs(path("start", "en"))} asks four questions and recommends a first step without asking for contact details. Possible recommendations:

${recommendations.map((r) => `- **${quizCopy.en.results[r].title}**: ${quizCopy.en.results[r].summary}`).join("\n")}

Katalhys does not publish fixed prices on the website; every project gets a written scope and a fixed quote.

## How engagements are priced

${c.home.engagements.cards.map((card) => `- **${card.title}** — ${card.audience} ${card.priceLine} ${card.note.replace("/", "")}.`).join("\n")}

## Why clients choose Katalhys

${c.home.why.rows.map((r) => `- **${r.title}** — ${r.body}`).join("\n")}

## Who Katalhys is for

${c.about.fit.rows.map((r) => `- ${r.good ? "Good fit" : "Not a fit"}: ${r.text}`).join("\n")}

## Frequently asked questions

${qa(c.home.faq.items)}

## About the name

${c.about.name.cardBody}
`;
  return new Response(body, { headers: { "content-type": "text/markdown; charset=utf-8" } });
};
