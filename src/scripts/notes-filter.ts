for (const catalog of document.querySelectorAll<HTMLElement>("[data-notes-catalog]")) {
  const form = catalog.querySelector<HTMLFormElement>("[data-sidebar-search]");
  const input = catalog.querySelector<HTMLInputElement>("[data-notes-search-input]");
  const links = [...catalog.querySelectorAll<HTMLAnchorElement>("[data-notes-category]")];
  const cards = [...catalog.querySelectorAll<HTMLElement>("[data-note-card]")];
  const summary = catalog.querySelector<HTMLElement>("[data-notes-summary]");
  const empty = catalog.querySelector<HTMLElement>("[data-notes-empty]");
  const clear = catalog.querySelector<HTMLButtonElement>("[data-notes-clear]");
  const template = catalog.dataset.resultsTemplate ?? "{count}";
  let timer: ReturnType<typeof setTimeout>;

  const state = () => {
    const params = new URLSearchParams(location.search);
    return { q: params.get("q") ?? "", category: params.get("category") ?? "" };
  };
  const render = (q: string, category: string, history: "none" | "replace" | "push" = "none") => {
    const query = q.trim().toLocaleLowerCase(document.documentElement.lang);
    let visible = 0;
    cards.forEach((card) => {
      const matches = (!query || (card.dataset.search ?? "").includes(query)) && (!category || card.dataset.category === category);
      card.hidden = !matches;
      if (matches) visible++;
    });
    if (input && input.value !== q) input.value = q;
    links.forEach((link) => {
      const active = link.dataset.notesCategory === category;
      link.classList.toggle("is-active", active);
      active ? link.setAttribute("aria-current", "true") : link.removeAttribute("aria-current");
    });
    if (summary) summary.textContent = template.replace("{count}", String(visible));
    if (empty) empty.hidden = visible !== 0;
    if (history !== "none") {
      const url = new URL(location.href);
      q.trim() ? url.searchParams.set("q", q.trim()) : url.searchParams.delete("q");
      category ? url.searchParams.set("category", category) : url.searchParams.delete("category");
      window.history[history === "push" ? "pushState" : "replaceState"]({}, "", url);
    }
  };

  const initial = state();
  render(initial.q, initial.category);
  form?.addEventListener("submit", (event) => { event.preventDefault(); render(input?.value ?? "", state().category, "replace"); });
  input?.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => render(input.value, state().category, "replace"), 150); });
  links.forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); const next = link.dataset.notesCategory === state().category ? "" : link.dataset.notesCategory ?? ""; render(input?.value ?? "", next, "push"); }));
  clear?.addEventListener("click", () => render("", "", "push"));
  window.addEventListener("popstate", () => { const next = state(); render(next.q, next.category); });
}
