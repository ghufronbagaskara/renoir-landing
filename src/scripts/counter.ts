// Count-up for `.purecounter` (template purecounter.js). Final values are already in the HTML.
const counters = document.querySelectorAll<HTMLElement>(".purecounter[data-purecounter-end]");
if (counters.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver((entries) => {
    for (const { isIntersecting, target } of entries) {
      if (!isIntersecting) continue;
      io.unobserve(target);
      const el = target as HTMLElement;
      const end = Number(el.dataset.purecounterEnd);
      const duration = Number(el.dataset.purecounterDuration ?? 1) * 1000;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = String(Math.round(end * p));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  });
  counters.forEach((c) => io.observe(c));
}
