// Contact form handler as an Effect program. Dependencies are passed in so the logic is testable
// without Cloudflare (see contact.test.ts); the Astro endpoint wires the real bindings.
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

const Text = (min: number, max: number) => Schema.Trim.pipe(Schema.check(Schema.isMinLength(min), Schema.isMaxLength(max)));

export const ContactInput = Schema.Struct({
  name: Text(1, 120),
  email: Schema.Trim.pipe(Schema.check(Schema.isMaxLength(254), Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))),
  phone: Schema.optionalKey(Text(0, 40)),
  subject: Schema.optionalKey(Text(0, 120)),
  message: Text(10, 5000),
  source: Schema.String.pipe(Schema.check(Schema.isPattern(/^(contact|service:[\w-]+|team:[\w-]+)$/))),
  company_website: Schema.optionalKey(Schema.String),
  "cf-turnstile-response": Schema.optionalKey(Schema.String),
});
export type ContactInput = typeof ContactInput.Type;

export class InvalidInput extends Data.TaggedError("InvalidInput")<{ message: string }> {}
export class RateLimited extends Data.TaggedError("RateLimited")<{}> {}
export class TurnstileFailed extends Data.TaggedError("TurnstileFailed")<{}> {}
export class StorageFailed extends Data.TaggedError("StorageFailed")<{ cause: unknown }> {}

export interface Submission extends ContactInput {
  ip: string | null;
  userAgent: string | null;
}

export interface ContactDeps {
  /** Returns false when the caller is over the limit. */
  rateLimit: (key: string) => Promise<boolean>;
  verifyTurnstile: (token: string, ip: string | null) => Promise<boolean>;
  /** Persists the submission; returns its id. */
  save: (s: Submission) => Promise<number>;
  /** Sends the notification email. Resolves false when email isn't configured. */
  notify: (s: Submission) => Promise<boolean>;
  markEmail: (id: number, sent: boolean, error: string | null) => Promise<void>;
}

export type ContactResult = { status: "sent"; stored: boolean };

export const handleContact = (raw: unknown, meta: { ip: string | null; userAgent: string | null }, deps: ContactDeps) =>
  Effect.gen(function* () {
    const input = yield* Schema.decodeUnknownEffect(ContactInput)(raw).pipe(
      Effect.mapError((e) => new InvalidInput({ message: String(e) })),
    );

    // Honeypot filled: pretend success, store nothing.
    if (input.company_website) return { status: "sent", stored: false } satisfies ContactResult;

    const allowed = yield* Effect.promise(() => deps.rateLimit(meta.ip ?? "unknown"));
    if (!allowed) return yield* new RateLimited();

    const human = yield* Effect.promise(() => deps.verifyTurnstile(input["cf-turnstile-response"] ?? "", meta.ip));
    if (!human) return yield* new TurnstileFailed();

    const submission: Submission = { ...input, ...meta };
    const id = yield* Effect.tryPromise({ try: () => deps.save(submission), catch: (cause) => new StorageFailed({ cause }) });

    // Email is best effort: the message is already stored.
    const email = yield* Effect.promise(() =>
      deps.notify(submission).then(
        (sent) => ({ sent, error: sent ? null : "email not configured" }),
        (e: unknown) => ({ sent: false, error: String(e).slice(0, 500) }),
      ),
    );
    yield* Effect.promise(() => deps.markEmail(id, email.sent, email.error)).pipe(Effect.ignore);

    return { status: "sent", stored: true } satisfies ContactResult;
  });

/** Maps the program outcome to an HTTP status + client message key. */
export const toResponse = (program: ReturnType<typeof handleContact>) =>
  program.pipe(
    Effect.map((r) => ({ http: 200, status: r.status as string })),
    Effect.catchTags({
      InvalidInput: () => Effect.succeed({ http: 400, status: "invalid" }),
      RateLimited: () => Effect.succeed({ http: 429, status: "rate_limited" }),
      TurnstileFailed: () => Effect.succeed({ http: 403, status: "captcha" }),
      StorageFailed: (e) => Effect.logError("contact: storage failed", e.cause).pipe(Effect.as({ http: 500, status: "error" })),
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

export async function sendResendEmail(opts: { apiKey: string | undefined; from: string; to: string | undefined }, s: Submission) {
  if (!opts.apiKey || !opts.to) return false;
  const lines = [
    `Name: ${s.name}`,
    `Email: ${s.email}`,
    s.phone && `Phone: ${s.phone}`,
    s.subject && `Subject: ${s.subject}`,
    `Source: ${s.source}`,
    "",
    s.message,
  ].filter((l) => l !== undefined && l !== "");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${opts.apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      reply_to: s.email,
      subject: `New enquiry from ${s.name.replace(/[\r\n]/g, " ")}`,
      text: lines.join("\n"),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return true;
}
