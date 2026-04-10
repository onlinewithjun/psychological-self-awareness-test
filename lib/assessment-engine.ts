import type { AssessmentDraft, FigureCategory } from "@/lib/types";

export function makeInitialAssessmentDraft(
  note = "",
  figureCategory: FigureCategory = "all",
): AssessmentDraft {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    note,
    figureCategory,
    answers: {},
    questionIndex: 0,
  };
}
