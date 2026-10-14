import { revealPanel } from "./disclosure-motion";
function select(button: HTMLButtonElement, opening: boolean) {
  const root = button.closest<HTMLElement>("[data-accordion]")!;
  for (const b of root.querySelectorAll<HTMLButtonElement>(".accordion-buttons")) {
    const open = b === button && opening;
    const panel = document.getElementById(b.getAttribute("aria-controls")!)!;
    const changed = b.getAttribute("aria-expanded") !== String(open);
    b.setAttribute("aria-expanded", String(open));
    b.classList.toggle("collapsed", !open);
    if (root.hasAttribute("data-hover-accordion") && changed) {
      panel.classList.add("show");
      revealPanel(panel, open, () => panel.classList.toggle("show", open));
    } else if (!root.hasAttribute("data-hover-accordion")) panel.classList.toggle("show", open);
  }
}
document.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-accordion] .accordion-buttons");
  if (button) select(button, button.getAttribute("aria-expanded") !== "true");
});
for (const root of document.querySelectorAll<HTMLElement>("[data-hover-accordion]")) {
  for (const panel of root.querySelectorAll<HTMLElement>(".accordion-collapse")) panel.style.removeProperty("display");
  for (const item of root.querySelectorAll<HTMLElement>(".accordion-items")) {
    item.querySelector("button")!.addEventListener("pointermove", () => {
      if (matchMedia("(hover: hover) and (pointer: fine)").matches && !root.querySelector(".accordion-buttons:focus")) select(item.querySelector<HTMLButtonElement>("button")!, true);
    });
  }
}
