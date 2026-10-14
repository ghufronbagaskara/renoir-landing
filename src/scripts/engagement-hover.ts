import { revealPanel } from "./disclosure-motion";
for (const root of document.querySelectorAll<HTMLElement>("[data-hover-engagements]")) {
  const items = [...root.querySelectorAll<HTMLDetailsElement>(".engagement-item")];
  const states = new Map(items.map((item) => [item, item.open]));
  const select = (item: HTMLDetailsElement, opening: boolean) => {
    for (const [index, candidate] of items.entries()) {
      const open = candidate === item && opening;
      if (states.get(candidate) !== open) {
        states.set(candidate, open);
        const panel = candidate.querySelector<HTMLElement>(".engagement-panel")!;
        if (open) candidate.open = true;
        revealPanel(panel, open, () => { candidate.open = open; });
      }
      if (opening) root.querySelector<HTMLElement>(`[data-engagement-proof="${index}"]`)!.hidden = !open;
    }
  };
  for (const item of items) {
    item.querySelector("summary")!.addEventListener("click", (event) => {
      event.preventDefault();
      select(item, !states.get(item));
    });
    item.querySelector("summary")!.addEventListener("pointermove", () => {
      if (matchMedia("(hover: hover) and (pointer: fine)").matches && !items.some((other) => other !== item && other.contains(document.activeElement))) select(item, true);
    });
  }
}
