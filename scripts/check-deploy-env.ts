type Environment = Record<string, string | undefined>;

export function deploymentErrors(operation: string, env: Environment): string[] {
  const errors: string[] = [];
  const stage = env.STAGE ?? "";
  if (operation !== "deploy" && operation !== "cleanup") return ["Expected deploy or cleanup operation"];
  if (operation === "cleanup" ? !/^pr-[1-9]\d*$/.test(stage) : stage !== "prod" && !/^pr-[1-9]\d*$/.test(stage)) {
    errors.push(operation === "cleanup" ? "Cleanup only accepts a pr-<number> stage; refusing to destroy any other stage" : "STAGE must be prod or pr-<number>");
  }
  for (const key of ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"]) {
    if (!env[key]?.trim()) errors.push(`${key} is missing from GitHub Actions configuration`);
  }
  if (env.PULL_REQUEST && !env.GITHUB_TOKEN?.trim()) errors.push("GITHUB_TOKEN must be passed from secrets.GITHUB_TOKEN for PR deploy/cleanup");
  if (env.CLOUDFLARE_ACCOUNT_ID?.trim() && !/^[a-f0-9]{32}$/i.test(env.CLOUDFLARE_ACCOUNT_ID)) {
    errors.push("CLOUDFLARE_ACCOUNT_ID must be a 32-character Cloudflare account ID");
  }
  if (operation === "deploy" && stage === "prod") {
    if (!env.WORKERS_DEV_SUBDOMAIN?.trim()) errors.push("WORKERS_DEV_SUBDOMAIN is missing from GitHub Actions configuration");
    else if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.workers\.dev$/i.test(env.WORKERS_DEV_SUBDOMAIN)) {
      errors.push("WORKERS_DEV_SUBDOMAIN must be the account hostname, such as yourname.workers.dev, without https:// or a Worker name");
    }
  }
  return errors;
}

if (import.meta.main) {
  const errors = deploymentErrors(process.argv[2] ?? "", process.env);
  for (const error of errors) console.error(`::error title=Alchemy CI configuration::${error}`);
  if (errors.length) {
    console.error("See docs/deployment.md. Local Alchemy profiles and .env values are not copied to GitHub Actions.");
    process.exit(1);
  }
  console.log("Alchemy CI configuration is present; credentials have not been verified against Cloudflare");
}
