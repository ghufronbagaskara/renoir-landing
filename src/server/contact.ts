// Contact form handler as an Effect program. Dependencies are passed in so the logic is testable
// without Cloudflare (see contact.test.ts); the Astro endpoint wires the real bindings.
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { buildTypeOf, parseAnswers, recommend, type Answers, type Recommendation } from "~/lib/quiz";

const Text = (min: number, max: number) => Schema.Trim.pipe(Schema.check(Schema.isMinLength(min), Schema.isMaxLength(max)));

// Intake form (brief §12). Option values are locale-neutral keys; labels live in src/i18n.
export const BuildTypes = ["marketing", "internal", "design", "care", "both", "unsure"] as const;
export const Timelines = ["month", "quarter", "later", "exploring"] as const;
export const Budgets = ["lt10", "10-25", "25-50", "gt50", "discuss"] as const;
const Code = Schema.String.pipe(Schema.check(Schema.isMaxLength(40)));

export const ContactInput = Schema.Struct({
  name: Text(1, 120),
  company: Schema.optionalKey(Text(1, 120)),
  email: Schema.optionalKey(Schema.Trim.pipe(Schema.check(Schema.isMaxLength(254), Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)))),
  whatsapp: Schema.optionalKey(Schema.Trim.pipe(Schema.check(Schema.isPattern(/^\+?[\d\s().-]{8,24}$/)))),
  channel: Schema.optionalKey(Schema.Literals(["email", "whatsapp"])),
  build_type: Schema.optionalKey(Schema.Literals(BuildTypes)),
  message: Schema.optionalKey(Text(1, 5000)),
  timeline: Schema.optionalKey(Schema.Literals(Timelines)),
  budget: Schema.optionalKey(Schema.Literals(Budgets)),
  locale: Schema.Literals(["en", "id"]),
  source: Schema.String.pipe(Schema.check(Schema.isPattern(/^(contact|quiz|service:[\w-]+)$/))),
  /** Client-generated id: a retried submit is stored once. */
  submission_id: Schema.optionalKey(Schema.String.pipe(Schema.check(Schema.isPattern(/^[0-9a-f-]{36}$/)))),
  quiz_goal: Schema.optionalKey(Code),
  quiz_current: Schema.optionalKey(Code),
  quiz_detail: Schema.optionalKey(Code),
  quiz_timing: Schema.optionalKey(Code),
  company_website: Schema.optionalKey(Schema.String),
  "cf-turnstile-response": Schema.optionalKey(Schema.String),
});
export type ContactInput = typeof ContactInput.Type;

/** Cross-field rules the struct can't express. Returns the lead fields or an error message. */
function shape(input: ContactInput): Omit<Submission, "id" | "receivedAt" | "userAgent"> | string {
  const { company_website: _, "cf-turnstile-response": __, submission_id: ___, quiz_goal, quiz_current, quiz_detail, quiz_timing, ...fields } = input;
  const channel = fields.channel ?? (fields.email ? "email" : "whatsapp");
  if (channel === "email" ? !fields.email : !fields.whatsapp) return `missing ${channel}`;
  if (fields.source !== "quiz") {
    if (!fields.build_type) return "missing build_type";
    if ((fields.message?.length ?? 0) < 10) return "message too short";
    return { ...fields, channel, build_type: fields.build_type };
  }
  const answers = parseAnswers({ goal: quiz_goal, current: quiz_current, detail: quiz_detail, timing: quiz_timing });
  if (!answers) return "invalid quiz answers";
  const recommendation = recommend(answers);
  return { ...fields, channel, build_type: buildTypeOf(recommendation), quiz: { ...answers, recommendation } };
}

export class InvalidInput extends Data.TaggedError("InvalidInput")<{ message: string }> {}
export class RateLimited extends Data.TaggedError("RateLimited")<{}> {}
export class TurnstileFailed extends Data.TaggedError("TurnstileFailed")<{}> {}
export class DeliveryFailed extends Data.TaggedError("DeliveryFailed")<{ causes: unknown[] }> {}

/** Lead payload handed to the sinks. The visitor's IP stays in the Worker (rate limit + Turnstile only). */
export interface Submission
  extends Omit<ContactInput, "company_website" | "cf-turnstile-response" | "submission_id" | "quiz_goal" | "quiz_current" | "quiz_detail" | "quiz_timing" | "build_type" | "channel"> {
  id: string;
  receivedAt: string;
  build_type: (typeof BuildTypes)[number];
  channel: "email" | "whatsapp";
  quiz?: Answers & { recommendation: Recommendation };
  userAgent: string | null;
}

/** Sends the lead somewhere. Resolves false when that sink isn't configured. */
export type Sink = (s: Submission) => Promise<boolean>;

export interface ContactDeps {
  /** Returns false when the caller is over the limit. */
  rateLimit: (key: string) => Promise<boolean>;
  verifyTurnstile: (token: string, ip: string | null) => Promise<boolean>;
  /** Run in parallel; the lead counts as received when at least one resolves true. */
  sinks: Sink[];
}

export type ContactResult = { status: "sent"; delivered: number };

export const handleContact = (raw: unknown, meta: { ip: string | null; userAgent: string | null }, deps: ContactDeps) =>
  Effect.gen(function* () {
    // Unselected optional fields arrive as "" from HTML forms; treat them as absent.
    const cleaned =
      raw && typeof raw === "object" ? Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== "")) : raw;
    const input = yield* Schema.decodeUnknownEffect(ContactInput)(cleaned).pipe(
      Effect.mapError((e) => new InvalidInput({ message: String(e) })),
    );

    // Honeypot filled: pretend success, deliver nothing.
    if (input.company_website) return { status: "sent", delivered: 0 } satisfies ContactResult;

    const allowed = yield* Effect.promise(() => deps.rateLimit(meta.ip ?? "unknown"));
    if (!allowed) return yield* new RateLimited();

    const human = yield* Effect.promise(() => deps.verifyTurnstile(input["cf-turnstile-response"] ?? "", meta.ip));
    if (!human) return yield* new TurnstileFailed();

    const fields = shape(input);
    if (typeof fields === "string") return yield* new InvalidInput({ message: fields });
    const submission: Submission = {
      ...fields,
      id: input.submission_id ?? crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      userAgent: meta.userAgent,
    };
    const results = yield* Effect.promise(() => Promise.allSettled(deps.sinks.map((sink) => sink(submission))));
    const delivered = results.filter((r) => r.status === "fulfilled" && r.value).length;
    // No sink took the lead: fail loudly so the visitor retries or uses another channel.
    if (delivered === 0) return yield* new DeliveryFailed({ causes: results.map((r) => (r.status === "rejected" ? r.reason : "not configured")) });

    return { status: "sent", delivered } satisfies ContactResult;
  });

/** Maps the program outcome to an HTTP status + client message key. */
export const toResponse = (program: ReturnType<typeof handleContact>) =>
  program.pipe(
    Effect.map((r) => ({ http: 200, status: r.status as string })),
    Effect.catchTags({
      InvalidInput: () => Effect.succeed({ http: 400, status: "invalid" }),
      RateLimited: () => Effect.succeed({ http: 429, status: "rate_limited" }),
      TurnstileFailed: () => Effect.succeed({ http: 403, status: "captcha" }),
      DeliveryFailed: (e) => Effect.logError("contact: no sink delivered the lead", e.causes).pipe(Effect.as({ http: 500, status: "error" })),
    }),
  );

// ---- Real implementations used by the endpoint ------------------------------------------

export async function verifyTurnstileToken(secret: string, token: string, ip: string | null) {
  if (!token) return false;
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  return res.ok && ((await res.json()) as { success: boolean }).success === true;
}

/** Plain-text lead summary. Budget and timeline lead so a phone notification is enough to triage. */
export function leadText(s: Submission) {
  return [
    `New enquiry: ${s.build_type}${s.budget ? ` · budget ${s.budget}` : ""}${s.timeline ? ` · ${s.timeline}` : ""}`,
    "",
    `Name: ${s.name}`,
    s.company && `Company: ${s.company}`,
    s.email && `Email: ${s.email}`,
    s.whatsapp && `WhatsApp: ${s.whatsapp}`,
    `Reply by: ${s.channel}`,
    `Language: ${s.locale}`,
    `Source: ${s.source}`,
    s.quiz && `Quiz: ${s.quiz.goal} / ${s.quiz.current} / ${s.quiz.detail} / ${s.quiz.timing} → ${s.quiz.recommendation}`,
    s.message && "",
    s.message,
  ]
    .filter((l) => typeof l === "string")
    .join("\n");
}

// Instant push to the owner's phone.
export async function sendTelegram(token: string, chatId: string, s: Submission) {
  if (!token || !chatId) return false;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: leadText(s).slice(0, 4000), disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text()}`);
  return true;
}

// Google Apps Script web app (scripts/leads-apps-script.gs): appends a Sheet row and emails the owner.
// Apps Script can't read request headers, so the shared secret travels in the body.
export async function postLeadWebhook(url: string, secret: string, s: Submission) {
  if (!url || !secret) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret, text: leadText(s), ...s, recommendation: s.quiz?.recommendation ?? "" }),
  });
  const body = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  if (!res.ok || body?.ok !== true) throw new Error(`Lead webhook ${res.status}`);
  return true;
}
