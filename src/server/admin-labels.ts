// Indonesian labels for the admin UI, reusing the public copy where it exists.
import { quizCopy } from "~/content/quiz";
import { branchOf, type Answers, type Recommendation, type Scope } from "~/lib/quiz";
import id from "~/i18n/id";
import type { LeadStatus } from "./db";

export const statusLabel: Record<LeadStatus, string> = {
  new: "Baru",
  contacted: "Dihubungi",
  qualified: "Layak",
  won: "Menang",
  lost: "Tidak lanjut",
};

export const typeLabel: Record<string, string> = id.form.buildTypes;

/** Question → chosen answer, in Indonesian, for the lead detail page. */
export function quizAnswers(raw: string | null) {
  if (!raw) return null;
  // Older leads (four-question version) lack industry/size/budget/scope; those rows are skipped.
  const a = JSON.parse(raw) as Partial<Answers> & { goal: Answers["goal"]; recommendation: Recommendation; scope?: Scope };
  const c = quizCopy.id;
  const q = c.questions;
  const detail = q.detail[branchOf[a.goal]];
  const rows: [string, string | undefined][] = [
    [q.industry.title, a.industry && q.industry.options[a.industry]],
    [q.goal.title, q.goal.options[a.goal]],
    [q.current.title, a.current && q.current.options[a.current]],
    [detail.title, a.detail && detail.options[a.detail]],
    [q.size.title, a.size && q.size.options[a.size]],
    [q.timing.title, a.timing && q.timing.options[a.timing]],
    [q.budget.title, a.budget && q.budget.options[a.budget]],
  ];
  return {
    recommendation: c.results[a.recommendation]?.title ?? a.recommendation,
    scope: a.scope && c.scopes[a.scope]?.title,
    rows: rows.filter(([, answer]) => answer),
  };
}
