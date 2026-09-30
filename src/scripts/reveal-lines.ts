const lines = document.querySelectorAll<HTMLElement>("[data-line-reveal]");
if (lines.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -12% 0px" });
  lines.forEach((line) => observer.observe(line));
}
