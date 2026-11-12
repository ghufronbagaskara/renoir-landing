// Stores the visitor's cookie choice in localStorage and announces it. Future analytics/marketing loaders
// must check `window.katalhysConsent.get()` and listen for "consent:change" before loading anything.
export interface Consent { v: 1; analytics: boolean; marketing: boolean; at: string }
const KEY = "katalhys.consent.v1";

function read(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) ?? "null") as Consent | null;
    return c?.v === 1 ? c : null;
  } catch {
    return null;
  }
}

const banner = document.querySelector<HTMLElement>("[data-consent-banner]");
const dialog = document.querySelector<HTMLDialogElement>("[data-consent-dialog]");

function store(choice: { analytics: boolean; marketing: boolean }) {
  const consent: Consent = { v: 1, ...choice, at: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify(consent)); } catch { /* storage blocked: ask again next page */ }
  if (banner) banner.hidden = true;
  dialog?.close();
  window.dispatchEvent(new CustomEvent("consent:change", { detail: consent }));
}

function open() {
  if (!dialog) return;
  const c = read();
  for (const name of ["analytics", "marketing"] as const) (dialog.querySelector(`input[name=${name}]`) as HTMLInputElement).checked = c?.[name] ?? false;
  dialog.showModal();
}

(window as Window & { katalhysConsent?: unknown }).katalhysConsent = { get: read, open };

if (banner && !read()) banner.hidden = false;

document.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;
  if (t.closest("[data-consent-open]")) return open();
  const action = t.closest<HTMLElement>("[data-consent]")?.dataset.consent;
  if (action === "accept") store({ analytics: true, marketing: true });
  else if (action === "reject") store({ analytics: false, marketing: false });
  else if (action === "save" && dialog) {
    const on = (n: string) => (dialog.querySelector(`input[name=${n}]`) as HTMLInputElement).checked;
    store({ analytics: on("analytics"), marketing: on("marketing") });
  }
});
