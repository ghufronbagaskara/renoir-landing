// The only on-demand route. Runs in the Cloudflare Worker that Alchemy deploys for the site.
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import * as Effect from "effect/Effect";
import { handleContact, postLeadWebhook, sendTelegram, toResponse, verifyTurnstileToken } from "~/server/contact";

export const prerender = false;

const wantsJson = (req: Request) => req.headers.get("accept")?.includes("application/json") ?? false;

export const GET: APIRoute = () =>
  Response.json(
    { sitekey: env.TURNSTILE_SITEKEY || null },
    { headers: { "cache-control": "public, max-age=300" } },
  );

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData().catch(() => null);
  const raw = form ? Object.fromEntries([...form].filter(([, v]) => typeof v === "string")) : {};
  const ip = request.headers.get("cf-connecting-ip");

  const result = await Effect.runPromise(
    toResponse(
      handleContact(raw, { ip, userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null }, {
        rateLimit: async (key) => (await env.THROTTLE.limit({ key })).success,
        verifyTurnstile: (token, remoteIp) => verifyTurnstileToken(env.TURNSTILE_SECRET, token, remoteIp),
        sinks: [
          (s) => sendTelegram(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, s),
          (s) => postLeadWebhook(env.LEADS_WEBHOOK_URL, env.LEADS_WEBHOOK_SECRET, s),
        ],
      }),
    ),
  );

  if (wantsJson(request)) return Response.json({ status: result.status }, { status: result.http });
  // No-JS fallback: back to the contact page in the visitor's language, with the outcome.
  const contact = raw.locale === "id" ? "/id/kontak/" : "/contact/";
  return redirect(result.http === 200 ? `${contact}?sent=1` : `${contact}?error=${result.status}`, 303);
};
