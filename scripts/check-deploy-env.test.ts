import { describe, expect, test } from "bun:test";
import { deploymentErrors } from "./check-deploy-env";

const credentials = { CLOUDFLARE_API_TOKEN: "test-token", CLOUDFLARE_ACCOUNT_ID: "a".repeat(32) };
const production = { ...credentials, STAGE: "prod", WORKERS_DEV_SUBDOMAIN: "example.workers.dev" };

describe("Alchemy CI configuration", () => {
  test("reports all missing production settings without attempting cloud calls", () => {
    const errors = deploymentErrors("deploy", { STAGE: "prod" });
    expect(errors).toHaveLength(3);
    for (const name of ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID", "WORKERS_DEV_SUBDOMAIN"]) expect(errors.some(error => error.includes(name))).toBe(true);
  });
  test("accepts production and previews with their respective required settings", () => {
    expect(deploymentErrors("deploy", production)).toEqual([]);
    expect(deploymentErrors("deploy", { ...credentials, STAGE: "pr-2" })).toEqual([]);
    expect(deploymentErrors("cleanup", { ...credentials, STAGE: "pr-2" })).toEqual([]);
  });
  test("rejects an invalid account ID without logging its value", () => {
    const errors = deploymentErrors("deploy", { ...production, CLOUDFLARE_ACCOUNT_ID: "private-invalid-value" });
    expect(errors).toHaveLength(1);
    expect(errors[0]).not.toContain("private-invalid-value");
  });
  test("requires the automatic GitHub token when the PR comment provider is enabled", () => {
    const preview = { ...credentials, STAGE: "pr-2", PULL_REQUEST: "2" };
    for (const operation of ["deploy", "cleanup"]) {
      expect(deploymentErrors(operation, preview)).toEqual(["GITHUB_TOKEN must be passed from secrets.GITHUB_TOKEN for PR deploy/cleanup"]);
      expect(deploymentErrors(operation, { ...preview, GITHUB_TOKEN: "test-github-token" })).toEqual([]);
    }
  });
  test("rejects URLs and Worker URLs in place of an account subdomain", () => {
    for (const hostname of ["https://example.workers.dev", "renoir.example.workers.dev", "example.workers.dev/"]) {
      expect(deploymentErrors("deploy", { ...production, WORKERS_DEV_SUBDOMAIN: hostname })).toHaveLength(1);
    }
  });
  test("never allows cleanup to target production, personal or malformed stages", () => {
    for (const stage of ["prod", "default", "main", "", "pr-0", "pr-2 --stage prod"]) {
      expect(deploymentErrors("cleanup", { ...credentials, STAGE: stage })).toHaveLength(1);
    }
  });
  test("rejects whitespace credentials, unknown operations and undeclared deploy stages", () => {
    expect(deploymentErrors("deploy", { ...production, CLOUDFLARE_API_TOKEN: " " })).toHaveLength(1);
    expect(deploymentErrors("destroy", production)).toHaveLength(1);
    expect(deploymentErrors("deploy", { ...production, STAGE: "main" })).toHaveLength(1);
  });
});
