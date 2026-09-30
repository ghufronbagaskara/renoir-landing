import en from "./en";
import id from "./id";

export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries = { en, id };
export const t = (locale: Locale) => dictionaries[locale];

/** BCP 47 tags for <html lang>, hreflang and structured data. */
export const langTag: Record<Locale, string> = { en: "en", id: "id" };
export const ogLocale: Record<Locale, string> = { en: "en_US", id: "id_ID" };

// Localized URL table.
const paths = {
  home: { en: "/", id: "/id/" },
  services: { en: "/services/", id: "/id/layanan/" },
  process: { en: "/process/", id: "/id/proses/" },
  about: { en: "/about/", id: "/id/tentang/" },
  notes: { en: "/notes/", id: "/id/catatan/" },
  contact: { en: "/contact/", id: "/id/kontak/" },
  work: { en: "/portfolio/", id: "/id/karya/" },
} as const;

export type RouteKey = keyof typeof paths;
export const path = (route: RouteKey, locale: Locale) => paths[route][locale];
/** Child URL under a localized section, e.g. child("services", "id", "situs-marketing"). */
export const child = (route: RouteKey, locale: Locale, slug: string) => `${paths[route][locale]}${slug}/`;

/** Alternate URLs for hreflang + the language switcher. Only locales that really have the page. */
export type Alternates = Partial<Record<Locale, string>>;
export const routeAlternates = (route: RouteKey): Alternates =>
  ({ en: paths[route].en, id: paths[route].id });

export const otherLocale = (locale: Locale): Locale => (locale === "en" ? "id" : "en");
