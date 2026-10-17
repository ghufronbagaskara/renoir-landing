const animations = new WeakMap<HTMLElement, Animation>();
export function revealPanel(panel: HTMLElement, opening: boolean, finish: () => void) {
  const height = panel.getBoundingClientRect().height;
  animations.get(panel)?.cancel();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
  const animation = panel.animate([
    { height: `${opening ? 0 : height}px`, opacity: opening ? 0 : 1, overflow: "hidden" },
    { height: `${opening ? panel.scrollHeight : 0}px`, opacity: opening ? 1 : 0, overflow: "hidden" },
  ], { duration: 240, easing: "ease-out" });
  animations.set(panel, animation);
  animation.onfinish = () => { animations.delete(panel); finish(); };
}
