// One-off stack that mints a scoped Cloudflare API token for CI and stores it (plus the account id)
// as GitHub Actions secrets. Run once with an admin profile — confirm with the owner first:
//   bun alchemy profile create admin
//   bun alchemy profile edit --profile admin --add Cloudflare
//   bun alchemy deploy --config stacks/github.ts --profile admin
// The remaining secrets (WORKERS_DEV_SUBDOMAIN, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, LEADS_WEBHOOK_URL,
// LEADS_WEBHOOK_SECRET) are added by hand in the repository settings.
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as GitHub from "alchemy/GitHub";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";

export default Alchemy.Stack(
  "renoir-landing-github",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), GitHub.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const owner = yield* Config.string("GITHUB_OWNER");
    const repository = yield* Config.string("GITHUB_REPO");
    const { accountId } = yield* yield* Cloudflare.CloudflareEnvironment;

    const apiToken = yield* Cloudflare.ApiToken.AccountApiToken("CIToken", {
      accountId,
      policies: [
        {
          effect: "allow",
          permissionGroups: [
            "Workers Scripts Write",
            "Workers KV Storage Write",
            "Workers R2 Storage Write",
            "Turnstile Sites Write",
            "Account Settings Write",
            "Workers Tail Read",
            // Custom domain (renoir.run): DNS record, edge certificate, www redirect rule.
            "Zone Read",
            "DNS Write",
            "Workers Routes Write",
            "Zone Settings Write",
          ],
          resources: { [`com.cloudflare.api.account.${accountId}`]: "*" },
        },
      ],
    });

    yield* GitHub.Secret("cf-api-token", { owner, repository, name: "CLOUDFLARE_API_TOKEN", value: apiToken.value });
    yield* GitHub.Secret("cf-account-id", { owner, repository, name: "CLOUDFLARE_ACCOUNT_ID", value: Redacted.make(accountId) });
  }),
);
