// Every indexable URL with its language alternates. Feeds sitemap.xml and llms.txt.
import { child, locales, routeAlternates, type Alternates, type RouteKey } from "~/i18n";
import { getNotes, getPortfolio, getServices, noteSlug } from "~/lib/content";

export interface SiteUrl {
  alternates: Alternates;
}

export async function allUrls(): Promise<SiteUrl[]> {
  const urls: SiteUrl[] = [];
  const localized: RouteKey[] = ["home", "services", "process", "about", "notes", "work", "contact"];
  for (const route of localized) urls.push({ alternates: routeAlternates(route) });

  for (const entry of await getServices()) {
    urls.push({ alternates: { en: child("services", "en", entry.data.en.slug), id: child("services", "id", entry.data.id_.slug) } });
  }

  const [en, id] = await Promise.all(locales.map((l) => getNotes(l)));
  for (const note of en) {
    const translation = id.find((n) => n.data.translationKey === note.data.translationKey);
    urls.push({ alternates: { en: child("notes", "en", noteSlug(note)), ...(translation && { id: child("notes", "id", noteSlug(translation)) }) } });
  }
  for (const note of id.filter((n) => !en.some((e) => e.data.translationKey === n.data.translationKey))) {
    urls.push({ alternates: { id: child("notes", "id", noteSlug(note)) } });
  }

  for (const project of await getPortfolio()) {
    urls.push({ alternates: { en: child("work", "en", project.id), id: child("work", "id", project.id) } });
  }
  return urls;
}
