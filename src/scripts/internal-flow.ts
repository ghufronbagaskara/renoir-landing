document
  .querySelectorAll<HTMLElement>("[data-internal-flow]")
  .forEach((root) => {
    const scene = root.querySelector<HTMLImageElement>("[data-flow-scene]")!;
    const buttons = [
      ...root.querySelectorAll<HTMLButtonElement>("[data-flow-step]"),
    ];
    const crops = [
      ...root.querySelectorAll<HTMLImageElement>("[data-flow-focus]"),
    ];
    const play = root.querySelector<HTMLButtonElement>("[data-flow-play]")!;
    const replay = root.querySelector<HTMLButtonElement>("[data-flow-replay]")!;
    const status = root.querySelector<HTMLOutputElement>("[data-flow-status]")!;
    const marker = root.querySelector<HTMLElement>("[data-flow-marker]")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let selected = 0;
    let elapsed = 0;
    let frame = 0;
    let previous = 0;
    let visible = false;
    let playing = false;
    let ready = false;
    let failed = false;
    let started = false;

    function positionMarker() {
      marker.style.transform = `translateX(${(selected * marker.parentElement!.clientWidth) / 3}px) translateX(-50%)`;
    }

    function updateStatus() {
      root.dataset.playing = String(playing);
      play.textContent = root.dataset[playing ? "pauseLabel" : "playLabel"]!;
      play.setAttribute("aria-pressed", String(playing));
      status.textContent = reduced.matches
        ? root.dataset.staticLabel!
        : buttons[selected].textContent;
    }

    function select(index: number) {
      selected = index;
      buttons.forEach((button, i) =>
        button.setAttribute("aria-pressed", String(i === index)),
      );
      crops.forEach((crop, i) =>
        crop.classList.toggle("is-active", i === index),
      );
      positionMarker();
      updateStatus();
    }

    function pause() {
      playing = false;
      cancelAnimationFrame(frame);
      previous = 0;
      updateStatus();
    }

    function tick(time: number) {
      if (!playing) return;
      if (previous) elapsed += time - previous;
      previous = time;
      const next = Math.min(3, Math.floor(elapsed / 2000));
      if (next !== selected) select(next);
      if (elapsed >= 8000) {
        pause();
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    function start(reset = false) {
      if (!ready || failed || reduced.matches || !visible || document.hidden)
        return;
      if (reset || elapsed >= 8000) {
        elapsed = 0;
        select(0);
      }
      playing = true;
      previous = 0;
      updateStatus();
      frame = requestAnimationFrame(tick);
    }

    function error() {
      failed = true;
      pause();
      root.classList.remove("is-enhanced");
      root.querySelector<HTMLElement>("[data-flow-error]")!.hidden = false;
      play.disabled = replay.disabled = true;
      buttons.forEach((button) => (button.disabled = true));
    }

    function loaded() {
      if (!scene.naturalWidth) {
        error();
        return;
      }
      if (failed) return;
      ready = true;
      root.classList.add("is-enhanced");
      buttons.forEach((button) => (button.disabled = false));
      if (visible && !started && !reduced.matches) {
        started = true;
        start(true);
      }
    }

    root.querySelector<HTMLElement>("[data-flow-controls]")!.hidden = false;
    buttons.forEach((button, index) =>
      button.addEventListener("click", () => {
        pause();
        elapsed = index * 2000;
        select(index);
      }),
    );
    play.addEventListener("click", () => (playing ? pause() : start()));
    replay.addEventListener("click", () => {
      pause();
      start(true);
    });
    scene.addEventListener("error", error);
    crops.forEach((crop) => crop.addEventListener("error", error));
    if (scene.complete) loaded();
    else scene.addEventListener("load", loaded, { once: true });
    new ResizeObserver(positionMarker).observe(marker.parentElement!);
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) pause();
        else if (ready && !started && !reduced.matches) {
          started = true;
          start(true);
        }
      },
      { threshold: 0.2 },
    ).observe(root);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pause();
    });
    function motionPreference() {
      pause();
      play.disabled = replay.disabled = reduced.matches || failed;
    }
    reduced.addEventListener("change", motionPreference);
    select(0);
    motionPreference();
  });
