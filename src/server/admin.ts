// Shared guard for /admin/* pages (on-demand, Worker only). Every admin response is private and unindexed.
import type { AstroGlobal } from "astro";
import { env } from "cloudflare:workers";
import { SESSION_COOKIE, sameOrigin, sessionUser, type AdminUser } from "./auth";

export function privateResponse(Astro: AstroGlobal) {
  Astro.response.headers.set("cache-control", "no-store");
  Astro.response.headers.set("x-robots-tag", "noindex, nofollow");
  Astro.response.headers.set("referrer-policy", "same-origin");
  Astro.response.headers.set("x-frame-options", "DENY");
}

export type AdminAuth = { user: AdminUser; token: string };

/**
 * Resolves the signed-in admin, or a Response the page must return (redirect to login, or 403 for a
 * cross-origin POST). Usage: `const auth = await requireAdmin(Astro); if (auth instanceof Response) return auth;`
 */
export async function requireAdmin(Astro: AstroGlobal): Promise<AdminAuth | Response> {
  privateResponse(Astro);
  if (Astro.request.method === "POST" && !sameOrigin(Astro.request)) return new Response("Forbidden", { status: 403 });
  const token = Astro.cookies.get(SESSION_COOKIE)?.value;
  const user = await sessionUser(env.DB, token);
  return user && token ? { user, token } : Astro.redirect("/admin/login/");
}

export const field = (form: FormData, name: string) => {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
};

export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(iso));

/** wa.me link from a stored number: digits only, Indonesian 0-prefix converted to 62. */
export const waLink = (n: string) => `https://wa.me/${n.replace(/\D/g, "").replace(/^0/, "62")}`;
