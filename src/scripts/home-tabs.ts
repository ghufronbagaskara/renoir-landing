export function initHomeTabs(root: HTMLElement) {
  if (root.dataset.tabsReady) return;
  const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-tab]")];
  const panels = [...root.querySelectorAll<HTMLElement>("[data-tab-panel]")];
  const controls = root.querySelector<HTMLElement>("[data-tab-controls]");
  if (!controls || !tabs.length || tabs.length !== panels.length) return;
  const select = (index: number) => {
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    root.dispatchEvent(new CustomEvent("tabs:change", { detail: { index } }));
  };
  controls.hidden = false;
  controls.setAttribute("role", "tablist");
  const desktop = matchMedia("(min-width: 768px)");
  const orientation = () => controls.setAttribute("aria-orientation", root.matches("[data-works-wheel]") && desktop.matches ? "vertical" : "horizontal");
  orientation();
  desktop.addEventListener("change", orientation);
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panels[index].id);
    panels[index].setAttribute("role", "tabpanel");
    panels[index].setAttribute("aria-labelledby", tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
      select(next);
      tabs[next].focus({ preventScroll: true });
      tabs[next].scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  });
  root.dataset.tabsReady = "true";
  root.classList.add("is-enhanced");
  select(0);
}
