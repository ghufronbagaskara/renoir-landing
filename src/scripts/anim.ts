// Native image parallax; headings and reading content stay still.
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const parallax = [...document.querySelectorAll<HTMLElement>("[data-speed]")];
if (parallax.length && !reducedMotion) {
  let items: {
    el: HTMLElement;
    frame: HTMLElement;
    factor: number;
    center: number;
    height: number;
    desktop: boolean;
    limit: number;
  }[] = [];
  const measure = () => {
    items = parallax.map((el) => {
      const frame = el.closest<HTMLElement>(".fix") ?? el.parentElement!;
      const r = frame.getBoundingClientRect(); // the frame isn't transformed, so this is the natural position
      const desktop = el.hasAttribute("data-parallax-desktop");
      const limit = desktop
        ? Math.min(
            120,
            r.width * 0.07,
            Math.max(0, (el.offsetHeight - r.height) / 2),
          )
        : Infinity;
      return {
        el,
        frame,
        factor: 1 - parseFloat(el.dataset.speed!),
        center: r.top + scrollY + r.height / 2,
        height: r.height,
        desktop,
        limit,
      };
    });
  };
  const update = () => {
    const mid = scrollY + innerHeight / 2;
    for (const { el, factor, center, height, desktop, limit } of items) {
      if (desktop && innerWidth < 1024) {
        el.style.removeProperty("transform");
        continue;
      }
      const top = center - height / 2 - scrollY;
      if (top + height < -120 || top > innerHeight + 120) continue;
      const y = Math.max(-limit, Math.min(limit, factor * (mid - center)));
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
  };
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => ((queued = false), update()));
  };
  measure();
  update();
  addEventListener("scroll", onScroll, { passive: true });
  new ResizeObserver(() => (measure(), update())).observe(document.body);
}
