// Scroll animations from the template (main.js #19, #21, #22 + ScrollSmoother `data-speed` effects),
// rebuilt on plain ScrollTrigger: native scrolling, no smooth-scroll/lag.
// Non-blocking by design: nothing is hidden by CSS, GSAP loads after `load` + idle and only when the page
// has animated elements, reveals run once, parallax only writes transforms.
const SELECTOR = ".si-text-revel-anim, .si_fade_anim, .si-char-animation";
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Image parallax — the template's ScrollSmoother `data-speed` effect with its exact formula:
//   y = (1 - speed) * (scrollY + viewportHeight / 2 - frameCenterY)
// The image sits at its natural place when its frame is centred in the viewport; above that it is pulled
// up (so the hero photo starts tucked behind the hero text), below it drifts down. The overflow-hidden
// frame (`.fix`) clips it. No GSAP needed: runs immediately (no jump when GSAP loads later), one passive
// rAF-throttled scroll listener, transforms only.
const parallax = [...document.querySelectorAll<HTMLElement>("[data-speed]")];
if (parallax.length && !reducedMotion) {
  let items: { el: HTMLElement; frame: HTMLElement; factor: number; center: number }[] = [];
  const measure = () => {
    items = parallax.map((el) => {
      const frame = el.closest<HTMLElement>(".fix") ?? el.parentElement!;
      const r = frame.getBoundingClientRect(); // the frame isn't transformed, so this is the natural position
      return { el, frame, factor: 1 - parseFloat(el.dataset.speed!), center: r.top + scrollY + r.height / 2 };
    });
  };
  const update = () => {
    const mid = scrollY + innerHeight / 2;
    for (const { el, factor, center } of items) el.style.transform = `translate3d(0, ${(factor * (mid - center)).toFixed(1)}px, 0)`;
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

async function init() {
  if (reducedMotion || !document.querySelector(SELECTOR)) return;

  // On phones, a single compositor animation communicates the reveal without loading GSAP/SplitText.
  if (matchMedia("(max-width: 767px)").matches) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        (entry.target as HTMLElement).animate(
          [
            { opacity: 0.72, transform: "translateY(14px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 480, easing: "cubic-bezier(.16, 1, .3, 1)" },
        );
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(SELECTOR).forEach((element) => observer.observe(element));
    return;
  }

  const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/SplitText"),
  ]);
  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (import.meta.env.DEV) Object.assign(window, { ScrollTrigger });

  const attr = (el: Element, name: string, fallback: number | string) => el.getAttribute(name) ?? fallback;
  // Reveals start as soon as the element's top enters the bottom 8% of the viewport, so text near the
  // end of the page (e.g. the footer heading) never needs extra scrolling to appear.
  const REVEAL_START = "top 92%";
  const trigger = (el: Element) => ({ trigger: el, start: REVEAL_START, once: true });

  for (const el of gsap.utils.toArray<HTMLElement>(".si-text-revel-anim")) {
    // No "lines" split: its block wrappers reflow the text (layout shift) and nothing styles them.
    const split = SplitText.create(el, { type: "words,chars" });
    const onScroll = Number(attr(el, "data-on-scroll", 1)) === 1;
    gsap.from(split.chars, {
      duration: Number(attr(el, "data-duration", 1)),
      delay: Number(attr(el, "data-delay", 0.05)),
      ease: String(attr(el, "data-ease", "circ.out")),
      y: 80,
      opacity: 0,
      stagger: Number(attr(el, "data-stagger", 0.02)),
      ...(onScroll && { scrollTrigger: trigger(el) }),
    });
  }

  for (const el of gsap.utils.toArray<HTMLElement>(".si_fade_anim")) {
    const offset = Number(attr(el, "data-fade-offset", 40));
    const from = String(attr(el, "data-fade-from", "bottom"));
    gsap.from(el, {
      opacity: 0,
      ease: String(attr(el, "data-ease", "power2.out")),
      duration: Number(attr(el, "data-duration", 0.75)),
      delay: Number(attr(el, "data-delay", 0.15)),
      x: from === "left" ? -offset : from === "right" ? offset : 0,
      y: from === "top" ? -offset : from === "bottom" ? offset : 0,
      ...(Number(attr(el, "data-on-scroll", 1)) === 1 && { scrollTrigger: trigger(el) }),
    });
  }

  for (const el of gsap.utils.toArray<HTMLElement>(".si-char-animation")) {
    const split = SplitText.create(el, { type: "chars, words" });
    gsap.set(el, { perspective: 300 });
    gsap.from(split.chars, { duration: 1, delay: 0.5, x: 100, autoAlpha: 0, stagger: 0.05, scrollTrigger: trigger(el) });
  }

  // Keep trigger positions right when the page height changes after init (sliders, late images, fonts).
  let pending: number | undefined;
  new ResizeObserver(() => {
    cancelAnimationFrame(pending!);
    pending = requestAnimationFrame(() => ScrollTrigger.refresh());
  }).observe(document.body);
}

// Wait for load + an idle slot so animation code never competes with first paint / LCP.
const idle = (cb: () => void) => ("requestIdleCallback" in window ? requestIdleCallback(cb, { timeout: 2000 }) : setTimeout(cb, 200));
if (document.readyState === "complete") idle(init);
else window.addEventListener("load", () => idle(init), { once: true });
