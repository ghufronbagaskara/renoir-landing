// One question at a time for [data-quiz], then the recommendation, then the optional contact step.
// Answers live in sessionStorage for this tab only; nothing is sent until the visitor submits the form.
import { branchOf, proofOf, questionOrder, recommend, scopeOf, type Answers, type Goal } from "~/lib/quiz";

const KEY = "katalhys.quiz.v2";
// Answer → form field name; the budget answer uses the API's regular budget field.
const field = (key: (typeof questionOrder)[number]) => (key === "budget" ? "budget" : `quiz_${key}`);
/** Answers repeated under "Why this fits". */
const REASONS = ["quiz_goal", "quiz_current", "quiz_detail", "quiz_size"];

for (const root of document.querySelectorAll<HTMLElement>("[data-quiz]")) {
  const form = root.querySelector<HTMLFormElement>("[data-quiz-form]")!;
  const intro = root.querySelector<HTMLElement>("[data-quiz-intro]")!;
  const startButton = root.querySelector<HTMLButtonElement>("[data-quiz-start]")!;
  const allSteps = [...form.querySelectorAll<HTMLFieldSetElement>("[data-quiz-step]")];
  const result = form.querySelector<HTMLElement>("[data-quiz-result]")!;
  const contact = form.querySelector<HTMLFieldSetElement>("[data-quiz-contact]")!;
  const progress = form.querySelector<HTMLElement>("[data-quiz-progress]")!;
  const progressText = form.querySelector<HTMLElement>("[data-quiz-progress-text]")!;
  const bar = form.querySelector<HTMLElement>("[data-quiz-bar]")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  root.classList.add("is-enhanced");
  root.querySelector<HTMLElement>("[data-quiz-nojs]")!.hidden = true;
  startButton.hidden = false;
  form.querySelector<HTMLInputElement>("[data-quiz-id]")!.value = crypto.randomUUID();
  for (const nav of form.querySelectorAll<HTMLElement>(".quiz-nav")) nav.hidden = false;

  const value = (name: string) => form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked:not(:disabled)`)?.value;
  const answers = () => Object.fromEntries(questionOrder.map((k) => [k, value(field(k))])) as Partial<Answers>;

  // The detail question depends on the goal; other branches are disabled so they are neither required nor sent.
  const steps = () => {
    const branch = branchOf[(value("quiz_goal") ?? "unsure") as Goal];
    for (const s of allSteps) if (s.dataset.branch) s.disabled = s.dataset.branch !== branch;
    return allSteps.filter((s) => !s.disabled);
  };
  for (const s of allSteps) if (s.dataset.branch) for (const r of s.querySelectorAll<HTMLInputElement>("input")) r.required = true;

  let index = -1;
  const save = () => {
    try { sessionStorage.setItem(KEY, JSON.stringify({ ...answers(), index })); } catch { /* storage unavailable: progress stays in memory */ }
  };
  const focus = (el: HTMLElement | null) => {
    el?.focus({ preventScroll: true });
    el?.closest("section, fieldset")?.scrollIntoView({ block: "start", behavior: reduced.matches ? "auto" : "smooth" });
  };

  function show(next: number) {
    const list = steps();
    index = Math.max(0, Math.min(next, list.length));
    intro.hidden = true;
    for (const s of allSteps) s.hidden = s !== list[index];
    const done = index === list.length;
    progress.hidden = done;
    result.hidden = !done;
    if (!done) {
      const step = list[index];
      progressText.textContent = root.dataset.progress!.replace("{n}", String(index + 1)).replace("{total}", String(list.length));
      bar.style.width = `${((index + 1) / list.length) * 100}%`;
      step.querySelector<HTMLButtonElement>("[data-quiz-back]")!.disabled = false;
      step.querySelector<HTMLButtonElement>("[data-quiz-next]")!.disabled = !value(step.dataset.quizStep!);
      focus(step.querySelector("h3"));
    } else {
      showResult();
    }
    save();
  }

  function showResult() {
    const a = answers() as Answers;
    const key = recommend(a);
    const pick = (attr: string, wanted: string) => {
      for (const el of result.querySelectorAll<HTMLElement>(`[${attr}]`)) el.hidden = el.getAttribute(attr) !== wanted;
    };
    pick("data-result", key);
    pick("data-scope", scopeOf(a, key));
    pick("data-example", a.industry);
    pick("data-proof", proofOf(a, key));
    const panel = result.querySelector<HTMLElement>(`[data-result="${key}"]`)!;
    // "Why this fits" repeats the visitor's own answers.
    panel.querySelector("[data-quiz-because]")!.replaceChildren(
      ...steps().filter((s) => REASONS.includes(s.dataset.quizStep!)).map((s) => {
        const li = document.createElement("li");
        li.textContent = s.querySelector<HTMLInputElement>("input:checked")?.closest("label")?.textContent?.trim() ?? "";
        return li;
      }),
    );
    focus(panel.querySelector("h3"));
  }

  function reset() {
    form.reset();
    try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
    contact.hidden = true;
    form.querySelector<HTMLInputElement>("[data-quiz-id]")!.value = crypto.randomUUID();
    syncChannel();
  }

  startButton.addEventListener("click", () => show(0));
  form.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-quiz-next]")) show(index + 1);
    else if (target.closest("[data-quiz-back]")) index === 0 ? backToIntro() : show(index - 1);
    else if (target.closest("[data-quiz-edit]")) { contact.hidden = true; show(0); }
    else if (target.closest("[data-quiz-restart]")) { reset(); show(0); }
    else if (target.closest("[data-quiz-send]")) { contact.hidden = false; focus(contact.querySelector("h3")); }
  });

  // A pointer choice moves on by itself; keyboard users confirm with Next so arrow keys can browse options.
  let pointer = false;
  form.addEventListener("pointerdown", () => (pointer = true));
  form.addEventListener("keydown", () => (pointer = false));
  form.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;
    const step = input.closest<HTMLFieldSetElement>("[data-quiz-step]");
    if (!step) return;
    step.querySelector<HTMLButtonElement>("[data-quiz-next]")!.disabled = false;
    save();
    if (pointer) setTimeout(() => show(index + 1), reduced.matches ? 0 : 180);
  });

  function backToIntro() {
    for (const s of allSteps) s.hidden = true;
    progress.hidden = true;
    intro.hidden = false;
    index = -1;
    focus(startButton);
  }

  // Email or WhatsApp: only the chosen field is required and submitted.
  function syncChannel() {
    const channel = value("channel") ?? "email";
    for (const wrap of contact.querySelectorAll<HTMLElement>("[data-channel-field]")) {
      const on = wrap.dataset.channelField === channel;
      wrap.hidden = !on;
      const input = wrap.querySelector("input")!;
      input.disabled = !on;
      input.required = on;
    }
  }
  contact.addEventListener("change", (e) => { if ((e.target as HTMLElement).matches("[data-quiz-channel]")) syncChannel(); });

  // Initial state: intro, or resume this tab's answers.
  for (const s of allSteps) s.hidden = true;
  result.hidden = true;
  contact.hidden = true;
  syncChannel();
  steps();
  const params = new URLSearchParams(location.search);
  if (params.has("sent") || params.has("error")) {
    intro.hidden = true;
    contact.hidden = false;
  } else {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as (Partial<Answers> & { index: number }) | null;
      if (saved && saved.index >= 0) {
        for (const k of questionOrder) {
          if (k === "detail") continue;
          const input = form.querySelector<HTMLInputElement>(`[data-quiz-step] input[name="${field(k)}"][value="${CSS.escape(String(saved[k]))}"]`);
          if (input) input.checked = true;
        }
        steps();
        const detail = form.querySelector<HTMLInputElement>(`input[name="quiz_detail"][value="${CSS.escape(String(saved.detail))}"]:not(:disabled)`);
        if (detail) detail.checked = true;
        show(saved.index);
      }
    } catch { /* ignore broken drafts */ }
  }

  // After a successful send the shared contact script resets the form; start a fresh draft too.
  new MutationObserver(() => {
    if (contact.querySelector<HTMLElement>("[data-form-status]")?.dataset.state === "ok") {
      try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
      form.querySelector<HTMLInputElement>("[data-quiz-id]")!.value = crypto.randomUUID();
      syncChannel();
    }
  }).observe(contact, { subtree: true, attributes: true, attributeFilter: ["data-state"] });
}
