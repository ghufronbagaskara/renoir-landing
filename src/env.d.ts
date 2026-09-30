// Worker bindings declared in alchemy.run.ts (Cloudflare.Website.Astro `env`), exposed to server code
// through `import { env } from "cloudflare:workers"`. Keep in sync when bindings change.
// Minimal structural types on purpose: pulling @cloudflare/workers-types in globally clashes with DOM types.
declare module "cloudflare:workers" {
  export const env: {
    THROTTLE: { limit(options: { key: string }): Promise<{ success: boolean }> };
    TURNSTILE_SITEKEY: string;
    TURNSTILE_SECRET: string;
    /** Lead sinks. Empty strings when a sink isn't configured (see alchemy.run.ts). */
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_CHAT_ID: string;
    LEADS_WEBHOOK_URL: string;
    LEADS_WEBHOOK_SECRET: string;
  };
}
