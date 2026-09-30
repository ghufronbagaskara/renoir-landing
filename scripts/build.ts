// Production build through Alchemy's Cloudflare Astro adapter — the exact build `alchemy deploy` runs
// (workerd prerender, passthrough images, /api/contact bundled into the Worker) — without deploying.
// Output: dist/client (static assets) + dist/server (Worker bundle).
//   bun run build
import * as Astro from "@alchemy.run/frontend-frameworks/astro";
import cloudflare from "@alchemy.run/frontend-frameworks/astro/cloudflare";
import * as NodeServices from "@effect/platform-node/NodeServices";
import * as Effect from "effect/Effect";

const program = Effect.gen(function* () {
  const framework = yield* Astro.make({
    target: cloudflare({
      worker: { compatibilityDate: "2026-09-01", compatibilityFlags: ["nodejs_compat"], worker: { name: "renoir-landing", bindings: [] } },
      sessions: false,
    }),
    astro: { output: "server", trailingSlash: "always" },
  });
  const output = yield* framework.build();
  yield* Effect.log(`client: ${output.clientDirectory}`);
  yield* Effect.log(`server modules: ${output.serverModules?.length ?? 0}`);
});

await Effect.runPromise(program.pipe(Effect.provide(NodeServices.layer)));
// Alchemy/workerd can leave an idle handle open on Windows after build() resolves.
process.exit(0);
