import type { FigureCategory, HistoricalFigure } from "@/lib/types";

type FigureSeed = Omit<HistoricalFigure, "imageAlt" | "resonance"> & {
  imageAlt?: string;
  resonance?: string;
};

export function makeScores(
  emotionalVariability: number,
  stressResponse: number,
  relationalSecurity: number,
  selfEvaluation: number,
  decisionStyle: number,
  boundaryExpression: number,
  actionInitiation: number,
  selfAwareness: number,
) {
  return {
    emotional_variability: emotionalVariability,
    stress_response: stressResponse,
    relational_security: relationalSecurity,
    self_evaluation: selfEvaluation,
    decision_style: decisionStyle,
    boundary_expression: boundaryExpression,
    action_initiation: actionInitiation,
    self_awareness: selfAwareness,
  };
}

const resonanceByCategory: Record<Exclude<FigureCategory, "all">, string> = {
  "nba-stars":
    "如果你在压力下更容易把能量转成竞争、执行或节奏控制，这类球星更像一种行动风格上的参照。",
  "kpop-stars":
    "如果你在表达、关系感、公开压力和长期训练之间不断切换，这类人物更容易和你的当下状态形成共鸣。",
  "ancient-chinese":
    "如果你的画像更偏向长期修养、关系分寸、价值判断或处世节奏，这类古代人物更像一种气质和方法上的参照。",
  scientists:
    "如果你更习惯用观察、推理、好奇心与长期投入来组织自己，这类科学家更像一种认知方式上的参照。",
};

export function createFigure(seed: FigureSeed): HistoricalFigure {
  return {
    imageAlt: `${seed.name}参考肖像`,
    imageFit: "cover",
    imagePosition: "50% 20%",
    resonance: seed.category
      ? resonanceByCategory[seed.category]
      : "这是一种帮助你理解当下模式的参考，并不意味着你和该人物是同一种人。",
    ...seed,
  };
}

export const categoryPlaceholderMap: Record<
  Exclude<FigureCategory, "all">,
  string
> = {
  "nba-stars": "/figures/placeholder-nba.svg",
  "kpop-stars": "/figures/placeholder-kpop.svg",
  "ancient-chinese": "/figures/placeholder-ancient.svg",
  scientists: "/figures/placeholder-science.svg",
};
