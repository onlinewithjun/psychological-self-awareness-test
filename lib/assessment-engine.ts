import type { AssessmentDraft } from "@/lib/types";

export function makeInitialAssessmentDraft(note = ""): AssessmentDraft {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    note,
    answers: {},
    questionIndex: 0,
  };
}
