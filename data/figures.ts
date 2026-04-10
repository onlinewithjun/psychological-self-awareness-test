import type { FigureCategory, HistoricalFigure } from "@/lib/types";

import { kpopStars } from "@/data/figures/kpop-stars";
import { nbaStars } from "@/data/figures/nba-stars";

export const historicalFigures: HistoricalFigure[] = [...nbaStars, ...kpopStars];

export const figureCategoryOptions: Array<{
  id: FigureCategory;
  label: string;
  description: string;
}> = [
  {
    id: "nba-stars",
    label: "NBA 球星",
    description:
      "15 位代表人物，以 21 世纪球星为主，保留乔丹、魔术师约翰逊、罗德曼等少量上世纪影响力人物。",
  },
  {
    id: "kpop-stars",
    label: "KPOP 明星",
    description:
      "15 位代表人物，围绕 aespa、BLACKPINK、SEVENTEEN、BTS 以及少量高辨识度 solo 艺人。",
  },
];

export function getFigureCategoryMeta(category: FigureCategory) {
  return (
    figureCategoryOptions.find((option) => option.id === category) ??
    figureCategoryOptions[0]
  );
}
