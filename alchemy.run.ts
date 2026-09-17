// Infrastructure for the Renoir landing site (Alchemy v2, Effect-based).
//
//   bun alchemy deploy                 # personal dev stage
//   bun alchemy deploy --stage prod    # production
//
// Credentials come from Alchemy profiles (~/.alchemy/profiles.json) locally and from
// CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID secrets in CI. Values below that are read with
// effect/Config come from the environment (.env locally, GitHub secrets in CI): see .env.example.
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as GitHub from "alchemy/GitHub";
import * as Output from "alchemy/Output";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";

export default Alchemy.Stack(
  "renoir-landing",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), GitHub.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    // Contact form storage. Migrations in ./migrations are applied on every deploy.
    const db = yield* Cloudflare.D1.Database("ContactDB", { migrations: "./migrations" });

    // Spam protection. All stages live on <account>.workers.dev (no custom domain yet);
    // subdomains are covered automatically. localhost is included for `alchemy dev`.
    const workersDev = yield* Config.string("WORKERS_DEV_SUBDOMAIN");
    const turnstile = yield* Cloudflare.Turnstile.Widget("ContactTurnstile", {
      domains: [workersDev, "localhost"],
      mode: "managed",
    });

    const site = yield* Cloudflare.Website.Astro("Website", {
      // Pages are prerendered (`export const prerender = true`) and served straight from the asset
      // layer; the Worker only runs for /api/contact. Output must stay "server": "static" deploys
      // assets-only, which would drop the API route.
      astro: { output: "server", trailingSlash: "always" },
      assets: { notFoundHandling: "404-page", htmlHandling: "auto-trailing-slash" },
      sessionKVBindingName: false,
      env: {
        DB: db,
        THROTTLE: Cloudflare.RateLimit("CONTACT_THROTTLE", { namespaceId: 1001, simple: { limit: 5, period: 60 } }),
        TURNSTILE_SITEKEY: turnstile.sitekey,
        TURNSTILE_SECRET: turnstile.secret,
        RESEND_API_KEY: yield* Config.redacted("RESEND_API_KEY").pipe(Config.withDefault(Redacted.make(""))),
        CONTACT_TO_EMAIL: yield* Config.string("CONTACT_TO_EMAIL").pipe(Config.withDefault("")),
        CONTACT_FROM_EMAIL: yield* Config.string("CONTACT_FROM_EMAIL").pipe(Config.withDefault("Website <onboarding@resend.dev>")),
      },
    });

    // Pull request previews (CI sets PULL_REQUEST): comment the preview URL on the PR.
    if (process.env.PULL_REQUEST) {
      yield* GitHub.Comment("preview-comment", {
        owner: yield* Config.string("GITHUB_OWNER"),
        repository: yield* Config.string("GITHUB_REPO"),
        issueNumber: Number(process.env.PULL_REQUEST),
        body: Output.interpolate`
## Preview deployed

**URL:** ${site.url}

Built from commit ${process.env.GITHUB_SHA?.slice(0, 7) ?? "local"}

_This comment updates automatically with each push._
`,
      });
    }

    return { url: site.url, database: db.databaseName };
  }),
);
