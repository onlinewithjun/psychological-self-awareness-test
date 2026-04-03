import type { RiskDetectionResult } from "@/lib/types";

const highRiskPatterns = [
  /自杀/g,
  /轻生/g,
  /想死/g,
  /不想活/g,
  /活不下去/g,
  /结束生命/g,
  /结束自己/g,
  /了结自己/g,
  /自伤/g,
  /伤害自己/g,
  /割腕/g,
  /毁掉自己/g,
  /没有活下去的意义/g,
  /撑不下去/g,
  /绝望/g,
  /消失算了/g,
  /伤害别人/g,
  /报复所有人/g,
  /kill myself/gi,
  /suicide/gi,
  /self-harm/gi,
  /hurt myself/gi,
];

export function detectHighRiskExpression(input: string): RiskDetectionResult {
  if (!input.trim()) {
    return { hasHighRisk: false, matches: [] };
  }

  const matches = new Set<string>();

  for (const pattern of highRiskPatterns) {
    const found = input.match(pattern);

    if (found) {
      for (const item of found) {
        matches.add(item);
      }
    }
  }

  return {
    hasHighRisk: matches.size > 0,
    matches: Array.from(matches),
  };
}
