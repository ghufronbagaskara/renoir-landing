// The only on-demand route. Runs in the Cloudflare Worker that Alchemy deploys for the site.
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import * as Effect from "effect/Effect";
import { handleContact, sendResendEmail, toResponse, verifyTurnstileToken } from "~/server/contact";

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
        save: async (s) => {
          const row = await env.DB.prepare(
            `INSERT INTO contact_submissions (source, name, email, phone, subject, message, ip, user_agent)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
          )
            .bind(s.source, s.name, s.email, s.phone ?? null, s.subject ?? null, s.message, s.ip, s.userAgent)
            .first<{ id: number }>();
          return row!.id;
        },
        notify: (s) =>
          sendResendEmail({ apiKey: env.RESEND_API_KEY || undefined, from: env.CONTACT_FROM_EMAIL, to: env.CONTACT_TO_EMAIL || undefined }, s),
        markEmail: async (id, sent, error) => {
          await env.DB.prepare("UPDATE contact_submissions SET email_sent = ?, email_error = ? WHERE id = ?")
            .bind(sent ? 1 : 0, error, id)
            .run();
        },
      }),
    ),
  );

  if (wantsJson(request)) return Response.json({ status: result.status }, { status: result.http });
  // No-JS fallback: send the visitor back to the contact page with the outcome.
  return redirect(result.http === 200 ? "/contact/?sent=1" : `/contact/?error=${result.status}`, 303);
};
