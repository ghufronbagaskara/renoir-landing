export interface SearchEntry { locale: string; url: string; title: string; excerpt: string; text: string }
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function searchCatalog(entries: SearchEntry[], term: string, locale: string) {
  const words = normalize(term).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return entries.filter(entry => entry.locale === locale).map(entry => {
    const title = normalize(entry.title), text = normalize(entry.title + " " + entry.text);
    return { entry, score: words.every(word => text.includes(word)) ? 1 + words.filter(word => title.includes(word)).length * 3 : 0 };
  }).filter(result => result.score > 0).sort((a, b) => b.score - a.score).map(({ entry }) => ({
    url: entry.url, excerpt: entry.excerpt, meta: { title: entry.title },
  }));
}
