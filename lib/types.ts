export type DimensionId =
  | "emotional_variability"
  | "stress_response"
  | "relational_security"
  | "self_evaluation"
  | "decision_style"
  | "boundary_expression"
  | "action_initiation"
  | "self_awareness";

export type DimensionBand =
  | "low"
  | "leaning-low"
  | "balanced"
  | "leaning-high"
  | "high";

export type PoleSide = "low" | "balanced" | "high";

export type Question = {
  id: string;
  dimensionId: DimensionId;
  text: string;
  reverse: boolean;
};

export type PoleProfile = {
  label: string;
  summary: string;
  strengths: string;
  costs: string;
  pressure: string;
  adjustments: string;
  overviewPhrase: string;
};

export type BalancedProfile = {
  label: string;
  summary: string;
  strengths: string;
  costs: string;
  pressure: string;
  adjustments: string;
  overviewPhrase: string;
};

export type DimensionDefinition = {
  id: DimensionId;
  name: string;
  shortName: string;
  description: string;
  lowPole: PoleProfile;
  balanced: BalancedProfile;
  highPole: PoleProfile;
};

export type AnswerMap = Record<string, number>;

export type ScoredDimension = {
  id: DimensionId;
  name: string;
  shortName: string;
  description: string;
  score: number;
  average: number;
  band: DimensionBand;
  side: PoleSide;
  anchorLabel: string;
  oppositeLabel: string;
  currentTendency: string;
  strengths: string;
  costs: string;
  pressureShift: string;
  adjustment: string;
  overviewPhrase: string;
};

export type CombinationInsight = {
  id: string;
  title: string;
  description: string;
  suggestion: string;
};

export type ContextSuggestion = {
  id: "work" | "relationship" | "conflict" | "recovery";
  title: string;
  content: string;
};

export type HistoricalFigure = {
  id: string;
  name: string;
  era: string;
  region: string;
  role: string;
  summary: string;
  resonance: string;
  imagePath: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  scores: Record<DimensionId, number>;
};

export type MatchedFigure = {
  id: string;
  name: string;
  era: string;
  region: string;
  role: string;
  summary: string;
  resonance: string;
  imagePath?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  matchScore: number;
  matchHighlights?: string[];
};

export type DeepInsight = {
  id: string;
  title: string;
  summary: string;
  detail: string;
};

export type GrowthPlanStep = {
  id: string;
  phase: string;
  title: string;
  focus: string;
  rationale: string;
  actions: string[];
  checkpoint: string;
};

export type StoryChoice = {
  id: string;
  label: string;
  summary: string;
  reaction: string;
  effects: Partial<Record<DimensionId, number>>;
};

export type StoryScene = {
  id: string;
  chapter: string;
  title: string;
  setting: string;
  narration: string;
  prompt: string;
  choices: StoryChoice[];
};

export type StoryOutcome = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  reflection: string;
  why: string;
};

export type RiskDetectionResult = {
  hasHighRisk: boolean;
  matches: string[];
};

export type AssessmentReport = {
  generatedAt: string;
  overallSummary: string;
  storyOutcome?: StoryOutcome;
  dimensions: ScoredDimension[];
  combinations: CombinationInsight[];
  contexts: ContextSuggestion[];
  figureReferences: MatchedFigure[];
  deepInsights?: DeepInsight[];
  growthPlan?: GrowthPlanStep[];
  reflectionPrompts?: string[];
  gentleReminders: string[];
  radarData: Array<{
    dimension: string;
    score: number;
  }>;
};

export type SessionRecord = {
  id: string;
  createdAt: string;
  mode?: "survey" | "story";
  note: string;
  answers: AnswerMap;
  report: AssessmentReport;
};

export type AssessmentDraft = {
  id: string;
  createdAt: string;
  note: string;
  answers: AnswerMap;
  questionIndex: number;
};

export type StoryDraft = {
  id: string;
  createdAt: string;
  note: string;
  sceneIndex: number;
  dimensionScores: Record<DimensionId, number>;
  selectedChoiceIds: string[];
  currentChoiceId?: string;
};
