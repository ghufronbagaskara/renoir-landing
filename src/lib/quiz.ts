// "Find your first step" questionnaire: answer codes and the deterministic recommendation.
// Shared by the page script and the contact API, so the server re-derives the result from validated codes.

export const goals = ["workflow", "repetitive", "leads", "usability", "brand", "infra", "unsure"] as const;
export const currents = ["manual", "existing", "none"] as const;
export const timings = ["now", "quarter", "exploring"] as const;

/** The third question depends on the goal. */
export const branches = {
  handoff: ["one-team", "several-teams", "external"],
  channel: ["referrals", "social", "search", "nothing"],
  stage: ["idea", "prototype", "live"],
  issue: ["slow", "unstable", "updates"],
  priority: ["enquiries", "admin", "product", "unknown"],
} as const;
export type Branch = keyof typeof branches;
export type Goal = (typeof goals)[number];

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

export interface Answers {
  goal: Goal;
  current: (typeof currents)[number];
  detail: string;
  timing: (typeof timings)[number];
}

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

/** Validates codes (including the goal's branch) and returns null for anything inconsistent. */
export function parseAnswers(raw: Partial<Record<keyof Answers, unknown>>): Answers | null {
  const { goal, current, detail, timing } = raw;
  if (!goals.includes(goal as Goal) || !currents.includes(current as never) || !timings.includes(timing as never)) return null;
  if (!(branches[branchOf[goal as Goal]] as readonly string[]).includes(detail as string)) return null;
  return raw as Answers;
}

export function recommend(a: Answers): Recommendation {
  if (a.goal === "unsure") return byPriority[a.detail as keyof typeof byPriority];
  return byGoal[a.goal];
}

export const buildTypeOf = (r: Recommendation) => (r === "discovery" ? "unsure" : r);
