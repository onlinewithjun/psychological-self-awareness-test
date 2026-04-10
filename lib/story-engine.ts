import { initialStoryScores, storyScenes } from "@/data/story";
import type {
  DimensionId,
  FigureCategory,
  StoryChoice,
  StoryDraft,
} from "@/lib/types";

const storyChoiceMap = new Map<string, StoryChoice>(
  storyScenes.flatMap((scene) => scene.choices.map((choice) => [choice.id, choice])),
);

export function getStoryChoice(choiceId?: string) {
  if (!choiceId) {
    return null;
  }

  return storyChoiceMap.get(choiceId) ?? null;
}

export function calculateStoryScores(
  selectedChoiceIds: string[],
): Record<DimensionId, number> {
  const scores = { ...initialStoryScores };

  for (const choiceId of selectedChoiceIds) {
    const choice = getStoryChoice(choiceId);

    if (!choice) {
      continue;
    }

    for (const [dimensionId, delta] of Object.entries(choice.effects)) {
      const key = dimensionId as DimensionId;
      const current = scores[key] ?? initialStoryScores[key];
      scores[key] = Math.min(100, Math.max(0, current + (delta ?? 0)));
    }
  }

  return scores;
}

export function makeInitialStoryDraft(
  note = "",
  figureCategory: FigureCategory = "all",
): StoryDraft {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    note,
    figureCategory,
    sceneIndex: 0,
    dimensionScores: { ...initialStoryScores },
    selectedChoiceIds: [],
    currentChoiceId: undefined,
  };
}
