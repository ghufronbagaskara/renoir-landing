// Indonesian labels for the admin UI, reusing the public copy where it exists.
import { quizCopy } from "~/content/quiz";
import { branchOf, type Answers, type Recommendation } from "~/lib/quiz";
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
  const a = JSON.parse(raw) as Answers & { recommendation: Recommendation };
  const q = quizCopy.id.questions;
  const detail = q.detail[branchOf[a.goal]];
  return {
    recommendation: quizCopy.id.results[a.recommendation]?.title ?? a.recommendation,
    rows: [
      [q.goal.title, q.goal.options[a.goal]],
      [q.current.title, q.current.options[a.current]],
      [detail.title, detail.options[a.detail]],
      [q.timing.title, q.timing.options[a.timing]],
    ] as [string, string | undefined][],
  };
}
