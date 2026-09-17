// Worker bindings declared in alchemy.run.ts (Cloudflare.Website.Astro `env`), exposed to server code
// through `import { env } from "cloudflare:workers"`. Keep in sync when bindings change.
// Minimal structural types on purpose: pulling @cloudflare/workers-types in globally clashes with DOM types.
declare module "cloudflare:workers" {
  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T>(): Promise<T | null>;
    run(): Promise<unknown>;
  }
  export const env: {
    DB: { prepare(query: string): D1PreparedStatement };
    THROTTLE: { limit(options: { key: string }): Promise<{ success: boolean }> };
    TURNSTILE_SITEKEY: string;
    TURNSTILE_SECRET: string;
    /** Empty string when email notifications aren't configured. */
    RESEND_API_KEY: string;
    CONTACT_TO_EMAIL: string;
    CONTACT_FROM_EMAIL: string;
  };
}
