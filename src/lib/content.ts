import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "~/i18n";

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export const getServices = async () => (await getCollection("services")).sort(byOrder);
export const serviceCopy = (entry: CollectionEntry<"services">, locale: Locale) =>
  locale === "en" ? entry.data.en : entry.data.id_;

export const getPortfolio = async () => (await getCollection("portfolio")).sort(byOrder);
export const portfolioCopy = (entry: CollectionEntry<"portfolio">, locale: Locale) =>
  locale === "en" ? entry.data.en : entry.data.id_;

export const noteLocale = (entry: CollectionEntry<"notes">) => entry.id.split("/")[0] as Locale;
export const noteSlug = (entry: CollectionEntry<"notes">) => entry.id.split("/").slice(1).join("/");
export const getNotes = async (locale: Locale) =>
  (await getCollection("notes", (n) => noteLocale(n) === locale)).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
/** The same note in the other language, if it exists. */
export const getNoteTranslation = async (entry: CollectionEntry<"notes">, locale: Locale) =>
  (await getNotes(locale)).find((n) => n.data.translationKey === entry.data.translationKey);

const MONTHS: Record<Locale, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  id: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
};

/** "September 10, 2026" (EN) / "10 September 2026" (ID). */
export function formatDate(d: Date, locale: Locale) {
  const day = d.getUTCDate();
  const month = MONTHS[locale][d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return locale === "en" ? `${month} ${day}, ${year}` : `${day} ${month} ${year}`;
}
