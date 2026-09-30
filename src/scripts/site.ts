// Shell behaviour shared by every page (replaces the template's jQuery main.js parts).

// Sticky header: toggle the template's sticky class once the page scrolls past 20px.
const header = document.querySelector<HTMLElement>("[data-sticky-class]");
if (header) {
  const cls = header.dataset.stickyClass!;
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:20px;height:1px;width:1px;pointer-events:none";
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => header.classList.toggle(cls, !e.isIntersecting)).observe(sentinel);
}

// Offcanvas + search overlay (template classes: .opened on panel + .body-overlay)
const main = document.getElementById("main");
const overlays = document.querySelectorAll<HTMLElement>(".body-overlay");
let lastTrigger: HTMLElement | null = null;

function open(panel: HTMLElement | null, trigger: HTMLElement) {
  if (!panel) return;
  lastTrigger = trigger;
  panel.classList.add("opened");
  if (panel instanceof HTMLDialogElement) {
    if (!panel.open) panel.showModal();
  } else {
    panel.inert = false;
    overlays.forEach((o) => o.classList.add("opened"));
  }
  trigger.setAttribute("aria-expanded", "true");
  if (main) main.inert = true;
  panel.querySelector<HTMLElement>(panel instanceof HTMLDialogElement ? "input" : "input, button, a")?.focus({ preventScroll: true });
  panel.dispatchEvent(new CustomEvent("panel:open"));
}

function closeAll() {
  document.querySelectorAll<HTMLElement>(".si-offcanvas-area.opened, .si-search-area.opened").forEach((p) => {
    p.classList.remove("opened");
    if (p instanceof HTMLDialogElement) {
      if (p.open) p.close();
    } else {
      p.inert = true;
    }
  });
  overlays.forEach((o) => o.classList.remove("opened"));
  document.querySelectorAll("[aria-expanded='true'][aria-controls]").forEach((b) => b.setAttribute("aria-expanded", "false"));
  if (main) main.inert = false;
  lastTrigger?.focus({ preventScroll: true });
  lastTrigger = null;
}

document.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;
  const opener = t.closest<HTMLElement>(".si-offcanvas-open-btn, .si-search-open-btn");
  if (opener) {
    open(document.getElementById(opener.getAttribute("aria-controls")!), opener);
    return;
  }
  if (t.closest(".si-offcanvas-close-btn, .si-search-close-btn, .body-overlay")) closeAll();
  if (t.matches("dialog.si-search-area")) closeAll();

  // Offcanvas submenu toggles
  const toggle = t.closest<HTMLElement>(".si-offcanvas-menu .si-menu-close, .si-offcanvas-menu li:has(> .submenu) > a:not([href])");
  if (toggle) {
    e.preventDefault();
    const li = toggle.parentElement!;
    const expanded = li.classList.toggle("active");
    li.querySelector(":scope > a")?.setAttribute("aria-expanded", String(expanded));
  }

  // Image lightbox (offcanvas gallery)
  const popup = t.closest<HTMLAnchorElement>("a.popup-image");
  if (popup) {
    e.preventDefault();
    lightbox(`<img src="${popup.href}" alt="">`);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lastTrigger) closeAll();
  // Keyboard open for desktop dropdown parents (role=button anchors)
  const t = e.target as HTMLElement;
  if ((e.key === "Enter" || e.key === " ") && t.matches("a[role='button']")) {
    e.preventDefault();
    t.click();
  }
});

// Minimal <dialog> lightbox, shared with the video popup.
export function lightbox(html: string) {
  const dlg = document.createElement("dialog");
  dlg.className = "si-lightbox";
  dlg.innerHTML = `<button class="si-lightbox-close" type="button" aria-label="Close">&times;</button>${html}`;
  dlg.addEventListener("close", () => dlg.remove());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || (e.target as HTMLElement).closest(".si-lightbox-close")) dlg.close();
  });
  document.body.append(dlg);
  dlg.showModal();
}
