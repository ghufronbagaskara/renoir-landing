// Register overlay handlers before opening a search from ?q.
import "./site";
import { searchCatalog, type SearchEntry } from "../lib/search-catalog";
// Header search overlay backed by Pagefind. The index (/pagefind/) is generated at build time and only
// downloaded when the visitor starts searching.
interface PagefindResult {
  data: () => Promise<{ url: string; excerpt: string; meta: { title?: string } }>;
}
interface Pagefind {
  search: (term: string) => Promise<{ results: PagefindResult[] }>;
}

const overlay = document.getElementById("site-search");
const form = overlay?.querySelector<HTMLFormElement>("[data-search-form]");
const input = form?.querySelector<HTMLInputElement>("input[name=q]");
const list = overlay?.querySelector<HTMLUListElement>("[data-search-results]");
const defaults = overlay?.querySelector<HTMLElement>("[data-search-default]");

let pagefind: Promise<Pagefind | null> | undefined;
const load = () =>
  (pagefind ??= (import(/* @vite-ignore */ `${location.origin}/pagefind/pagefind.js`) as Promise<Pagefind>).catch(() => null));

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

let catalog: Promise<SearchEntry[]> | undefined;
async function find(term: string) {
  const pf = await load();
  if (pf) {
    try {
      const { results } = await pf.search(term);
      return await Promise.all(results.slice(0, 50).map(result => result.data()));
    } catch { /* Use the content catalog if the full-text index cannot load. */ }
  }
  catalog ??= fetch("/search-index.json").then(response => {
    if (!response.ok) throw new Error("Search catalog unavailable");
    return response.json() as Promise<SearchEntry[]>;
  }).catch(error => { catalog = undefined; throw error; });
  return searchCatalog(await catalog, term, overlay?.dataset.locale ?? "en");
}
let seq = 0;
async function run(term: string) {
  if (!list) return;
  const id = ++seq;
  if (!term.trim()) {
    list.innerHTML = "";
    list.hidden = true;
    if (defaults) defaults.hidden = false;
    list.removeAttribute("aria-busy");
    return;
  }
  list.setAttribute("aria-busy", "true");
  list.hidden = false;
  if (defaults) defaults.hidden = true;
  list.innerHTML = `<li><p>${escapeHtml(overlay!.dataset.loading ?? "")}</p></li>`;
  try {
    const data = await find(term.trim());
    if (id !== seq) return;
    const locale = overlay!.dataset.locale ?? "en";
    const labels = JSON.parse(overlay!.dataset.groups ?? "{}") as Record<string, string>;
    const grouped = new Map<string, typeof data>();
    for (const result of data) {
      const pathname = new URL(result.url, location.origin).pathname;
      if (pathname.startsWith("/team/")) continue;
      if ((locale === "id") !== pathname.startsWith("/id/")) continue;
      const kind = /\/(services|layanan)\//.test(pathname) ? "service" : /\/(notes|catatan)\//.test(pathname) ? "note" : /\/(portfolio|karya)\//.test(pathname) ? "work" : "page";
      grouped.set(kind, [...(grouped.get(kind) ?? []), result]);
    }
    const html = ["service", "note", "work", "page"].flatMap((kind) => {
      const items = grouped.get(kind)?.slice(0, 8) ?? [];
      if (!items.length) return [];
      return [
        `<li class="search-group-label">${escapeHtml(labels[kind] ?? kind)}</li>`,
        ...items.map((d) => `<li><a href="${escapeHtml(d.url)}">${escapeHtml(d.meta.title ?? d.url)}</a><p>${escapeHtml(d.excerpt.replace(/<[^>]+>/g, ""))}</p></li>`),
      ];
    }).join("");
    list.innerHTML = html || `<li><p>${escapeHtml((overlay!.dataset.noResults ?? "").replace("{term}", term))}</p></li>`;
  } catch {
    if (id === seq) list.innerHTML = `<li><p>${escapeHtml(overlay!.dataset.unavailable ?? "")}</p></li>`;
  } finally {
    if (id === seq) list.removeAttribute("aria-busy");
  }
}

if (overlay && form && input) {
  overlay.addEventListener("panel:open", () => void load());
  let timer: ReturnType<typeof setTimeout>;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => run(input.value), 150);
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    run(input.value);
  });

  overlay.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = [...overlay.querySelectorAll<HTMLAnchorElement>("[data-search-results]:not([hidden]) a")];
    if (!links.length) return;
    event.preventDefault();
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === "ArrowDown" ? (current + 1) % links.length : (current <= 0 ? links.length : current) - 1;
    links[next].focus();
  });

  // Blog sidebar search submits ?q=… — open the overlay with that query.
  const q = new URLSearchParams(location.search).get("q");
  if (q) {
    input.value = q;
    document.querySelector<HTMLElement>(".si-search-open-btn")?.click();
    run(q);
  }
}
