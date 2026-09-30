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
    // Spam protection. Turnstile's free plan caps widgets per account, so only prod gets a real widget;
    // personal and PR stages use Cloudflare's always-pass test keys.
    // https://developers.cloudflare.com/turnstile/troubleshooting/testing/
    const stage = yield* Alchemy.Stage;
    const prod = stage === "prod";
    // No custom domain yet: prod is https://renoir.<account>.workers.dev (e.g. "ghufronbagaskara08.workers.dev").
    const workersDev = prod ? yield* Config.string("WORKERS_DEV_SUBDOMAIN") : undefined;
    const turnstile = workersDev
      ? yield* Cloudflare.Turnstile.Widget("ContactTurnstile", { domains: [workersDev], mode: "managed" })
      : { sitekey: "1x00000000000000000000AA", secret: Redacted.make("1x0000000000000000000000000000000AA") };

    // Lead sinks (see src/server/contact.ts). Unset = skipped; the form fails if none is configured.
    const optional = (name: string) => Config.redacted(name).pipe(Config.withDefault(Redacted.make("")));

    const site = yield* Cloudflare.Website.Astro("Website", {
      // Pages are prerendered (`export const prerender = true`) and served straight from the asset
      // layer; the Worker only runs for /api/contact. Output must stay "server": "static" deploys
      // assets-only, which would drop the API route.
      // Canonical/OG/sitemap URLs follow astro.site (src/data/site.ts). Switch to renoir.run once the domain exists.
      ...(workersDev && { name: "renoir" }),
      astro: { output: "server", trailingSlash: "always", ...(workersDev && { site: `https://renoir.${workersDev}` }) },
      assets: { notFoundHandling: "404-page", htmlHandling: "auto-trailing-slash" },
      sessionKVBindingName: false,
      observability: { enabled: true },
      env: {
        THROTTLE: Cloudflare.RateLimit("CONTACT_THROTTLE", { namespaceId: 1001, simple: { limit: 5, period: 60 } }),
        TURNSTILE_SITEKEY: turnstile.sitekey,
        TURNSTILE_SECRET: turnstile.secret,
        TELEGRAM_BOT_TOKEN: yield* optional("TELEGRAM_BOT_TOKEN"),
        TELEGRAM_CHAT_ID: yield* Config.string("TELEGRAM_CHAT_ID").pipe(Config.withDefault("")),
        LEADS_WEBHOOK_URL: yield* optional("LEADS_WEBHOOK_URL"),
        LEADS_WEBHOOK_SECRET: yield* optional("LEADS_WEBHOOK_SECRET"),
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

    return { url: site.url };
  }),
);
