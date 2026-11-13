// "Find your first step" questionnaire: answer codes and the deterministic result.
// Shared by the page script and the contact API, so the server re-derives the result from validated codes.

export const industries = ["distribution", "services", "projects", "retail", "education", "digital", "other"] as const;
export const goals = ["workflow", "repetitive", "leads", "usability", "brand", "infra", "unsure"] as const;
export const currents = ["manual", "offtheshelf", "existing", "none"] as const;
export const sizes = ["solo", "small", "mid", "large"] as const;
export const timings = ["now", "quarter", "exploring"] as const;
/** Same codes as the contact form's budget field. */
export const budgets = ["lt10", "10-25", "25-50", "gt50", "discuss"] as const;

/** The fourth question depends on the goal. */
export const branches = {
  handoff: ["one-team", "several-teams", "external"],
  channel: ["referrals", "social", "search", "nothing"],
  stage: ["idea", "prototype", "live"],
  issue: ["slow", "unstable", "updates"],
  priority: ["enquiries", "admin", "product", "unknown"],
} as const;
export type Branch = keyof typeof branches;
export type Goal = (typeof goals)[number];
export type Industry = (typeof industries)[number];

export const branchOf: Record<Goal, Branch> = {
  workflow: "handoff",
  repetitive: "handoff",
  leads: "channel",
  usability: "stage",
  brand: "stage",
  infra: "issue",
  unsure: "priority",
};

/** Recommendation keys line up with the contact form's build types (`discovery` → "unsure"). */
export const recommendations = ["internal", "marketing", "design", "care", "discovery"] as const;
export type Recommendation = (typeof recommendations)[number];
/** How big the first step should be. */
export const scopes = ["mapping", "focused", "phased"] as const;
export type Scope = (typeof scopes)[number];

export interface Answers {
  industry: Industry;
  goal: Goal;
  current: (typeof currents)[number];
  detail: string;
  size: (typeof sizes)[number];
  timing: (typeof timings)[number];
  budget: (typeof budgets)[number];
}
/** Question order on the page. `detail` is the goal-specific branch. */
export const questionOrder = ["industry", "goal", "current", "detail", "size", "timing", "budget"] as const;

const byGoal: Record<Exclude<Goal, "unsure">, Recommendation> = {
  workflow: "internal",
  repetitive: "internal",
  leads: "marketing",
  usability: "design",
  brand: "design",
  infra: "care",
};
const byPriority: Record<(typeof branches.priority)[number], Recommendation> = {
  enquiries: "marketing",
  admin: "internal",
  product: "design",
  unknown: "discovery",
};

const has = <T extends readonly string[]>(list: T, v: unknown): v is T[number] => list.includes(v as string);

/** Validates every code (including the goal's branch) and returns null for anything inconsistent. */
export function parseAnswers(raw: Partial<Record<keyof Answers, unknown>>): Answers | null {
  const { industry, goal, current, detail, size, timing, budget } = raw;
  if (!has(industries, industry) || !has(goals, goal) || !has(currents, current) || !has(sizes, size) || !has(timings, timing) || !has(budgets, budget)) return null;
  if (!(branches[branchOf[goal]] as readonly string[]).includes(detail as string)) return null;
  return { industry, goal, current, detail: detail as string, size, timing, budget };
}

export function recommend(a: Answers): Recommendation {
  if (a.goal === "unsure") return byPriority[a.detail as keyof typeof byPriority];
  return byGoal[a.goal];
}

/** First-step size: map first when the need is open or the budget is small for a system; phase larger teams. */
export function scopeOf(a: Answers, r: Recommendation = recommend(a)): Scope {
  if (r === "discovery" || (a.budget === "lt10" && (r === "internal" || r === "care"))) return "mapping";
  if (a.size === "mid" || a.size === "large" || a.budget === "gt50") return "phased";
  return "focused";
}

/** The real project closest to the visitor's situation. */
export function proofOf(a: Answers, r: Recommendation = recommend(a)) {
  if (r === "internal" || r === "discovery") return a.industry === "projects" ? "field-projects" : "order-sales";
  if (r === "marketing") return a.industry === "education" ? "maxy-ai" : "industrial-coatings";
  if (r === "design") return "maxy-ai";
  return "operations-control";
}
export const proofProjects = ["order-sales", "field-projects", "industrial-coatings", "maxy-ai", "operations-control"] as const;

export const buildTypeOf = (r: Recommendation) => (r === "discovery" ? "unsure" : r);
