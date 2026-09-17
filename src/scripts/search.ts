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

let pagefind: Promise<Pagefind | null> | undefined;
const load = () =>
  (pagefind ??= (import(/* @vite-ignore */ `${location.origin}/pagefind/pagefind.js`) as Promise<Pagefind>).catch(() => null));

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

let seq = 0;
async function run(term: string) {
  if (!list) return;
  const id = ++seq;
  if (!term.trim()) {
    list.innerHTML = "";
    return;
  }
  const pf = await load();
  if (!pf) {
    list.innerHTML = "<li><p>Search is available on the deployed site.</p></li>";
    return;
  }
  const { results } = await pf.search(term);
  const data = await Promise.all(results.slice(0, 8).map((r: PagefindResult) => r.data()));
  if (id !== seq) return; // a newer query won
  list.innerHTML = data.length
    ? data
        .map((d) => `<li><a href="${escapeHtml(d.url)}">${escapeHtml(d.meta.title ?? d.url)}</a><p>${d.excerpt}</p></li>`)
        .join("")
    : `<li><p>No results for “${escapeHtml(term)}”.</p></li>`;
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
    run(input.value);
  });

  // Blog sidebar search submits ?q=… — open the overlay with that query.
  const q = new URLSearchParams(location.search).get("q");
  if (q) {
    input.value = q;
    document.querySelector<HTMLElement>(".si-search-open-btn")?.click();
    run(q);
  }
}
