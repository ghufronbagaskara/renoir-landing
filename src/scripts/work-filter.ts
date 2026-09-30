const catalogs = document.querySelectorAll<HTMLElement>("[data-work-catalog]");

for (const catalog of catalogs) {
  const input = catalog.querySelector<HTMLInputElement>("[data-work-search] input[name=q]");
  const form = catalog.querySelector<HTMLFormElement>("[data-work-search]");
  const buttons = [...catalog.querySelectorAll<HTMLButtonElement>("[data-work-service]")];
  const cards = [...catalog.querySelectorAll<HTMLElement>("[data-work-card]")];
  const count = catalog.querySelector<HTMLElement>("[data-work-count]");
  const empty = catalog.querySelector<HTMLElement>("[data-work-empty]");
  const clear = catalog.querySelector<HTMLButtonElement>("[data-work-clear]");
  const resultTemplate = catalog.dataset.resultsTemplate ?? "{count}";
  let typingTimer: ReturnType<typeof setTimeout>;

  const readUrl = () => {
    const params = new URLSearchParams(location.search);
    return { q: params.get("q") ?? "", service: params.get("service") ?? "" };
  };

  const render = (q: string, service: string, history: "none" | "replace" | "push" = "none") => {
    const query = q.trim().toLocaleLowerCase(document.documentElement.lang);
    let visible = 0;
    for (const card of cards) {
      const services = (card.dataset.services ?? "").split(" ");
      const matches = (!query || (card.dataset.search ?? "").includes(query)) && (!service || services.includes(service));
      card.hidden = !matches;
      if (matches) card.dataset.layout = visible++ % 3 === 2 ? "wide" : "half";
    }
    if (input && input.value !== q) input.value = q;
    for (const button of buttons) {
      const active = (button.dataset.workService ?? "") === service;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    }
    if (count) count.textContent = resultTemplate.replace("{count}", String(visible));
    if (empty) empty.hidden = visible !== 0;

    if (history !== "none") {
      const url = new URL(location.href);
      q.trim() ? url.searchParams.set("q", q.trim()) : url.searchParams.delete("q");
      service ? url.searchParams.set("service", service) : url.searchParams.delete("service");
      window.history[history === "push" ? "pushState" : "replaceState"]({}, "", url);
    }
  };

  const initial = readUrl();
  render(initial.q, initial.service);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const state = readUrl();
    render(input?.value ?? "", state.service, "replace");
  });
  input?.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => render(input.value, readUrl().service, "replace"), 150);
  });
  buttons.forEach((button) => button.addEventListener("click", () => render(input?.value ?? "", button.dataset.workService ?? "", "push")));
  clear?.addEventListener("click", () => render("", "", "push"));
  window.addEventListener("popstate", () => {
    const state = readUrl();
    render(state.q, state.service);
  });
}
