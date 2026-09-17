// Swiper sliders from the template's slider-active.js. Swiper is imported lazily so pages
// without sliders ship none of it; only the modules actually used are bundled.
import "swiper/css";
import "swiper/css/scrollbar";

// The template's arrow markup is swapped (".si-button-next" holds the left arrow), so the
// selectors are mapped by what the user sees: left arrow = previous.
const configs = {
  ".si-project": (section: Element) => ({
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    navigation: { prevEl: section.querySelector<HTMLElement>(".si-button-next"), nextEl: section.querySelector<HTMLElement>(".si-button-prev") },
    breakpoints: { 992: { slidesPerView: 2 } },
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
      const { Swiper, Navigation, Scrollbar, A11y } = await import("./swiper-bundle");
      for (const { target } of visible) {
        io.unobserve(target);
        const { el, config } = targets.find((t) => t.el === target)!;
        const section = el.closest("section") ?? document.body;
        new Swiper(el, { modules: [Navigation, Scrollbar, A11y], ...config(section) });
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
