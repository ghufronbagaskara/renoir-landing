import { initHomeTabs } from "./home-tabs";

const root = document.getElementById("selected-work");
if (root) {
  const compact = matchMedia("(max-width: 767px)");
  const extras = [...root.querySelectorAll<HTMLDetailsElement>(".home-project-extra")];
  const setDetails = () => extras.forEach((detail) => { detail.open = !compact.matches; });
  setDetails();
  compact.addEventListener("change", setDetails);
  initHomeTabs(root);
  const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-tab]")];
  const panels = [...root.querySelectorAll<HTMLElement>("[data-tab-panel]")];
  const toggle = root.querySelector<HTMLButtonElement>("[data-project-rotation]")!;
  const controls = root.querySelector<HTMLElement>(".home-project-controls")!;
  const tablist = root.querySelector<HTMLElement>("[data-tab-controls]")!;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false, paused = motion.matches, hovered = false, timer = 0;
  let active = 0;
  const warmed = new Set<number>();
  let transitions: Animation[] = [];
  const warm = () => {
    if (!visible) return;
    for (const index of [active, (active + 1) % panels.length]) {
      if (warmed.has(index)) continue;
      warmed.add(index);
      const image = panels[index].querySelector<HTMLImageElement>(".home-project-visual img")!;
      image.loading = "eager";
      void image.decode().catch(() => {});
    }
  };

  const sync = () => {
    clearTimeout(timer);
    toggle.setAttribute("aria-label", (paused ? toggle.dataset.resume : toggle.dataset.pause)!);
    toggle.firstElementChild!.textContent = paused ? "▶" : "Ⅱ";
    if (visible && !paused && !hovered && !document.hidden && (!root.contains(document.activeElement) || document.activeElement === toggle)) {
      timer = window.setTimeout(() => {
        const current = tabs.findIndex(tab => tab.getAttribute("aria-selected") === "true");
        tabs[(current + 1) % tabs.length].click();
      }, 4000);
    }
  };

  const change = (event: Event) => {
    const next = (event as CustomEvent<{ index: number }>).detail.index;
    if (compact.matches) extras.forEach((detail) => { detail.open = false; });
    panels.forEach((panel, index) => {
      panel.inert = index !== next;
      panel.setAttribute("aria-hidden", String(index !== next));
      panel.style.zIndex = index === next ? "2" : "0";
    });
    if (next !== active) {
      const outgoing = panels[active];
      const incoming = panels[next];
      const opacity = getComputedStyle(outgoing).opacity;
      transitions.forEach(animation => animation.cancel());
      if (!motion.matches) {
        outgoing.style.zIndex = "1";
        const options = { duration: 500, easing: "cubic-bezier(.4, 0, .2, 1)" };
        // Keep the old panel painted beneath the incoming white panel until it covers it.
        const animations = [
          outgoing.animate([{ opacity, visibility: "visible" }, { opacity, visibility: "visible" }], options),
          incoming.animate([{ opacity: 0 }, { opacity: 1 }], options),
        ];
        transitions = animations;
        void Promise.all(animations.map(animation => animation.finished))
          .then(() => animations.forEach(animation => animation.cancel()))
          .catch(() => {});
      }
      active = next;
    }
    warm();
    const bounds = tablist.getBoundingClientRect();
    const tab = tabs[next].getBoundingClientRect();
    const offset = tab.width > bounds.width || tab.left < bounds.left ? tab.left - bounds.left : tab.right > bounds.right ? tab.right - bounds.right : 0;
    if (offset) tablist.scrollBy({ left: offset, behavior: motion.matches ? "auto" : "smooth" });
    sync();
  };

  panels.forEach((panel, index) => {
    panel.inert = index !== active;
    panel.setAttribute("aria-hidden", String(index !== active));
  });
  toggle.hidden = false;
  toggle.addEventListener("click", () => { paused = !paused; sync(); });
  root.addEventListener("tabs:change", change);
  controls.addEventListener("mouseenter", () => { hovered = true; sync(); });
  controls.addEventListener("mouseleave", () => { hovered = false; sync(); });
  root.addEventListener("focusin", sync);
  root.addEventListener("focusout", () => queueMicrotask(sync));
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", () => {
    paused = motion.matches;
    transitions.forEach(animation => animation.cancel());
    sync();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .2;
    warm();
    sync();
  }, { threshold: .2 }).observe(root);
  sync();
}
