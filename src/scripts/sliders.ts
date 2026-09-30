// Swiper sliders from the template's slider-active.js. Swiper is imported lazily so pages
// without sliders ship none of it; only the modules actually used are bundled.
import "swiper/css";
import "swiper/css/scrollbar";

// The template's arrow markup is swapped (".si-button-next" holds the left arrow), so the
// selectors are mapped by what the user sees: left arrow = previous.
const configs = {
  ".si-project": (section: Element) => ({
    slidesPerView: 1,
    spaceBetween: 22,
    speed: 550,
    loop: true,
    navigation: { prevEl: section.querySelector<HTMLElement>(".si-button-next"), nextEl: section.querySelector<HTMLElement>(".si-button-prev") },
    breakpoints: { 768: { slidesPerView: 2 }, 1280: { slidesPerView: 3 } },
  }),
  ".card-testimonial": (section: Element) => ({
    slidesPerView: 1,
    spaceBetween: 30,
    scrollbar: { el: section.querySelector<HTMLElement>(".si-swiper-scrollbar"), draggable: true },
  }),
  ".swiper-testimonial-3": (section: Element) => ({
    spaceBetween: 30,
    loop: true,
    slidesPerView: 1,
    navigation: { prevEl: section.querySelector<HTMLElement>(".si-button-next"), nextEl: section.querySelector<HTMLElement>(".si-button-prev") },
    breakpoints: { 1400: { slidesPerView: 2 } },
  }),
};

let started = false;
export async function initSliders() {
  if (started) return;
  started = true;
  const targets = Object.entries(configs).flatMap(([sel, config]) =>
    [...document.querySelectorAll<HTMLElement>(sel)].map((el) => ({ el, config })),
  );
  if (!targets.length) return;

  // Initialise each slider when it comes within one viewport of the screen, so Swiper never competes
  // with first paint. Slides are already laid out by CSS before that.
  const io = new IntersectionObserver(
    async (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (!visible.length) return;
      const { Swiper, Navigation, Scrollbar, A11y, Autoplay } = await import("./swiper-bundle");
      for (const { target } of visible) {
        io.unobserve(target);
        const { el, config } = targets.find((t) => t.el === target)!;
        const section = el.closest("section") ?? document.body;
        const project = el.matches(".si-project");
        const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const swiper = new Swiper(el, {
          modules: [Navigation, Scrollbar, A11y, Autoplay],
          ...config(section),
          ...(project && !reducedMotion && { autoplay: { delay: 5000, disableOnInteraction: false } }),
        });
        if (project && !reducedMotion) {
          const rotation = section.querySelector<HTMLButtonElement>("[data-work-rotation]");
          if (!rotation) continue;
          let inView = false;
          let hovered = false;
          let manuallyPaused = false;
          let focusStopped = false;
          const icon = rotation.querySelector("span");
          const sync = () => {
            const playing = inView && !hovered && !manuallyPaused && !focusStopped && document.visibilityState === "visible";
            if (playing) swiper.autoplay.start();
            else swiper.autoplay.stop();
            const stoppedByUser = manuallyPaused || focusStopped;
            rotation.setAttribute("aria-label", stoppedByUser ? rotation.dataset.resumeLabel! : rotation.dataset.pauseLabel!);
            if (icon) icon.textContent = stoppedByUser ? "▶" : "Ⅱ";
          };
          swiper.autoplay.stop();
          new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0.2 }).observe(el);
          section.addEventListener("mouseenter", () => { hovered = true; sync(); });
          section.addEventListener("mouseleave", () => { hovered = false; sync(); });
          section.addEventListener("focusin", () => { focusStopped = true; sync(); });
          rotation.addEventListener("click", () => {
            const stoppedByUser = manuallyPaused || focusStopped;
            manuallyPaused = !stoppedByUser;
            focusStopped = false;
            sync();
          });
          document.addEventListener("visibilitychange", sync);
        }
      }
    },
    { rootMargin: "100% 0px" },
  );
  targets.forEach(({ el }) => io.observe(el));
}

// Keyboard support for the template's anchor-based arrows.
document.addEventListener("keydown", (e) => {
  const t = e.target as HTMLElement;
  if ((e.key === "Enter" || e.key === " ") && t.matches(".navigation-icon a, .navigation-icon2 a")) {
    e.preventDefault();
    t.click();
  }
});
