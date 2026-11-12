import { initHomeTabs } from "./home-tabs";
for (const root of document.querySelectorAll<HTMLElement>("[data-works-wheel]")) {
  initHomeTabs(root);
  const stage = root.querySelector<HTMLElement>("[data-wheel-stage]")!;
  const orbit = root.querySelector<HTMLElement>("[data-wheel-orbit]")!;
  const content = root.querySelector<HTMLElement>(".wheel-content")!;
  const label = root.querySelector<HTMLElement>("[data-wheel-label]")!;
  const cards = [...root.querySelectorAll<HTMLElement>(".wheel-card")];
  const faces = cards.map(card => card.firstElementChild as HTMLElement);
  const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-tab]")];
  const positions = tabs.map((_, i) => cards.findIndex(card => card.dataset.serviceIndex === String(i)));
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0, turn = 0, target = 0, rotation = 0, rotationTarget = 0;
  const playback = root.querySelector<HTMLButtonElement>("[data-wheel-playback]")!;
  const revolution = 90000;
  let spin: Animation | undefined;
  let paused = motion.matches, hovered = false, holding = false;
  let opened = false, visible = false, frame = 0, cardW = 0, cardH = 0;
  let previousMix = -1, previousPosition = -1;
  const syncSpin = () => {
    const focus = document.activeElement;
    if (opened || paused || hovered || holding || !visible || document.hidden || !cardW || turn !== 0 ||
      (focus !== playback && root.contains(focus))) {
      if (spin?.playState === "running" || spin?.pending) spin.pause();
      return;
    }
    spin ??= orbit.animate([{ rotate: "0deg" }, { rotate: "360deg" }], { duration: revolution, iterations: Infinity });
    if (spin.playState === "paused") spin.play();
  };
  const syncPlayback = () => {
    playback.setAttribute("aria-label", (paused ? playback.dataset.play : playback.dataset.pause)!);
    playback.firstElementChild!.textContent = paused ? "▶" : "Ⅱ";
    syncSpin();
  };
  const draw = () => {
    frame = 0;
    const immediate = motion.matches || !visible || document.hidden;
    turn = immediate || Math.abs(target - turn) < .001 ? target : turn + (target - turn) * .14;
    rotation = immediate || Math.abs(rotationTarget - rotation) < .01 ? rotationTarget : rotation + (rotationTarget - rotation) * .14;
    const m = Math.min(1, Math.max(0, turn));
    const pos = Math.max(0, turn - 1);
    const ringR = cardH * 1.12, drumR = cardH * 2.22;
    const ringScale = Math.min(1, 2 * Math.PI * ringR / cards.length * .82 / cardW);
    if (m !== previousMix) {
      orbit.style.transform = `translateZ(${-m * drumR}px)`;
      label.style.opacity = String(1 - m);
      root.style.setProperty("--wheel-open", String(m));
    }
    cards.forEach((card, i) => {
      const distance = i - pos, angle = distance * 40;
      const bow = -cardH * 1.82 * (1 - Math.cos(angle * Math.PI / 180));
      card.style.transform = `translateX(${m * bow}px) rotateZ(${(1 - m) * (i * 40 + rotation)}deg) translateY(${-(1 - m) * ringR}px) rotateX(${m * angle}deg) translateZ(${m * drumR}px)`;
      if (m !== previousMix || pos !== previousPosition) {
        card.style.opacity = m > .5 && Math.abs(distance) > 1.6 ? "0" : "1";
        card.style.zIndex = String(Math.round(100 - Math.abs(distance) * 2));
      }
      if (m !== previousMix) faces[i].style.transform = `scale(${ringScale + (1 - ringScale) * m})`;
    });
    previousMix = m;
    previousPosition = pos;
    if (visible && !document.hidden && (Math.abs(target - turn) >= .001 || Math.abs(rotationTarget - rotation) >= .01)) frame = requestAnimationFrame(draw);
    syncSpin();
  };
  const schedule = () => { if (!frame && cardW) frame = requestAnimationFrame(draw); };
  const measure = ({ width, height }: DOMRectReadOnly) => {
    cardH = Math.min(height * .36, width * .28);
    cardW = cardH * 1.45;
    stage.style.perspective = `${cardH * 2.7}px`;
    previousMix = previousPosition = -1;
    for (const card of cards) Object.assign(card.style, { width: `${cardW}px`, height: `${cardH}px`, marginLeft: `${-cardW / 2}px`, marginTop: `${-cardH / 2}px` });
    schedule();
  };
  root.classList.add("is-overview");
  content.inert = true;
  root.addEventListener("tabs:change", event => {
    if (spin) {
      const angle = Number(spin.currentTime ?? 0) % revolution / revolution * 360;
      rotation += angle;
      rotationTarget += angle;
      spin.cancel();
      spin = undefined;
    }
    current = (event as CustomEvent<{ index: number }>).detail.index;
    opened = true;
    content.inert = false;
    for (const card of cards) card.inert = card.dataset.serviceIndex !== String(current);
    root.classList.remove("is-overview");
    target = positions[current] + 1;
    schedule();
  });
  const select = (offset: number) => tabs[(current + offset + tabs.length) % tabs.length].click();
  root.querySelector("[data-wheel-previous]")!.addEventListener("click", () => select(opened ? -1 : 0));
  root.querySelector("[data-wheel-next]")!.addEventListener("click", () => select(opened ? 1 : 0));
  root.querySelector("[data-wheel-overview]")!.addEventListener("click", () => {
    opened = false;
    content.inert = true;
    for (const card of cards) card.inert = false;
    root.classList.add("is-overview");
    target = 0;
    schedule();
  });
  root.querySelector<HTMLElement>("[data-wheel-controls]")!.hidden = false;
  playback.addEventListener("click", () => { paused = !paused; syncPlayback(); });
  stage.addEventListener("pointerenter", event => { hovered = event.pointerType === "mouse"; syncSpin(); });
  stage.addEventListener("pointerleave", () => { hovered = false; syncSpin(); });
  root.addEventListener("focusin", syncSpin);
  root.addEventListener("focusout", () => queueMicrotask(syncSpin));
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
    else { cancelAnimationFrame(frame); frame = 0; }
    syncSpin();
  }).observe(stage);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else if (visible) schedule();
    syncSpin();
  });
  motion.addEventListener("change", () => { paused = motion.matches; syncPlayback(); schedule(); });
  new ResizeObserver(([entry]) => measure(entry.contentRect)).observe(stage);
  syncPlayback();
  let drag: { x: number; y: number; rotation: number; captured: boolean } | null = null;
  let suppressClick = false;
  stage.addEventListener("dragstart", event => event.preventDefault());
  stage.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    holding = true;
    syncSpin();
    suppressClick = false;
    drag = { x: event.clientX, y: event.clientY, rotation: rotationTarget, captured: false };
  });
  stage.addEventListener("pointermove", event => {
    if (!drag) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    // Vertical touch gestures remain available for native page scrolling.
    if (event.pointerType !== "mouse" && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8 && !drag.captured) { cancel(); return; }
    if (!drag.captured && Math.hypot(dx, dy) > 8) {
      drag.captured = true;
      stage.setPointerCapture(event.pointerId);
      stage.classList.add("is-dragging");
    }
    if (drag.captured && !opened) { rotationTarget = drag.rotation + (dx - dy) * .35; schedule(); }
  });
  stage.addEventListener("pointerup", event => {
    if (drag?.captured) {
      suppressClick = true;
      if (opened && Math.abs(event.clientX - drag.x) > 40) select(event.clientX < drag.x ? 1 : -1);
    }
    cancel();
  });
  const cancel = () => { drag = null; holding = false; stage.classList.remove("is-dragging"); syncSpin(); };
  stage.addEventListener("pointerleave", () => { if (drag && !drag.captured) cancel(); });
  stage.addEventListener("pointercancel", cancel);
  stage.addEventListener("lostpointercapture", cancel);
  stage.addEventListener("click", event => {
    if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; return; }
    if (opened || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
    const link = event.target.closest(".wheel-card a");
    const index = link?.parentElement?.dataset.serviceIndex;
    if (index === undefined) return;
    event.preventDefault();
    tabs[Number(index)].click();
  }, true);
}
