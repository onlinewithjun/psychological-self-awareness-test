import {
  type BalancedProfile,
  type DimensionDefinition,
  type DimensionId,
  type Question,
} from "@/lib/types";

const balancedProfile = (
  label: string,
  summary: string,
  strengths: string,
  costs: string,
  pressure: string,
  adjustments: string,
  overviewPhrase: string,
): BalancedProfile => ({
  label,
  summary,
  strengths,
  costs,
  pressure,
  adjustments,
  overviewPhrase,
});

export const likertOptions = [
  { value: 1, label: "非常不同意", helper: "明显不符合" },
  { value: 2, label: "比较不同意", helper: "大多不符合" },
  { value: 3, label: "不确定 / 一般", helper: "看情境" },
  { value: 4, label: "比较同意", helper: "大多符合" },
  { value: 5, label: "非常同意", helper: "非常贴近" },
] as const;

export const dimensionOrder: DimensionId[] = [
  "emotional_variability",
  "stress_response",
  "relational_security",
  "self_evaluation",
  "decision_style",
  "boundary_expression",
  "action_initiation",
  "self_awareness",
];

export const dimensions: Record<DimensionId, DimensionDefinition> = {
  emotional_variability: {
    id: "emotional_variability",
    name: "情绪稳定与波动倾向",
    shortName: "情绪波动",
    description:
      "关注你对外界变化、语气、节奏和日常波折的情绪反应强度。它不是“好或坏”，而是你感受世界时的敏锐度与稳态方式。",
    lowPole: {
      label: "稳态保持",
      summary:
        "你更容易把情绪波动维持在可管理范围内，外界起伏不太会立刻带着你走。",
      strengths:
        "这种倾向通常让你在复杂情境中更稳、更能看清事实，也更不容易被短期氛围裹挟。",
      costs:
        "代价是你有时会显得过于压住感受，或者在需要细腻回应自己时慢半拍。",
      pressure:
        "压力升高时，你可能继续选择“先稳住再说”，表面平静，但身体疲惫和情绪积累未必会立刻浮现。",
      adjustments:
        "可以定期做一次简短自检，例如问自己：我现在是平静，还是只是暂时压住了反应？让“稳”不等于“忽略”。",
      overviewPhrase: "在情绪上更倾向先稳住自己",
    },
    balanced: balancedProfile(
      "弹性平衡",
      "你通常既能感受到情绪变化，也有一定能力在波动后重新找回节奏。",
      "这种中段状态常见于既有敏感度、也有恢复力的人，既不钝化，也不容易失控。",
      "需要留意的是，不同情境下你的波动幅度可能差很多，尤其在人际或高负荷环境中。",
      "压力下你可能先敏感一阵，再慢慢回稳；如果恢复空间不足，也可能出现“白天撑住、晚上累垮”。",
      "继续保留对情绪变化的觉察，同时建立一两个固定恢复动作，比如散步、写几句状态记录、减少临睡前输入。",
      "既能感受变化，也有一定回稳能力",
    ),
    highPole: {
      label: "敏感波动",
      summary:
        "你更容易捕捉到环境、语气和细小变化，情绪也更容易跟着情境一起起伏。",
      strengths:
        "优势往往是细腻、共情、反应快，对关系与氛围的微妙变化很有感知力。",
      costs:
        "代价是更容易被琐碎波折消耗，或在一天里经历较多“被带着走”的时刻。",
      pressure:
        "一旦压力叠加，你可能更容易出现放大式解读、身体紧绷、反复回想，恢复时间也会变长。",
      adjustments:
        "可以把“我感觉到了什么”和“它是否等于事实”分开写下来，帮助自己在敏感与判断之间留出一点空间。",
      overviewPhrase: "对环境变化和情绪线索更敏锐",
    },
  },
  stress_response: {
    id: "stress_response",
    name: "压力反应模式",
    shortName: "压力反应",
    description:
      "关注压力上来时，你更倾向于紧绷控制、反复预演，还是能维持节奏、做出调节。",
    lowPole: {
      label: "节奏调节",
      summary:
        "你在压力下更可能先找节奏、分轻重，较少立刻进入过度警觉状态。",
      strengths:
        "这通常有助于保持判断力和耐力，也更容易在长期任务里稳住自己的节拍。",
      costs:
        "代价是你有时会低估风险或延后感受到压力，等到身体和精力发出信号时，已经有些透支。",
      pressure:
        "在高压环境里，你可能看起来还算稳定，但如果长期不调整，也可能突然出现明显疲惫感。",
      adjustments:
        "继续保留你的节奏感，同时给自己设置外部检查点，例如阶段复盘、任务上限和休息提醒。",
      overviewPhrase: "在压力里更容易先找回节奏",
    },
    balanced: balancedProfile(
      "可调节的警觉",
      "你既会在压力下提高警觉，也通常能在一段时间后把自己拉回到可工作的状态。",
      "这类状态有利于兼顾效率和风险意识，在一般压力下通常具备不错的应对弹性。",
      "需要注意的是，当压力来源持续又模糊时，你可能一边紧、一边撑，外界不一定看得出来。",
      "压力持续时，你可能在“先顶住”与“需要停一下”之间来回摆动。",
      "提前识别自己的超载信号，比如开始反复检查、呼吸变浅、很难停下来，这比等完全耗尽再休息更有效。",
      "对压力有感知，也能逐步把自己调回来",
    ),
    highPole: {
      label: "警觉绷紧",
      summary:
        "压力一来，你更容易马上进入盯细节、做预演、反复确认的状态。",
      strengths:
        "这种倾向的优势是责任感、风险意识和执行严谨度，尤其适合高要求任务和不确定情境。",
      costs:
        "代价是很容易一直处在高唤醒里，脑子停不下来，休息质量也可能受影响。",
      pressure:
        "当压力超过承受范围时，你可能越忙越绷、越想控制越疲惫，甚至很难判断何时该停。",
      adjustments:
        "可以尝试把“要不要继续硬扛”变成一个明确问题，而不是默认继续。给自己设定一个结束线，比一味坚持更有帮助。",
      overviewPhrase: "压力一来就容易进入高度警觉",
    },
  },
  relational_security: {
    id: "relational_security",
    name: "人际关系与依恋倾向",
    shortName: "关系模式",
    description:
      "关注你在重要关系中的安全感、在意程度，以及在关系波动时更靠近哪种应对方式。",
    lowPole: {
      label: "关系安全",
      summary:
        "你在关系中相对更能保持基本安心，不太会因为短时波动就立刻怀疑关系本身。",
      strengths:
        "这种倾向通常让你更能给自己和对方空间，也更容易在关系里保持独立与稳定。",
      costs:
        "代价是你偶尔可能显得不那么主动确认关系温度，或者让对方觉得你把感受藏得比较深。",
      pressure:
        "关系紧张时，你可能先往后退一点、先自己消化，而不是立刻寻求确认。",
      adjustments:
        "如果你在意某段关系，可以更早表达“我在意，但我也需要一点时间整理”，让稳定不等于沉默。",
      overviewPhrase: "在人际中通常能保留基本安心感",
    },
    balanced: balancedProfile(
      "连接与独立之间",
      "你既在意关系质量，也通常能给彼此留出一些空间，不会轻易把一次波动等同于关系失衡。",
      "这种状态有利于建立既有温度也有边界的关系。",
      "需要留意的是，当你特别在乎某个人或某段关系时，原本的平衡可能会明显偏移。",
      "压力或冲突上来时，你可能会短暂变得更在意回应、确认和关系气氛。",
      "可以观察自己在哪些关系里更容易失去平衡，这通常比单看总体结果更有帮助。",
      "既在意连接，也能保留一定独立度",
    ),
    highPole: {
      label: "连接警觉",
      summary:
        "你更容易留意关系中的冷暖变化，也更可能在回应变少或气氛不对时迅速多想。",
      strengths:
        "这种倾向常带来细腻、投入和高关系敏感度，能较早察觉关系中的疏离或需要。",
      costs:
        "代价是你更容易被关系里的不确定性牵动，也可能为了维持连接而先压住自己的需要。",
      pressure:
        "在不安时，你可能更想确认关系、反复回想互动细节，或者先把责任归到自己身上。",
      adjustments:
        "当你开始多想时，可以先区分“我感到不安”与“关系真的出了问题”是不是同一件事，再决定是否沟通。",
      overviewPhrase: "在人际里更容易留意关系温度的变化",
    },
  },
  self_evaluation: {
    id: "self_evaluation",
    name: "自我价值感与自我评价方式",
    shortName: "自我评价",
    description:
      "关注你在表现、反馈和失败面前，更倾向于稳定看待自己，还是容易进入严格甚至苛刻的自我评估。",
    lowPole: {
      label: "相对稳定的自我接纳",
      summary:
        "你通常能把“我做得怎么样”与“我值不值得被肯定”分开，不太会因为一次表现就全盘否定自己。",
      strengths:
        "这种倾向有助于恢复、学习和持续投入，也更容易允许自己在不完美中前进。",
      costs:
        "代价是你偶尔可能显得对自己太宽松，或者在高标准环境里不那么容易被外界节奏推动。",
      pressure:
        "在压力期，你通常还能保留一点自我支持，但如果长期受挫，也可能慢慢转向怀疑自己。",
      adjustments:
        "可以继续巩固“允许不完美但不放弃成长”的节奏，把自我接纳和自我要求同时留在系统里。",
      overviewPhrase: "对自己的评价相对稳定",
    },
    balanced: balancedProfile(
      "要求与接纳并存",
      "你既在意自己做得够不够好，也不至于轻易把一次失误等同于整个人不够好。",
      "这种状态常能带来成长动力，同时保留一定缓冲空间。",
      "需要留意的是，外界压力、比较环境或持续疲惫时，你可能更容易滑向苛责自己的一侧。",
      "压力上来时，你可能先提高要求，再在结果不理想时短暂自我怀疑。",
      "当你开始内在批评过强时，试着补上一句更完整的话：我还可以改进，但这不等于我一无是处。",
      "既想做好，也能留住一点自我支持",
    ),
    highPole: {
      label: "高自我要求",
      summary:
        "你更容易把表现与自我价值绑在一起，在做得不够好时快速进入自我审视甚至自我否定。",
      strengths:
        "这种倾向的优势往往是责任感、进取心和对质量的敏感，不容易轻易敷衍自己。",
      costs:
        "代价是你更容易内耗，把很多本来属于情境、资源或时机的问题收归为“是不是我不够好”。",
      pressure:
        "压力或失败叠加时，你可能进入更严厉的自我对话，恢复速度也会被拉慢。",
      adjustments:
        "可以练习把评价拆成三层：事实、影响、下一步，而不是直接跳到对人格或价值的判断。",
      overviewPhrase: "对自己要求偏高，也更容易自我质疑",
    },
  },
  decision_style: {
    id: "decision_style",
    name: "决策风格",
    shortName: "决策风格",
    description:
      "关注你做决定时更偏向快速直觉、边做边调，还是更偏向分析权衡、确认把握之后再推进。",
    lowPole: {
      label: "直觉推进",
      summary:
        "你更容易在信息大致够用时先做选择，再在过程中校正方向。",
      strengths:
        "这种倾向通常让你决策速度更快，面对变化时更灵活，也更容易抓住行动窗口。",
      costs:
        "代价是你有时会忽略细节或后果评估，需要在重要决策上额外补一层检查。",
      pressure:
        "压力下你可能更依赖第一反应，如果外界变化很快，这会帮你推进；如果后果很重，则可能留下返工。",
      adjustments:
        "对高影响决策，给自己留一个最小检查清单，而不是完全改掉直觉风格。让速度与校验并存。",
      overviewPhrase: "做决定时更倾向先走起来再校正",
    },
    balanced: balancedProfile(
      "审慎与直觉并用",
      "你会根据事情的重要程度调整决策方式：有时先判断，有时先推进。",
      "这种弹性往往是很实用的优势，既不过度犹豫，也不容易盲目拍板。",
      "需要留意的是，在特别重要或特别模糊的情境中，你可能短暂失去原有的平衡。",
      "压力下你可能先变得更审慎，或者相反，为了尽快结束不确定感而加快决定。",
      "继续保留这份弹性，同时提前识别哪类事情适合快决，哪类事情必须慢一点。",
      "会根据情境切换决策方式",
    ),
    highPole: {
      label: "审慎权衡",
      summary:
        "你更倾向于在做决定前把信息想得更透，尤其在不确定或后果较大的情境里。",
      strengths:
        "这种倾向常带来周全、可靠和风险意识，能减少冲动判断。",
      costs:
        "代价是当信息永远不可能完全充分时，你可能停留在评估阶段，决策速度变慢。",
      pressure:
        "一旦面对高不确定性，你可能更容易反复比较、反复推演，想清楚的过程本身会变得更耗能。",
      adjustments:
        "可以提前设定“足够好”的决策标准，而不是等待完全确定。很多现实决定并不以完美信息出现。",
      overviewPhrase: "做决定前会更倾向先想清楚",
    },
  },
  boundary_expression: {
    id: "boundary_expression",
    name: "边界感与表达倾向",
    shortName: "边界表达",
    description:
      "关注你在面对请求、压力和冲突时，表达界限的自然程度，以及你会不会先把自己让出去。",
    lowPole: {
      label: "关系优先式让渡",
      summary:
        "你更容易先顾及气氛、关系和别人的感受，再考虑自己是否方便或愿意。",
      strengths:
        "这种倾向常伴随体谅、合作和柔和感，能帮助关系快速维持表面顺畅。",
      costs:
        "代价是你更容易把不舒服留给自己，久了可能累积委屈、疲惫或隐性的关系负担。",
      pressure:
        "冲突或高压时，你可能更不愿意明确表达不同意，转而沉默、回避或事后自己消化。",
      adjustments:
        "可以先练习更小的边界句式，例如“我需要想一下”“这次我可能接不住”，不必一开始就非常强硬。",
      overviewPhrase: "在关系里更容易先让出自己的边界",
    },
    balanced: balancedProfile(
      "柔和但相对清楚",
      "你通常能顾及关系，也能在关键时刻表达自己的界限，不一定完美，但基本可用。",
      "这种状态有利于在合作和自我保护之间保持相对平衡。",
      "需要留意的是，当对象更强势、关系更重要或你自己更疲惫时，这份平衡可能被打破。",
      "压力之下，你可能暂时更想维持和气，边界表达会变得比平时更含蓄。",
      "提前准备几句你愿意使用的边界语言，会比临场想到哪句算哪句更稳。",
      "大体能兼顾关系与自己的界限",
    ),
    highPole: {
      label: "清晰表达边界",
      summary:
        "你更容易在超出承受范围时说出自己的限制，也更习惯为自己的时间、精力和立场留出边界。",
      strengths:
        "这种倾向有助于减少无谓消耗，提升关系里的清晰度，也更容易形成稳定合作。",
      costs:
        "代价是如果表达方式过快或场景判断不足，别人可能会感到你距离感较强或不够圆融。",
      pressure:
        "在压力下，你可能更直接，效率高，但也需要留意沟通温度是否被一起压扁了。",
      adjustments:
        "继续保留清晰表达，同时把“边界内容”和“表达方式”分开打磨，会让你的立场更容易被听进去。",
      overviewPhrase: "更习惯明确表达自己的界限",
    },
  },
  action_initiation: {
    id: "action_initiation",
    name: "行动力与拖延倾向",
    shortName: "行动启动",
    description:
      "关注你面对任务时更容易进入行动，还是容易在开始前被准备、犹豫或情绪负担拖慢。",
    lowPole: {
      label: "启动迟缓",
      summary:
        "你更容易在真正开始之前花较多时间想、拖、等状态，启动本身比执行更费力。",
      strengths:
        "这并不一定代表懒散，很多时候它也意味着你会先评估、先酝酿，避免草率开工。",
      costs:
        "代价是任务越放越重，心理负担被拉大，最后可能以赶工和自责收尾。",
      pressure:
        "压力越高，你越可能因为怕做不好而更难启动，形成“越拖越不敢开始”的循环。",
      adjustments:
        "尝试把任务改成极小的第一步，例如“先写三行”“先打开文档五分钟”。很多时候问题不在能力，而在启动门槛。",
      overviewPhrase: "开始一件事时更容易被启动门槛卡住",
    },
    balanced: balancedProfile(
      "可启动也会迟疑",
      "你整体具备行动能力，但会受任务难度、意义感和当下状态影响，有时利落，有时明显拖慢。",
      "这种状态常见于能力并不差，但节奏受情绪和负荷波动影响的人。",
      "需要注意的是，外界可能只看到你能做成事，忽略了你在启动前已经消耗了多少。",
      "压力下你可能先拖一阵，再在截止前集中推进。",
      "关键不是要求自己一直高效，而是更早识别自己何时需要拆任务、降门槛、补结构。",
      "整体具备行动力，但会受状态影响",
    ),
    highPole: {
      label: "行动推进",
      summary:
        "任务一旦明确，你更容易进入执行，也更习惯通过先做一点来带动后续状态。",
      strengths:
        "这种倾向常带来推进力、效率和掌控感，能帮助你在复杂任务里维持动能。",
      costs:
        "代价是你有时会过早进入执行，而没有留足够的停顿来确认方向或恢复精力。",
      pressure:
        "压力大时，你可能继续靠行动感稳住自己，但若一直推进不停，也更容易在后段透支。",
      adjustments:
        "可以保留你的推进力，同时给流程加上复盘点和停顿点，避免把行动力变成持续超载。",
      overviewPhrase: "明确目标后通常能较快进入行动",
    },
  },
  self_awareness: {
    id: "self_awareness",
    name: "自我觉察能力",
    shortName: "自我觉察",
    description:
      "关注你是否能较早看见自己的情绪、需求和状态变化，还是更常在事情过去后才慢慢意识到发生了什么。",
    lowPole: {
      label: "自动驾驶式应对",
      summary:
        "你更容易先把事情做完、把场面过完，之后才发现自己其实已经累了、烦了或勉强了很久。",
      strengths:
        "这种方式有时能帮你在现实情境里先撑住，不至于被即时感受频繁打断。",
      costs:
        "代价是你可能较晚识别自己的需求，等到意识到不对劲时，消耗已经累积不少。",
      pressure:
        "高压下你可能继续自动推进，但恢复动作常常落后于消耗速度。",
      adjustments:
        "把觉察做得更轻一点，例如每天只问一次“我现在是累、烦、空，还是只是忙？”不需要一上来就深度分析。",
      overviewPhrase: "很多状态往往要事后才意识到",
    },
    balanced: balancedProfile(
      "有觉察，也会受情境影响",
      "你通常能识别自己的部分状态和需求，但在忙、累或关系紧张时，这份觉察会下降。",
      "这种状态已经具备不错的自我调节基础，只是稳定度还会受场景影响。",
      "需要留意的是，你可能知道自己不舒服，却还没把这种知道及时转成行动。",
      "压力上来时，你可能能感觉到不对劲，但未必立刻停下来或改变节奏。",
      "继续练习把觉察和行动连起来，例如在发现自己超载时，马上做一个很小的调节动作。",
      "通常能意识到自己的状态，只是稳定度会波动",
    ),
    highPole: {
      label: "较强自我觉察",
      summary:
        "你更容易较早看见自己的情绪、需求、疲惫和防御反应，也较能分辨复杂感受背后的成分。",
      strengths:
        "这种倾向有助于及时调节、减少盲目消耗，也更容易把经验转化为对自己的理解。",
      costs:
        "代价是如果缺少行动配合，觉察本身可能变成反复内省，甚至让你在某些时刻更难松开。",
      pressure:
        "高压时，你通常会更快察觉自己在变紧，但也可能因为看得太清楚而更难简单切断思路。",
      adjustments:
        "保留你的觉察优势，同时提醒自己：看见之后不一定要立刻想透，有时先休息、先离场也是一种有效回应。",
      overviewPhrase: "通常能较早察觉自己的状态变化",
    },
  },
};

export const questions: Question[] = [
  {
    id: "q1",
    dimensionId: "emotional_variability",
    text: "一天里如果连续出现几件小波折，我很容易被情绪带着走。",
    reverse: false,
  },
  {
    id: "q2",
    dimensionId: "emotional_variability",
    text: "情绪起伏出现后，我通常能比较快把自己重新稳住。",
    reverse: true,
  },
  {
    id: "q3",
    dimensionId: "emotional_variability",
    text: "别人的语气、气氛变化，常会明显影响我接下来一段时间的状态。",
    reverse: false,
  },
  {
    id: "q4",
    dimensionId: "emotional_variability",
    text: "即使事情不顺，我也比较能把“我的感觉”与“事情本身”分开看。",
    reverse: true,
  },
  {
    id: "q5",
    dimensionId: "stress_response",
    text: "任务一多，我会马上开始盯细节，担心漏掉什么。",
    reverse: false,
  },
  {
    id: "q6",
    dimensionId: "stress_response",
    text: "压力来的时候，我通常还能保留一点节奏感，不会一下子乱掉。",
    reverse: true,
  },
  {
    id: "q7",
    dimensionId: "stress_response",
    text: "面对不确定的事，我会在脑子里反复预演可能出错的地方。",
    reverse: false,
  },
  {
    id: "q8",
    dimensionId: "stress_response",
    text: "当压力已经明显上来时，我知道什么时候该停一下，而不是一直硬扛。",
    reverse: true,
  },
  {
    id: "q9",
    dimensionId: "relational_security",
    text: "重要的人回复慢一些，我容易开始多想是不是哪里不对劲。",
    reverse: false,
  },
  {
    id: "q10",
    dimensionId: "relational_security",
    text: "即使在乎的人一时顾不上我，我通常也能保留基本安心感。",
    reverse: true,
  },
  {
    id: "q11",
    dimensionId: "relational_security",
    text: "在关系里，我常会先照顾气氛，再考虑自己真正想要什么。",
    reverse: false,
  },
  {
    id: "q12",
    dimensionId: "relational_security",
    text: "关系有一点波动时，我通常还能表达在意，也保留自己的节奏。",
    reverse: true,
  },
  {
    id: "q13",
    dimensionId: "self_evaluation",
    text: "做得不够好时，我很容易把问题想到“是不是我不够好”。",
    reverse: false,
  },
  {
    id: "q14",
    dimensionId: "self_evaluation",
    text: "我可以看到自己的不足，但不需要因此全盘否定自己。",
    reverse: true,
  },
  {
    id: "q15",
    dimensionId: "self_evaluation",
    text: "别人的认可或否定，很容易影响我怎么看待自己。",
    reverse: false,
  },
  {
    id: "q16",
    dimensionId: "self_evaluation",
    text: "即使这次表现普通，我也还能承认自己已经尽力了。",
    reverse: true,
  },
  {
    id: "q17",
    dimensionId: "decision_style",
    text: "做决定前，我通常要把选项想得比较透才安心。",
    reverse: false,
  },
  {
    id: "q18",
    dimensionId: "decision_style",
    text: "只要信息大致够用，我愿意先决定，再边做边调整。",
    reverse: true,
  },
  {
    id: "q19",
    dimensionId: "decision_style",
    text: "如果没有足够把握，我宁愿先等等，也不想太快拍板。",
    reverse: false,
  },
  {
    id: "q20",
    dimensionId: "decision_style",
    text: "很多日常选择上，我更依赖当下直觉，而不是长时间权衡。",
    reverse: true,
  },
  {
    id: "q21",
    dimensionId: "boundary_expression",
    text: "当别人的请求超出我当下能承担的范围时，我能比较明确地说出来。",
    reverse: false,
  },
  {
    id: "q22",
    dimensionId: "boundary_expression",
    text: "为了不让气氛尴尬，我常先答应下来，之后再自己消化。",
    reverse: true,
  },
  {
    id: "q23",
    dimensionId: "boundary_expression",
    text: "即使对方比较强势，我也会尽量把自己的界限说清楚。",
    reverse: false,
  },
  {
    id: "q24",
    dimensionId: "boundary_expression",
    text: "我不太习惯直接表达“这次不方便”或“我不同意”。",
    reverse: true,
  },
  {
    id: "q25",
    dimensionId: "action_initiation",
    text: "事情一旦明确，我通常能比较快进入行动。",
    reverse: false,
  },
  {
    id: "q26",
    dimensionId: "action_initiation",
    text: "我常在开始之前想很多，结果真正启动被拖慢。",
    reverse: true,
  },
  {
    id: "q27",
    dimensionId: "action_initiation",
    text: "我更容易被“先做一点”带起来，而不是一直等最合适的状态。",
    reverse: false,
  },
  {
    id: "q28",
    dimensionId: "action_initiation",
    text: "即使任务不大，我也可能拖到临近截止才真正开始。",
    reverse: true,
  },
  {
    id: "q29",
    dimensionId: "self_awareness",
    text: "我通常能比较早地察觉自己已经累了、烦了，或在勉强支撑。",
    reverse: false,
  },
  {
    id: "q30",
    dimensionId: "self_awareness",
    text: "很多时候，我是事后才发现自己原来已经压着情绪或需求很久了。",
    reverse: true,
  },
  {
    id: "q31",
    dimensionId: "self_awareness",
    text: "我大致能分辨自己是没兴趣，还是其实在害怕、内疚或不安。",
    reverse: false,
  },
  {
    id: "q32",
    dimensionId: "self_awareness",
    text: "当状态不好时，我常只觉得“反正不对劲”，但很难说清发生了什么。",
    reverse: true,
  },
];
