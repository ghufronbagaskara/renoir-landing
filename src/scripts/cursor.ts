// Magic cursor + magnetic buttons (template si-cursor.js and main.js #16/#17), rAF instead of GSAP.
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ball = document.getElementById("ball");

if (fine && !reduced && ball) {
  document.body.classList.add("si-magic-cursor");
  const cursor = document.getElementById("magic-cursor")!;
  const mouse = { x: -100, y: -100 };
  const pos = { x: -100, y: -100 };
  let locked = false;
  let scale = 1;

  Object.assign(ball.style, { width: "14px", height: "14px", borderWidth: "1px", transition: "opacity .3s, width .3s, height .3s" });

  // The loop only runs while the dot is catching up with the pointer, so an idle page does no work.
  let running = false;
  const render = () => {
    if (!locked) {
      pos.x += (mouse.x - pos.x) * 0.15;
      pos.y += (mouse.y - pos.y) * 0.15;
    }
    ball.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${scale})`;
    running = locked || Math.abs(mouse.x - pos.x) + Math.abs(mouse.y - pos.y) > 0.5;
    if (running) requestAnimationFrame(render);
  };
  const kick = () => {
    if (!running) {
      running = true;
      requestAnimationFrame(render);
    }
  };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursor.style.opacity = "1";
    kick();
  }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => (cursor.style.opacity = "0"));

  // Hide the dot over interactive elements, like the template.
  document.addEventListener("mouseover", (e) => {
    const hit = (e.target as HTMLElement).closest("a, button:not(.cursor-hide)");
    scale = hit ? 0 : 1;
    kick();
  }, { passive: true });

  // Magnetic items
  for (const item of document.querySelectorAll<HTMLElement>(".si-magnetic-item, .si-circle-btn-wrap")) {
    item.style.transition = "transform .3s ease-out";
    item.addEventListener("mousemove", (e) => {
      const r = item.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      item.style.transform = `translate(${dx * 25}px, ${dy * 25}px)`;
      locked = true;
      pos.x = r.left + r.width / 2 + dx * r.width / 2;
      pos.y = r.top + r.height / 2 + dy * r.height / 2;
      scale = 2;
      kick();
    });
    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
      locked = false;
      scale = 1;
      kick();
    });
  }
}
