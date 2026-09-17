// Replaces Bootstrap's collapse plugin for the template accordions (one panel open at a time).
document.addEventListener("click", (e) => {
  const button = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-accordion] .accordion-buttons");
  if (!button) return;
  const root = button.closest("[data-accordion]")!;
  const opening = button.getAttribute("aria-expanded") !== "true";
  for (const b of root.querySelectorAll<HTMLButtonElement>(".accordion-buttons")) {
    const open = b === button && opening;
    b.setAttribute("aria-expanded", String(open));
    b.classList.toggle("collapsed", !open);
    document.getElementById(b.getAttribute("aria-controls")!)?.classList.toggle("show", open);
  }
});
