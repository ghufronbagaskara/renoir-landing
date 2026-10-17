import { child, locales, path, t } from "~/i18n";
import { getNotes, getPortfolio, getServices, noteSlug, portfolioCopy, serviceCopy } from "~/lib/content";
import type { SearchEntry } from "~/lib/search-catalog";
export const prerender = true;
export async function GET() {
  const [services, projects] = await Promise.all([getServices(), getPortfolio()]);
  const entries: SearchEntry[] = [];
  for (const locale of locales) {
    const c = t(locale);
    const pages = { home: c.home, services: c.services, work: c.work, notes: c.notes, contact: c.contact, process: c.process, about: c.about };
    for (const route of Object.keys(pages) as (keyof typeof pages)[]) {
      entries.push({ locale, url: path(route, locale), title: route === "contact" ? c.nav.cta : c.nav[route], excerpt: c.site.description, text: JSON.stringify(pages[route]) });
    }
    for (const service of services) {
      const copy = serviceCopy(service, locale);
      entries.push({ locale, url: child("services", locale, copy.slug), title: copy.title, excerpt: copy.excerpt, text: JSON.stringify(copy) });
    }
    for (const project of projects) {
      const copy = portfolioCopy(project, locale);
      entries.push({ locale, url: child("work", locale, project.id), title: copy.title, excerpt: copy.overview, text: JSON.stringify([copy, project.data.features.map(feature => locale === "en" ? feature.en : feature.id_)]) });
    }
    for (const note of await getNotes(locale)) {
      entries.push({ locale, url: child("notes", locale, noteSlug(note)), title: note.data.title, excerpt: note.data.description, text: note.data.category + " " + (note.body ?? "") });
    }
  }
  return Response.json(entries);
}
