// Runs every built-site Chrome check against `scripts/serve.ts`, then the Worker end-to-end test.
// Same command locally and in GitHub Actions:  bun run build && bun run test:browser
import { spawn, spawnSync } from "node:child_process";

const PORT = process.env.PORT ?? "4322";
const base = `http://localhost:${PORT}`;
const checks = [
  "check-funnel",
  "check-offcanvas-feedback",
  "check-mobile-layout",
  "check-mobile-density",
  "check-home-refresh",
  "check-home-feedback",
  "check-notes-search-mobile",
  "check-work-mobile-feedback",
  "check-work-badges",
  "check-motion",
];

const server = spawn(process.execPath, ["scripts/serve.ts"], { env: { ...process.env, PORT }, stdio: "ignore" });
const failed: string[] = [];
try {
  for (let i = 0; ; i++) {
    if ((await fetch(base).catch(() => null))?.ok) break;
    if (i > 100) throw new Error(`static server did not start on ${base}`);
    await new Promise((r) => setTimeout(r, 200));
  }
  for (const name of checks) {
    console.log(`\n== ${name}`);
    const { status } = spawnSync("node", [`scripts/${name}.mjs`, base], { stdio: "inherit" });
    if (status !== 0) failed.push(name);
  }
} finally {
  server.kill();
}
console.log("\n== e2e-worker");
if (spawnSync(process.execPath, ["scripts/e2e-worker.ts"], { stdio: "inherit" }).status !== 0) failed.push("e2e-worker");

console.log(failed.length ? `\nFAILED: ${failed.join(", ")}` : `\nPASS: ${checks.length} browser check suites and the Worker end-to-end test`);
process.exit(failed.length ? 1 : 0);
