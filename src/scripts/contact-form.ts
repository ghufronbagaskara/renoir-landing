// Progressive enhancement for [data-contact-form]: lazy Turnstile + fetch submit.
// Without JS the form still posts to /api/contact and gets redirected back with ?sent=1 / ?error=...
type Turnstile = { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id: string) => void };
const w = window as Window & { turnstile?: Turnstile };

let turnstileReady: Promise<Turnstile | null> | undefined;

function loadTurnstile(): Promise<Turnstile | null> {
  turnstileReady ??= (async () => {
    const res = await fetch("/api/contact", { headers: { accept: "application/json" } }).catch(() => null);
    const { sitekey } = (res?.ok ? await res.json() : { sitekey: null }) as { sitekey: string | null };
    if (!sitekey) return null;
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = reject;
      document.head.append(s);
    });
    return Object.assign(w.turnstile!, { sitekey });
  })().catch(() => null);
  return turnstileReady;
}


for (const form of document.querySelectorAll<HTMLFormElement>("[data-contact-form]")) {
  const status = form.querySelector<HTMLElement>("[data-form-status]")!;
  const slot = form.querySelector<HTMLElement>("[data-turnstile]");
  let widgetId: string | undefined;

  // Localised messages are rendered by ContactForm.astro into data-messages.
  const messages = JSON.parse(form.dataset.messages ?? "{}") as Record<string, string>;
  const show = (key: string) => {
    status.textContent = messages[key] ?? messages.error;
    status.dataset.state = key === "sent" ? "ok" : "error";
  };

  form.addEventListener("focusin", async () => {
    if (!slot || widgetId !== undefined) return;
    widgetId = "";
    const ts = (await loadTurnstile()) as (Turnstile & { sitekey: string }) | null;
    if (ts) widgetId = ts.render(slot, { sitekey: ts.sitekey, appearance: "interaction-only" });
  }, { once: false });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector<HTMLButtonElement>("[type=submit]");
    button?.setAttribute("disabled", "");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { accept: "application/json" },
      });
      const body = (await res.json().catch(() => ({ status: "error" }))) as { status: string };
      show(body.status);
      if (res.ok) form.reset();
    } catch {
      show("error");
    } finally {
      button?.removeAttribute("disabled");
      if (widgetId) w.turnstile?.reset(widgetId);
    }
  });

  // No-JS round trip result (e.g. /contact/?sent=1) and CTA prefill (e.g. /contact/?build=internal)
  const params = new URLSearchParams(location.search);
  const buildSelect = form.querySelector<HTMLSelectElement>("[data-prefill=build]");
  const build = params.get("build");
  if (buildSelect && build && [...buildSelect.options].some((o) => o.value === build)) buildSelect.value = build;
  if (params.has("sent")) show("sent");
  else if (params.has("error")) show(params.get("error")!);
}
