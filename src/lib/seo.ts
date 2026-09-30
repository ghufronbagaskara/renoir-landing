// JSON-LD graph builders. Every page emits one @graph: Organization + WebSite + WebPage (+ breadcrumb,
// services, FAQ, article when relevant), linked by @id so search and answer engines see one entity.
import { site } from "~/data/site";
import { langTag, path, t, type Locale } from "~/i18n";

export type JsonLd = Record<string, unknown>;

export const abs = (pathname: string) => new URL(pathname, site.url).href;
const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

export function organization(locale: Locale): JsonLd {
  const c = t(locale);
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: site.name,
    url: abs("/"),
    description: c.site.description,
    slogan: c.site.tagline,
    areaServed: [{ "@type": "Country", name: "Indonesia" }, "Worldwide"],
    knowsLanguage: ["en", "id"],
    knowsAbout: ["UI/UX design", "Visual identity", "Marketing websites", "Custom internal business software", "Web infrastructure and deployment"],
    sameAs: [],
  };
}

export function website(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: abs("/"),
    name: site.name,
    inLanguage: ["en", "id"],
    publisher: { "@id": ORG_ID },
  };
}

export interface PageMeta {
  locale: Locale;
  url: string;
  title: string;
  description: string;
  breadcrumb?: { name: string; url: string }[];
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";
}

export function webPage(p: PageMeta): JsonLd[] {
  const pageId = `${abs(p.url)}#webpage`;
  const nodes: JsonLd[] = [
    {
      "@type": p.type ?? "WebPage",
      "@id": pageId,
      url: abs(p.url),
      name: p.title,
      description: p.description,
      inLanguage: langTag[p.locale],
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
      ...(p.breadcrumb && { breadcrumb: { "@id": `${abs(p.url)}#breadcrumb` } }),
    },
  ];
  if (p.breadcrumb) {
    const home = { name: t(p.locale).nav.home, url: path("home", p.locale) };
    nodes.push({
      "@type": "BreadcrumbList",
      "@id": `${abs(p.url)}#breadcrumb`,
      itemListElement: [home, ...p.breadcrumb].map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: abs(b.url),
      })),
    });
  }
  return nodes;
}

export const serviceNode = (s: { name: string; description: string; url: string; locale: Locale }): JsonLd => ({
  "@type": "Service",
  "@id": `${abs(s.url)}#service`,
  name: s.name,
  description: s.description,
  url: abs(s.url),
  inLanguage: langTag[s.locale],
  provider: { "@id": ORG_ID },
  areaServed: [{ "@type": "Country", name: "Indonesia" }, "Worldwide"],
});

export const faqNode = (url: string, items: { question: string; answer: string }[]): JsonLd => ({
  "@type": "FAQPage",
  "@id": `${abs(url)}#faq`,
  mainEntity: items.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: { "@type": "Answer", text: q.answer },
  })),
});

export const articleNode = (a: {
  url: string;
  title: string;
  description: string;
  date: Date;
  image: string;
  locale: Locale;
}): JsonLd => ({
  "@type": "Article",
  "@id": `${abs(a.url)}#article`,
  headline: a.title,
  description: a.description,
  datePublished: a.date.toISOString(),
  dateModified: a.date.toISOString(),
  inLanguage: langTag[a.locale],
  image: abs(a.image),
  author: { "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
  mainEntityOfPage: { "@id": `${abs(a.url)}#webpage` },
});

export const graph = (nodes: JsonLd[]) => ({ "@context": "https://schema.org", "@graph": nodes });
