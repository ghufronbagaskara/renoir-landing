import { describe, expect, test } from "bun:test";
import { parseAnswers, proofOf, recommend, scopeOf, type Answers } from "./quiz";

const base: Answers = { industry: "distribution", goal: "workflow", current: "manual", detail: "several-teams", size: "small", timing: "quarter", budget: "25-50" };

describe("quiz result", () => {
  test("recommendation follows the goal, or the priority when unsure", () => {
    expect(recommend(base)).toBe("internal");
    expect(recommend({ ...base, goal: "leads", detail: "search" })).toBe("marketing");
    expect(recommend({ ...base, goal: "unsure", detail: "unknown" })).toBe("discovery");
  });

  test("first-step size", () => {
    expect(scopeOf(base)).toBe("focused");
    expect(scopeOf({ ...base, budget: "lt10" })).toBe("mapping");
    expect(scopeOf({ ...base, size: "large" })).toBe("phased");
    expect(scopeOf({ ...base, goal: "leads", detail: "search", budget: "lt10" })).toBe("focused");
    expect(scopeOf({ ...base, goal: "unsure", detail: "unknown", size: "large" })).toBe("mapping");
  });

  test("proof project matches the industry", () => {
    expect(proofOf(base)).toBe("order-sales");
    expect(proofOf({ ...base, industry: "projects" })).toBe("field-projects");
    expect(proofOf({ ...base, goal: "leads", detail: "search", industry: "education" })).toBe("maxy-ai");
    expect(proofOf({ ...base, goal: "infra", detail: "slow" })).toBe("operations-control");
  });

  test("validation rejects unknown codes and wrong branches", () => {
    expect(parseAnswers(base)).toEqual(base);
    expect(parseAnswers({ ...base, detail: "slow" })).toBeNull();
    expect(parseAnswers({ ...base, size: "huge" })).toBeNull();
    expect(parseAnswers({ ...base, budget: undefined })).toBeNull();
  });
});
