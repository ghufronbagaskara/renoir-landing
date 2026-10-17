const video = document.querySelector<HTMLVideoElement>("[data-hero-video]");
const toggle = document.querySelector<HTMLButtonElement>("[data-video-toggle]");
if (video && toggle) {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const portrait = matchMedia("(max-width: 767px) and (max-aspect-ratio: 9/16)");
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  let inView = false;
  let ready = false;
  let userPaused = false;
  let userStarted = false;
  let resumeTime = 0, playRequest = 0;
  const sync = () => {
    const request = ++playRequest;
    const shouldPlay = inView && !document.hidden && !userPaused && (userStarted || (ready && !motion.matches && !saveData));
    if (shouldPlay || video.hasAttribute("src")) {
      const source = portrait.matches && video.dataset.mobileSrc ? video.dataset.mobileSrc : video.dataset.src!;
      if (video.getAttribute("src") !== source) {
        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) resumeTime = video.currentTime;
        video.src = source;
      }
    }
    if (shouldPlay) {
      if (video.paused) void video.play().catch(() => { if (request === playRequest) video.pause(); });
    } else video.pause();
  };
  const label = () => {
    toggle.setAttribute("aria-label", video.paused ? toggle.dataset.play! : toggle.dataset.pause!);
    toggle.querySelector("span")!.textContent = video.paused ? "▶" : "Ⅱ";
  };
  toggle.hidden = false;
  toggle.addEventListener("click", () => { userPaused = !video.paused; userStarted = !userPaused; sync(); });
  video.addEventListener("loadedmetadata", () => {
    if (resumeTime) {
      video.currentTime = Math.min(resumeTime, video.duration);
      resumeTime = 0;
    }
  });
  video.addEventListener("play", label);
  video.addEventListener("playing", () => { video.hidden = false; });
  video.addEventListener("pause", label);
  video.addEventListener("error", () => { toggle.hidden = true; video.hidden = true; });
  motion.addEventListener("change", () => { userStarted = false; sync(); });
  portrait.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    document.body.classList.toggle("home-hero-visible", inView);
    sync();
  }).observe(video.closest("section")!);
  const loaded = async () => {
    const poster = video.parentElement?.querySelector<HTMLImageElement>("picture img");
    await Promise.all([document.fonts.ready, poster?.decode().catch(() => {})]);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      ready = true;
      sync();
    }));
  };
  if (document.readyState === "complete") void loaded();
  else addEventListener("load", () => void loaded(), { once: true });
}
export {};
