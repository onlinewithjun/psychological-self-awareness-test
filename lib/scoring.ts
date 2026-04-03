import { dimensionOrder, dimensions, questions } from "@/data/assessment";
import { historicalFigures } from "@/data/figures";
import { storyOutcomes } from "@/data/story";
import {
  type AnswerMap,
  type AssessmentReport,
  type CombinationInsight,
  type ContextSuggestion,
  type DeepInsight,
  type DimensionBand,
  type DimensionId,
  type GrowthPlanStep,
  type MatchedFigure,
  type PoleSide,
  type ScoredDimension,
  type StoryOutcome,
} from "@/lib/types";
import { clamp } from "@/lib/utils";

function getBand(score: number): DimensionBand {
  if (score <= 35) {
    return "low";
  }

  if (score <= 45) {
    return "leaning-low";
  }

  if (score < 55) {
    return "balanced";
  }

  if (score < 65) {
    return "leaning-high";
  }

  return "high";
}

function getSide(band: DimensionBand): PoleSide {
  if (band === "balanced") {
    return "balanced";
  }

  return band.includes("low") ? "low" : "high";
}

function getIntensityPrefix(band: DimensionBand) {
  switch (band) {
    case "low":
      return "当前更靠近";
    case "leaning-low":
      return "当前略偏向";
    case "leaning-high":
      return "当前略偏向";
    case "high":
      return "当前更靠近";
    default:
      return "目前更接近";
  }
}

function scoreDimension(dimensionId: DimensionId, answers: AnswerMap): ScoredDimension {
  const definition = dimensions[dimensionId];
  const dimensionQuestions = questions.filter(
    (question) => question.dimensionId === dimensionId,
  );

  const transformedValues = dimensionQuestions.map((question) => {
    const answer = answers[question.id] ?? 3;
    return question.reverse ? 6 - answer : answer;
  });

  const average =
    transformedValues.reduce((total, value) => total + value, 0) /
    transformedValues.length;
  const score = clamp(((average - 1) / 4) * 100, 0, 100);
  const band = getBand(score);
  const side = getSide(band);

  if (side === "balanced") {
    return {
      id: definition.id,
      name: definition.name,
      shortName: definition.shortName,
      description: definition.description,
      score,
      average,
      band,
      side,
      anchorLabel: definition.balanced.label,
      oppositeLabel: `${definition.lowPole.label} / ${definition.highPole.label}`,
      currentTendency: `目前更接近中段状态。${definition.balanced.summary}`,
      strengths: definition.balanced.strengths,
      costs: definition.balanced.costs,
      pressureShift: definition.balanced.pressure,
      adjustment: definition.balanced.adjustments,
      overviewPhrase: definition.balanced.overviewPhrase,
    };
  }

  const profile = side === "low" ? definition.lowPole : definition.highPole;
  const oppositeLabel =
    side === "low" ? definition.highPole.label : definition.lowPole.label;

  return {
    id: definition.id,
    name: definition.name,
    shortName: definition.shortName,
    description: definition.description,
    score,
    average,
    band,
    side,
    anchorLabel: profile.label,
    oppositeLabel,
    currentTendency: `${getIntensityPrefix(band)}「${profile.label}」这一侧。${profile.summary}`,
    strengths: profile.strengths,
    costs: profile.costs,
    pressureShift: profile.pressure,
    adjustment: profile.adjustments,
    overviewPhrase: profile.overviewPhrase,
  };
}

function scoreDimensionFromScore(
  dimensionId: DimensionId,
  score: number,
): ScoredDimension {
  const definition = dimensions[dimensionId];
  const clampedScore = clamp(score, 0, 100);
  const average = 1 + (clampedScore / 100) * 4;
  const band = getBand(clampedScore);
  const side = getSide(band);

  if (side === "balanced") {
    return {
      id: definition.id,
      name: definition.name,
      shortName: definition.shortName,
      description: definition.description,
      score: clampedScore,
      average,
      band,
      side,
      anchorLabel: definition.balanced.label,
      oppositeLabel: `${definition.lowPole.label} / ${definition.highPole.label}`,
      currentTendency: `目前更接近中段状态。${definition.balanced.summary}`,
      strengths: definition.balanced.strengths,
      costs: definition.balanced.costs,
      pressureShift: definition.balanced.pressure,
      adjustment: definition.balanced.adjustments,
      overviewPhrase: definition.balanced.overviewPhrase,
    };
  }

  const profile = side === "low" ? definition.lowPole : definition.highPole;
  const oppositeLabel =
    side === "low" ? definition.highPole.label : definition.lowPole.label;

  return {
    id: definition.id,
    name: definition.name,
    shortName: definition.shortName,
    description: definition.description,
    score: clampedScore,
    average,
    band,
    side,
    anchorLabel: profile.label,
    oppositeLabel,
    currentTendency: `${getIntensityPrefix(band)}「${profile.label}」这一侧。${profile.summary}`,
    strengths: profile.strengths,
    costs: profile.costs,
    pressureShift: profile.pressure,
    adjustment: profile.adjustments,
    overviewPhrase: profile.overviewPhrase,
  };
}

function buildOverallSummary(scoredDimensions: ScoredDimension[]) {
  const salient = [...scoredDimensions]
    .sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50))
    .slice(0, 3);

  const phrase = salient.map((item) => item.overviewPhrase).join("，");

  return `这份结果更像是你当前状态的一张多维切片，而不是对你的固定定义。现在的你${phrase}。这些倾向会随着阶段、关系、工作负荷和安全感变化而变化，所以更适合被当作理解自己的线索，而不是结论。`;
}

function buildCombinationInsights(
  lookup: Record<DimensionId, ScoredDimension>,
): CombinationInsight[] {
  const high = (id: DimensionId, threshold = 65) => lookup[id].score >= threshold;
  const low = (id: DimensionId, threshold = 35) => lookup[id].score <= threshold;
  const mediumOrHigh = (id: DimensionId, threshold = 55) =>
    lookup[id].score >= threshold;

  const insights: CombinationInsight[] = [];

  if (
    high("emotional_variability") &&
    high("self_evaluation") &&
    low("boundary_expression", 45)
  ) {
    insights.push({
      id: "sensitive-inner-load",
      title: "细致敏感，但也更容易向内消耗",
      description:
        "当你对环境和关系变化很敏锐、又习惯先要求自己，同时边界表达偏含蓄时，外界一点点起伏都可能转成内在负担。你不是不够能扛，而是太容易一边感受、一边承担。",
      suggestion:
        "这类组合特别需要把“我感受到了什么”与“我要不要都接住”分开。边界表达哪怕只前进一步，都会明显减轻消耗。",
    });
  }

  if (high("decision_style") && low("action_initiation", 45)) {
    insights.push({
      id: "analysis-delay",
      title: "想得很周全，但启动门槛会被抬高",
      description:
        "你更重视把事情想清楚，这本身是优势。但当审慎和启动迟缓同时出现时，决定过程会拖慢行动，让任务在真正开始前就积累压力。",
      suggestion:
        "对需要推进的事情，试着把“做决定”和“开始行动”拆开。先允许一个临时决定，再给出很小的第一步。",
    });
  }

  if (high("relational_security", 60) && low("boundary_expression", 45)) {
    insights.push({
      id: "relationship-overextension",
      title: "关系里容易先顾全连接，再顾及自己",
      description:
        "当你很在意关系温度、又不太习惯直接表达限制时，容易出现“先答应、再疲惫”或“先忍住、事后委屈”的模式。",
      suggestion:
        "这不一定需要变强硬，而是更早表达真实承受范围。温和而清楚的界限，往往比事后消耗更能保护关系。",
    });
  }

  if (
    high("stress_response") &&
    mediumOrHigh("action_initiation", 60) &&
    low("self_awareness", 50)
  ) {
    insights.push({
      id: "push-through-mode",
      title: "高压下容易靠继续推进来稳住自己",
      description:
        "当压力上来你会迅速进入处理模式，又具备推进力，但自我觉察相对靠后时，很容易一边做事一边透支，直到很累了才发现自己已经超载。",
      suggestion:
        "你的重点不是再提高执行力，而是在推进节奏中加进检查点。越能早点看见自己的耗损，推进力越能变成稳定优势。",
    });
  }

  if (low("emotional_variability", 40) && low("self_awareness", 40)) {
    insights.push({
      id: "late-awareness",
      title: "表面稳得住，但状态变化可能会后知后觉",
      description:
        "你可能并不容易被情绪带走，也习惯先把事情做完。与此同时，自己的疲惫、失望或不舒服可能要过一阵才真正被你看到。",
      suggestion:
        "这类组合不一定会让你马上难受，但更需要定期停下来确认：我是真的还好，还是只是一直没空感受？",
    });
  }

  if (
    mediumOrHigh("self_awareness", 60) &&
    mediumOrHigh("boundary_expression", 60) &&
    mediumOrHigh("action_initiation", 55)
  ) {
    insights.push({
      id: "self-regulation-potential",
      title: "你具备把感受、边界和行动连起来的潜力",
      description:
        "当你能较早看见自己的状态，也敢于表达界限，并且具备一定行动推进力时，通常更容易形成稳定的自我调节闭环。",
      suggestion:
        "继续保留这种优势。对你来说，更重要的不是“再努力一点”，而是把这种能力持续用在真正重要的场景里。",
    });
  }

  if (insights.length === 0) {
    const salient = Object.values(lookup)
      .sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50))
      .slice(0, 2);

    insights.push({
      id: "general-pattern",
      title: "当前画像更像一个会随情境移动的模式组合",
      description: `从这次结果看，你在「${salient[0]?.shortName}」和「${salient[1]?.shortName}」上的特征更明显。与其把它理解成类型，不如把它理解成你在当前阶段更常启动的应对方式。`,
      suggestion:
        "之后如果在不同阶段再次测量，重点不是看自己“变成了谁”，而是观察哪些模式在变强、哪些正在被你重新调整。",
    });
  }

  return insights.slice(0, 3);
}

function buildContextSuggestions(
  lookup: Record<DimensionId, ScoredDimension>,
): ContextSuggestion[] {
  const workParts = [];

  if (lookup.decision_style.score >= 60 && lookup.action_initiation.score <= 45) {
    workParts.push(
      "工作里你可能更适合先把复杂问题想透，但要小心“还没开始就已经很累”的情况。",
    );
  } else if (
    lookup.decision_style.score <= 45 &&
    lookup.action_initiation.score >= 55
  ) {
    workParts.push(
      "你在工作中更适合先推进、再修正，尤其适合节奏快、需要滚动迭代的任务。",
    );
  } else {
    workParts.push(
      "你在工作里通常能在思考与推进之间找到某种平衡，但忙起来时仍要留意节奏被什么打乱。",
    );
  }

  if (lookup.stress_response.score >= 65) {
    workParts.push("高压阶段尤其需要给自己设定停止线，不然很容易越认真越绷。");
  }

  const relationshipParts = [];

  if (
    lookup.relational_security.score >= 60 &&
    lookup.boundary_expression.score <= 45
  ) {
    relationshipParts.push(
      "亲密关系里，你可能很在意彼此温度，也更容易先顾及关系气氛，因此更需要练习把真实承受范围说出来。",
    );
  } else if (lookup.relational_security.score <= 45) {
    relationshipParts.push(
      "你通常能在关系里保留相对稳定的空间感，这有助于减少不必要的拉扯。",
    );
  } else {
    relationshipParts.push(
      "你在关系里既在意连接，也需要独立空间；关键是识别哪些场景会让这份平衡被打破。",
    );
  }

  const conflictParts = [];

  if (lookup.boundary_expression.score >= 60) {
    conflictParts.push("冲突情境里，你更容易把立场说清楚，这有助于减少模糊消耗。");
  } else {
    conflictParts.push(
      "冲突情境里，你可能更想先把场面维持住，而不是立刻表达不同意。",
    );
  }

  if (lookup.emotional_variability.score >= 65) {
    conflictParts.push("如果当下情绪反应较强，先把感受和事实拆开，会比立刻下结论更稳。");
  }

  const recoveryParts = [];

  if (lookup.self_awareness.score >= 60) {
    recoveryParts.push("独处和恢复对你来说，不只是休息，更是重新整理内在信号的时间。");
  } else {
    recoveryParts.push(
      "恢复阶段可以先做很轻的状态识别，而不是逼自己一下子说清所有感受。",
    );
  }

  if (lookup.action_initiation.score <= 45) {
    recoveryParts.push("当你状态差时，恢复动作也要足够小，否则你可能连“开始照顾自己”都被拖住。");
  } else {
    recoveryParts.push("把恢复当成日程里可执行的一部分，会比“等有空再说”更有效。");
  }

  return [
    {
      id: "work",
      title: "工作情境",
      content: workParts.join(" "),
    },
    {
      id: "relationship",
      title: "亲密关系情境",
      content: relationshipParts.join(" "),
    },
    {
      id: "conflict",
      title: "冲突或压力情境",
      content: conflictParts.join(" "),
    },
    {
      id: "recovery",
      title: "独处与恢复情境",
      content: recoveryParts.join(" "),
    },
  ];
}

function buildGentleReminders(
  lookup: Record<DimensionId, ScoredDimension>,
): string[] {
  const reminders: string[] = [];
  const distressCluster = [
    lookup.emotional_variability.score,
    lookup.stress_response.score,
    lookup.relational_security.score,
    lookup.self_evaluation.score,
  ];
  const distressAverage =
    distressCluster.reduce((total, score) => total + score, 0) /
    distressCluster.length;

  if (distressAverage >= 72) {
    reminders.push(
      "你当前在情绪、压力、关系或自我评价上的负荷可能偏高。如果这些状态已经持续影响睡眠、饮食、工作学习或关系，建议考虑寻求专业支持。",
    );
  }

  if (lookup.action_initiation.score <= 25) {
    reminders.push(
      "如果你发现自己不是偶尔拖慢，而是长期很难启动、连基本事务都明显受影响，可以把它当成需要被认真照顾的信号，而不是单纯责怪自己。",
    );
  }

  if (lookup.self_awareness.score <= 25) {
    reminders.push(
      "如果你经常只有在非常难受时才意识到自己已经超载，后续可以优先练习更早识别状态，而不是等到撑不住才处理。",
    );
  }

  if (reminders.length === 0) {
    reminders.push(
      "如果某些倾向在未来一段时间持续加重，并明显影响到你的生活功能，这份报告最适合成为一个提醒：你可以考虑向专业支持靠近一步。",
    );
  }

  return reminders;
}

function buildDeepInsights(
  lookup: Record<DimensionId, ScoredDimension>,
): DeepInsight[] {
  const emotional = lookup.emotional_variability.score;
  const stress = lookup.stress_response.score;
  const awareness = lookup.self_awareness.score;
  const relational = lookup.relational_security.score;
  const boundary = lookup.boundary_expression.score;
  const selfEvaluation = lookup.self_evaluation.score;
  const decision = lookup.decision_style.score;
  const action = lookup.action_initiation.score;

  const regulationInsight: DeepInsight =
    emotional >= 65 && stress >= 65
      ? {
          id: "regulation-system",
          title: "情绪调节与神经系统负荷",
          summary:
            "你的系统更容易对外界变化快速起反应，尤其在不确定和高要求并存时，会更快进入高唤醒状态。",
          detail:
            awareness >= 55
              ? "从专业视角看，这更像是“感受系统很敏锐，警觉系统也容易被点亮”。好处是你能更早发现风险、气氛和变化；代价是你的恢复窗口会被压缩。你已经具备一定觉察力，下一步关键不是继续分析，而是更早把觉察转成降载动作，例如暂停输入、拉开节奏、先处理最关键的一件事。"
              : "从专业视角看，这更像是“感受系统很敏锐，警觉系统也容易被点亮”，但自我觉察跟不上负荷上升的速度。好处是你在复杂环境里反应快；代价是你可能要到明显累、烦或撑不住时，才发现自己已经超载。对你最有帮助的不是讲道理，而是建立更早的身体和情绪识别点。",
        }
      : emotional <= 40 && awareness <= 40
        ? {
            id: "regulation-system",
            title: "情绪调节与神经系统负荷",
            summary:
              "你更擅长把自己维持在可工作的状态里，但也可能因为太能撑住，而晚一点才看见消耗。",
            detail:
              "从专业视角看，这类模式常见于“功能维持优先”的应对方式。它的优势是外界很难轻易把你打散；代价是你的系统会把很多不适延后处理。对普通人来说，可以把它理解为：你不是没感觉，而是感觉经常排在任务后面。真正重要的训练不是让自己变敏感，而是更早给恢复留位置。",
          }
        : {
            id: "regulation-system",
            title: "情绪调节与神经系统负荷",
            summary:
              "你的调节系统整体处在可回稳状态，但在连续压力、复杂关系或疲惫积累时，稳定度仍会明显下降。",
            detail:
              "从专业角度看，这是一种“有弹性但会被情境放大”的调节模式。你并不是完全失控，也不是完全不受影响，而是会在特定场景里更容易偏向某一侧。对你来说，比追求永久稳定更重要的，是识别哪些情境最容易让你失去原本的节奏。",
          };

  const relationshipInsight: DeepInsight =
    relational >= 60 && boundary <= 45
      ? {
          id: "relationship-system",
          title: "关系安全感、边界与自我价值",
          summary:
            "你对关系温度和他人状态很敏感，也更容易先顾及连接，再顾及自己的承受范围。",
          detail:
            selfEvaluation >= 60
              ? "从更深一层的心理机制看，这种组合常意味着：你不只是怕关系变冷，也容易把关系里的波动解释成“是不是我哪里不够好”。这样一来，边界表达就更难，因为说不、停一下或提出限制，很容易被内化成“我是不是不够体贴”。真正要练的不是强硬，而是把“表达边界”和“否定关系”分开。"
              : "从更深一层的心理机制看，这种组合常意味着：你很重视连接，也习惯先保证关系不破。它的优势是体谅、细腻、合作感强；代价是你可能把很多本该协商的负担，提前自己扛了。对你最有帮助的，不是突然变得锋利，而是把边界说得更早、更小、更具体。",
        }
      : boundary >= 60
        ? {
            id: "relationship-system",
            title: "关系安全感、边界与自我价值",
            summary:
              "你通常能在关系里保留自己的位置，也更愿意用清楚表达来减少模糊和消耗。",
            detail:
              "从专业角度看，这说明你已经具备一定的关系分化能力：你可以在在意关系的同时，不完全失去自己的判断和界限。接下来的重点不是把边界做得更硬，而是继续提升表达方式的温度和时机，让清晰既保护你，也保护关系。"
          }
        : {
            id: "relationship-system",
            title: "关系安全感、边界与自我价值",
            summary:
              "你的关系系统整体是可调节的，但在特别在意的人、强评价环境或冲突情境里，原本的平衡可能被打破。",
            detail:
              "从专业视角看，这是一种比较常见的“情境型偏移”模式。也就是说，你不是任何关系里都一样，而是某些对象会更容易点亮你的连接需求、愧疚感或防御反应。真正值得观察的，不只是你总体是什么样的人，而是你在哪类关系里更容易失去自己的稳定。"
          };

  const executionInsight: DeepInsight =
    decision >= 65 && action <= 45
      ? {
          id: "execution-system",
          title: "决策、启动与执行节奏",
          summary:
            "你会倾向先把事情想清楚，这让判断更稳，但也容易把启动门槛越抬越高。",
          detail:
            "从执行功能角度看，这不是能力不足，而更像是“评估系统过强、启动系统受压”。你对后果、质量和完整性的敏感，会让开始之前的心理成本变高。对普通人来说，可以把它理解为：你常常不是不会做，而是还没做就已经在脑中消耗了很多。最有效的策略通常不是逼自己更自律，而是把任务切到一个足够小的起点。",
        }
      : action >= 60 && stress >= 65
        ? {
            id: "execution-system",
            title: "决策、启动与执行节奏",
            summary:
              "你有明显的推进力，也很可能在压力里继续靠行动感稳住自己。",
          detail:
              "这类模式的优势是高执行、高承担、遇事不容易瘫住；代价是你可能把“继续推进”也当成了调节情绪的方式。短期看它很有效，长期看容易让疲惫被动作掩盖。真正重要的不是削弱你的行动力，而是在流程里强制加入停顿、复盘和减载点。",
        }
        : {
            id: "execution-system",
            title: "决策、启动与执行节奏",
            summary:
              "你的决策和执行系统整体具备一定弹性，会随事情的重要程度、意义感和当下负荷而变化。",
            detail:
              "从专业视角看，这说明你不是单一的“拖延型”或“行动型”，而更像在不同条件下切换策略。真正决定你表现的，往往不是人格定型，而是任务清晰度、外部压力和身体资源是否充足。对你最有帮助的，是更早识别自己在什么条件下会明显变慢，什么条件下又会顺起来。",
          };

  return [regulationInsight, relationshipInsight, executionInsight];
}

function buildGrowthPlan(
  lookup: Record<DimensionId, ScoredDimension>,
): GrowthPlanStep[] {
  const distressAverage =
    [
      lookup.emotional_variability.score,
      lookup.stress_response.score,
      lookup.self_awareness.score,
    ].reduce((total, score) => total + score, 0) / 3;

  const regulationPlan: GrowthPlanStep =
    distressAverage >= 60 || lookup.self_awareness.score <= 45
      ? {
          id: "stabilize-system",
          phase: "第 1-2 周",
          title: "先稳住系统，不急着改人格",
          focus: "优先降低日常高唤醒与迟到的觉察。",
          rationale:
            "当系统已经偏紧时，任何边界、沟通或行动训练都容易半路失效。先让自己更早发现负荷，后面的改变才接得住。",
          actions: [
            "每天固定两次做 30 秒状态点名：我现在更像是累、紧、烦，还是空。",
            "把当天最容易让你绷起来的触发点记 1 条，不追求全面，只追求具体。",
            "一旦发现自己明显过载，先做一个减载动作，例如关掉一个输入源、把任务减到最小步骤、离开当前场景 3 分钟。",
          ],
          checkpoint:
            "如果两周后你已经能更早发现自己快绷住了，这一步就是有效的，不必要求自己马上彻底稳定。",
        }
      : {
          id: "stabilize-system",
          phase: "第 1-2 周",
          title: "保持已有稳定性",
          focus: "巩固你原本的回稳能力，不让它只在好状态时才存在。",
          rationale:
            "你的系统并非特别脆弱，重点不是大修，而是把现有的调节能力变成更稳定的习惯。",
          actions: [
            "保留一个固定恢复动作，例如晚间散步、写三句日记或睡前降输入。",
            "连续忙碌时加一个外部停止线，比如完成 90 分钟后强制离开 5 分钟。",
            "记录最能帮助你回稳的 2 个动作，作为以后复用的个人恢复清单。",
          ],
          checkpoint:
            "如果你能在忙的时候依然记得做恢复动作，而不是等完全耗尽再补救，说明这一步在起作用。",
        };

  const relationshipPlan: GrowthPlanStep =
    lookup.boundary_expression.score <= 45 ||
    lookup.relational_security.score >= 60 ||
    lookup.self_evaluation.score >= 60
      ? {
          id: "rebuild-boundaries",
          phase: "第 2-4 周",
          title: "把关系里的真实承受范围说出来",
          focus: "练习更早表达界限，同时减少把一切都收归为自己的问题。",
          rationale:
            "很多关系消耗并不是因为你不够善良，而是你太晚表达限制，或太快把波动解释成自己的责任。",
          actions: [
            "准备 3 句可直接使用的边界句，例如“我需要想一下”“这次我接不住”“我在意，但我需要一点时间整理”。",
            "每次关系不安上来时，先问自己：这是事实，还是我已经开始替关系做解释。",
            "如果你容易自责，把每次冲突拆成三栏：对方做了什么、我感受到什么、哪些责任不全是我的。",
          ],
          checkpoint:
            "当你开始能更早说出限制、也更少在关系波动后立刻全怪自己时，这一步就已经在改善系统。",
        }
      : {
          id: "rebuild-boundaries",
          phase: "第 2-4 周",
          title: "继续保留连接与边界的平衡",
          focus: "让清晰表达成为稳定习惯，而不是只在极端场景才出现。",
          rationale:
            "你的关系系统整体可用，接下来更重要的是让这种平衡在高压或重要关系里也能保持。",
          actions: [
            "在小事上也练习说清需求，不只在大冲突时才表达。",
            "观察自己在哪类对象面前最容易退回沉默或过度照顾。",
            "把一次表达成功的经历记下来，巩固“清晰不等于伤害关系”的体验。",
          ],
          checkpoint:
            "如果你能在重要关系里依旧保留自己的位置，而不是事后才发现自己让得太多，说明平衡在变稳。",
        };

  const executionPlan: GrowthPlanStep =
    lookup.action_initiation.score <= 45 || lookup.decision_style.score >= 65
      ? {
          id: "lower-threshold",
          phase: "第 3-5 周",
          title: "降低启动门槛，而不是继续靠意志硬推",
          focus: "让任务更容易开始，让思考和行动不再互相拖住。",
          rationale:
            "当评估太强或门槛太高时，问题常不在能力，而在开始之前的心理成本已经过大。",
          actions: [
            "把最难开始的任务拆成一个 5 分钟版本，只要求“启动”，不要求一次做完。",
            "给重要决定设一个“足够好标准”，避免一直等到信息完全齐全。",
            "如果你常常拖到最后一刻，提前安排一个人为的中间节点，而不是只盯最终截止时间。",
          ],
          checkpoint:
            "如果你开始能更快跨过第一步，而不是总在开始前消耗很久，执行系统就已经在改善。",
        }
      : {
          id: "lower-threshold",
          phase: "第 3-5 周",
          title: "让推进力变得可持续",
          focus: "在保持行动力的同时，加入检视点和恢复点。",
          rationale:
            "你的问题不一定是做不起来，而更可能是做得太连续、太靠硬扛，后段容易透支。",
          actions: [
            "给每项高投入任务加一个复盘点：我是在推进，还是已经开始透支。",
            "把“继续做”与“现在先停”都当成合法选项，而不是默认只能往前冲。",
            "每周回看一次：哪种任务最容易让我进入高效但超载的状态。",
          ],
          checkpoint:
            "如果你能保持推进，同时更少在后段崩掉或明显透支，说明执行系统正在变得可持续。",
        };

  return [regulationPlan, relationshipPlan, executionPlan];
}

function buildReflectionPrompts(
  lookup: Record<DimensionId, ScoredDimension>,
): string[] {
  const salient = Object.values(lookup)
    .sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50))
    .slice(0, 2);

  return [
    `最近最容易点亮我「${salient[0]?.shortName}」和「${salient[1]?.shortName}」模式的场景，分别是什么？`,
    "当我开始进入熟悉的自动反应时，身体最先给出的信号是什么？",
    "如果这周只做一个最小调整，哪一步最可能真正减轻我的消耗？",
  ];
}

function buildFigureReferences(
  lookup: Record<DimensionId, ScoredDimension>,
): MatchedFigure[] {
  return historicalFigures
    .map((figure) => {
      const totalDistance = dimensionOrder.reduce((sum, dimensionId) => {
        return sum + Math.abs(lookup[dimensionId].score - figure.scores[dimensionId]);
      }, 0);

      const averageDistance = totalDistance / dimensionOrder.length;
      const matchScore = clamp(100 - averageDistance, 0, 100);
      const closestDimensions = dimensionOrder
        .map((dimensionId) => ({
          dimensionId,
          distance: Math.abs(lookup[dimensionId].score - figure.scores[dimensionId]),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2)
        .map(({ dimensionId }) => `更接近「${dimensions[dimensionId].shortName}」`);

      return {
        id: figure.id,
        name: figure.name,
        era: figure.era,
        region: figure.region,
        role: figure.role,
        summary: figure.summary,
        resonance: figure.resonance,
        imagePath: figure.imagePath,
        imageAlt: figure.imageAlt,
        imageFit: figure.imageFit,
        imagePosition: figure.imagePosition,
        matchScore: Math.round(matchScore),
        matchHighlights: closestDimensions,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 2);
}

function buildStoryOutcome(
  lookup: Record<DimensionId, ScoredDimension>,
): StoryOutcome {
  const bestMatch = storyOutcomes
    .map((ending) => {
      const distance = dimensionOrder.reduce((sum, dimensionId) => {
        return sum + Math.abs(lookup[dimensionId].score - ending.profile[dimensionId]);
      }, 0);

      return {
        ending,
        distance,
      };
    })
    .sort((a, b) => a.distance - b.distance)[0];

  return {
    id: bestMatch.ending.id,
    title: bestMatch.ending.title,
    subtitle: bestMatch.ending.subtitle,
    summary: bestMatch.ending.summary,
    reflection: bestMatch.ending.reflection,
    why: bestMatch.ending.why,
  };
}

function buildReportFromDimensions(
  dimensionsScored: ScoredDimension[],
  options?: {
    storyOutcome?: StoryOutcome;
  },
): AssessmentReport {
  const lookup = Object.fromEntries(
    dimensionsScored.map((dimension) => [dimension.id, dimension]),
  ) as Record<DimensionId, ScoredDimension>;

  return {
    generatedAt: new Date().toISOString(),
    overallSummary: buildOverallSummary(dimensionsScored),
    storyOutcome: options?.storyOutcome,
    dimensions: dimensionsScored,
    combinations: buildCombinationInsights(lookup),
    contexts: buildContextSuggestions(lookup),
    figureReferences: buildFigureReferences(lookup),
    deepInsights: buildDeepInsights(lookup),
    growthPlan: buildGrowthPlan(lookup),
    reflectionPrompts: buildReflectionPrompts(lookup),
    gentleReminders: buildGentleReminders(lookup),
    radarData: dimensionsScored.map((dimension) => ({
      dimension: dimension.shortName,
      score: Math.round(dimension.score),
    })),
  };
}

export function generateAssessmentReport(answers: AnswerMap): AssessmentReport {
  const dimensionsScored = dimensionOrder.map((dimensionId) =>
    scoreDimension(dimensionId, answers),
  );

  return buildReportFromDimensions(dimensionsScored);
}

export function generateAssessmentReportFromDimensionScores(
  dimensionScores: Record<DimensionId, number>,
): AssessmentReport {
  const dimensionsScored = dimensionOrder.map((dimensionId) =>
    scoreDimensionFromScore(dimensionId, dimensionScores[dimensionId]),
  );

  const lookup = Object.fromEntries(
    dimensionsScored.map((dimension) => [dimension.id, dimension]),
  ) as Record<DimensionId, ScoredDimension>;

  return buildReportFromDimensions(dimensionsScored, {
    storyOutcome: buildStoryOutcome(lookup),
  });
}
