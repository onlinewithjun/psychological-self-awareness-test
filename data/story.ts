import type { DimensionId, StoryOutcome, StoryScene } from "@/lib/types";

function baseScores(value = 50): Record<DimensionId, number> {
  return {
    emotional_variability: value,
    stress_response: value,
    relational_security: value,
    self_evaluation: value,
    decision_style: value,
    boundary_expression: value,
    action_initiation: value,
    self_awareness: value,
  };
}

export const initialStoryScores = baseScores();

export const storyScenes: StoryScene[] = [
  {
    id: "s1",
    chapter: "第一章",
    title: "雾港来信",
    setting: "夜里 20:10，你刚到港口，原定计划突然延迟。",
    narration:
      "你受邀去一座临海旧天文台帮忙完成一场只在今晚开放的“回声展”。刚下车，手机就跳出三条变化通知：接驳车取消、现场布置缺一块、同伴说自己会晚一点到。",
    prompt: "这一连串小变动刚出现时，你更像哪一种反应？",
    choices: [
      {
        id: "s1-c1",
        label: "先深呼吸，重新排顺序",
        summary: "你把通知重新看一遍，决定先处理眼前最关键的一件。",
        reaction: "你没有立刻被节奏带走，而是先给自己留出一点回稳空间。",
        effects: {
          emotional_variability: -10,
          stress_response: -6,
          self_awareness: 6,
        },
      },
      {
        id: "s1-c2",
        label: "边走边想，先赶到现场再说",
        summary: "你觉得不用过度停留，行动起来可能更有助于稳住状态。",
        reaction: "你选择用推进来处理不确定感。",
        effects: {
          action_initiation: 8,
          decision_style: -6,
          stress_response: 2,
        },
      },
      {
        id: "s1-c3",
        label: "一下子就开始烦躁，反复想为什么这么乱",
        summary: "你虽然知道要继续走，但脑子已经被突发变化占满。",
        reaction: "这些小波折很快进入了你的情绪和思路。",
        effects: {
          emotional_variability: 12,
          stress_response: 8,
          self_awareness: -2,
        },
      },
    ],
  },
  {
    id: "s2",
    chapter: "第二章",
    title: "门口的请求",
    setting: "天文台入口，值守志愿者正手忙脚乱。",
    narration:
      "你刚进门，一位志愿者急急跑来，说临时缺人去搬一箱设备，希望你先帮忙。你本来打算先去确认自己的任务说明，因为今晚的流程你也还没完全搞清。",
    prompt: "面对这个请求，你更可能怎么做？",
    choices: [
      {
        id: "s2-c1",
        label: "先说明自己的情况，再决定能帮多少",
        summary: "你会表达愿意协助，但也会把自己的限制说清楚。",
        reaction: "你兼顾了关系与边界，没有把自己直接交出去。",
        effects: {
          boundary_expression: 12,
          relational_security: -4,
          self_awareness: 4,
        },
      },
      {
        id: "s2-c2",
        label: "先答应下来，别让对方更难",
        summary: "你会优先接住当下的需要，自己的任务往后放一放。",
        reaction: "关系气氛被你放在了更前面。",
        effects: {
          relational_security: 10,
          boundary_expression: -12,
          action_initiation: 4,
        },
      },
      {
        id: "s2-c3",
        label: "礼貌拒绝，先把自己的部分弄清楚",
        summary: "你判断自己现在不适合额外分神，决定先确保主线任务稳定。",
        reaction: "你先把秩序和界限放在更前的位置。",
        effects: {
          boundary_expression: 10,
          decision_style: 6,
          relational_security: -6,
        },
      },
    ],
  },
  {
    id: "s3",
    chapter: "第三章",
    title: "控制室灯亮起",
    setting: "主控室里，设备调试只剩不到一小时。",
    narration:
      "负责展览的策展人说，最好把每一处细节都对齐；而技术同伴则提醒你，时间不够了，先让核心流程可运行更重要。两种声音同时压过来。",
    prompt: "在时间紧、意见又不一致时，你会更像哪种决策方式？",
    choices: [
      {
        id: "s3-c1",
        label: "先把影响最大的部分跑通，再逐步补细节",
        summary: "你会优先保证系统动起来，再在过程中修正。",
        reaction: "你把推进优先级放在了完整性之前。",
        effects: {
          decision_style: -12,
          action_initiation: 10,
          stress_response: -4,
        },
      },
      {
        id: "s3-c2",
        label: "希望再想清楚一点，不想太仓促拍板",
        summary: "你会再确认信息和后果，哪怕时间更紧一些。",
        reaction: "不确定时，你倾向于让判断更充分。",
        effects: {
          decision_style: 12,
          stress_response: 6,
          action_initiation: -6,
        },
      },
      {
        id: "s3-c3",
        label: "先接下压力，自己把每个细节都盯一遍",
        summary: "你会进入高度警觉状态，希望靠更严密的控制稳住局面。",
        reaction: "责任感和风险意识被同时拉高了。",
        effects: {
          stress_response: 12,
          self_evaluation: 8,
          action_initiation: 6,
        },
      },
    ],
  },
  {
    id: "s4",
    chapter: "第四章",
    title: "那条语气微妙的消息",
    setting: "你看到迟到的同伴发来一句：‘你先看着处理吧。’",
    narration:
      "这句话没有更多解释。你一下子不确定他是不是不高兴、是不是在对你表达不满，还是只是单纯忙不过来。",
    prompt: "看到这样的信息，你更可能发生什么？",
    choices: [
      {
        id: "s4-c1",
        label: "先默认对方可能只是忙，等见面再确认",
        summary: "你会保留一点空间，不急着把它解释成关系出了问题。",
        reaction: "你让事实和猜测之间保持了距离。",
        effects: {
          relational_security: -12,
          emotional_variability: -6,
          self_awareness: 4,
        },
      },
      {
        id: "s4-c2",
        label: "表面继续做事，但心里会反复想是不是自己哪里不对",
        summary: "你不会立刻停下手头事情，但这条消息会留在心里。",
        reaction: "关系线索进入了你的内在对话。",
        effects: {
          relational_security: 12,
          self_evaluation: 8,
          emotional_variability: 6,
        },
      },
      {
        id: "s4-c3",
        label: "直接发消息确认，不让误会继续发酵",
        summary: "你倾向于尽快把模糊点问清，而不是独自猜测。",
        reaction: "你更习惯把不确定带回到可沟通的层面。",
        effects: {
          boundary_expression: 8,
          relational_security: -4,
          action_initiation: 4,
        },
      },
    ],
  },
  {
    id: "s5",
    chapter: "第五章",
    title: "展签上的空白",
    setting: "最后一块展签内容还没定稿。",
    narration:
      "如果现在就印，它会不够完美；如果再改，时间又会更紧。你知道观众未必会看到所有细节，但你自己会知道那块空白在那里。",
    prompt: "这种时候，你更可能怎么和自己相处？",
    choices: [
      {
        id: "s5-c1",
        label: "先让它达到可用，再留一个可以补的版本",
        summary: "你会接受当下不能完美，但希望保持后续修正空间。",
        reaction: "你在要求和弹性之间找了个现实位置。",
        effects: {
          self_evaluation: -8,
          decision_style: -4,
          action_initiation: 8,
        },
      },
      {
        id: "s5-c2",
        label: "越想越觉得不能这样交出去，必须再磨",
        summary: "你会更难接受一个你自己都不满意的版本。",
        reaction: "标准感和责任感一起把门槛抬高了。",
        effects: {
          self_evaluation: 12,
          stress_response: 6,
          action_initiation: -6,
        },
      },
      {
        id: "s5-c3",
        label: "先停一下，确认自己是在追求质量，还是已经过度紧绷",
        summary: "你会先辨认自己的状态，再决定要不要继续改。",
        reaction: "你给了自己一点觉察空间，而不是直接被要求带走。",
        effects: {
          self_awareness: 12,
          self_evaluation: -4,
          stress_response: -4,
        },
      },
    ],
  },
  {
    id: "s6",
    chapter: "第六章",
    title: "休息室里的五分钟",
    setting: "忙碌间隙，你终于坐下来喝一口水。",
    narration:
      "你发现自己已经连续几个小时没有真正停过。周围还在忙，外界并没有人催你必须立刻起身，但你也很难确定自己现在到底是累、空、烦，还是只是还没缓过来。",
    prompt: "这短短几分钟里，你更可能怎么做？",
    choices: [
      {
        id: "s6-c1",
        label: "先问清自己现在到底是什么状态",
        summary: "你会试着分辨：我是在累、烦、紧，还是只是在忙。",
        reaction: "你把觉察放到了恢复之前。",
        effects: {
          self_awareness: 12,
          emotional_variability: -4,
          stress_response: -4,
        },
      },
      {
        id: "s6-c2",
        label: "先别想那么多，继续做完再说",
        summary: "你更习惯把状态往后放，优先保证事情完整。",
        reaction: "行动优先继续接管了系统。",
        effects: {
          self_awareness: -10,
          action_initiation: 8,
          stress_response: 4,
        },
      },
      {
        id: "s6-c3",
        label: "明知道累了，但还是会有点责怪自己不够能扛",
        summary: "你会意识到自己在透支，但同时也难免有内在批评。",
        reaction: "觉察和自我要求一起出现了。",
        effects: {
          self_awareness: 6,
          self_evaluation: 12,
          stress_response: 6,
        },
      },
    ],
  },
  {
    id: "s7",
    chapter: "第七章",
    title: "临时换班",
    setting: "有人问你能不能把自己的休息时段让出来。",
    narration:
      "他说自己快撑不住了，希望你多顶一会儿。你能理解他的难处，但你也知道自己今晚已经到了比较紧的边缘。",
    prompt: "在这种时刻，你更可能如何表达？",
    choices: [
      {
        id: "s7-c1",
        label: "说明自己也快到边缘了，只能帮一部分",
        summary: "你愿意支持，但不会把自己的承受范围完全抹掉。",
        reaction: "你的边界是柔和的，但仍然可见。",
        effects: {
          boundary_expression: 12,
          relational_security: -2,
          self_awareness: 4,
        },
      },
      {
        id: "s7-c2",
        label: "先答应下来，之后再看自己怎么扛",
        summary: "你会优先避免让对方更难受，哪怕自己已经很紧。",
        reaction: "你先保护了关系气氛，代价是自己的负荷继续上升。",
        effects: {
          boundary_expression: -12,
          relational_security: 8,
          stress_response: 6,
        },
      },
      {
        id: "s7-c3",
        label: "明确拒绝，并建议去找更合适的人协调",
        summary: "你会把自己此刻的限制直接说明，并给出替代路径。",
        reaction: "你更习惯把界限表达得清楚而直接。",
        effects: {
          boundary_expression: 14,
          decision_style: 4,
          relational_security: -6,
        },
      },
    ],
  },
  {
    id: "s8",
    chapter: "第八章",
    title: "天亮前的最后十分钟",
    setting: "观众即将入场，海面开始泛白。",
    narration:
      "一切还不算完美，但展览终于快要亮起来了。你站在天文台的玻璃窗前，知道自己最后还要做一个选择：是继续往前推、再确认一遍，还是给自己一点停顿，让这场夜晚有一个更稳的收尾。",
    prompt: "临近结尾时，你更可能走向哪一种动作？",
    choices: [
      {
        id: "s8-c1",
        label: "再做最后一轮确认，把风险尽量压低",
        summary: "你会再检查一遍，把不确定收拢到可控范围内。",
        reaction: "你希望在承担中完成收尾。",
        effects: {
          stress_response: 8,
          decision_style: 8,
          self_evaluation: 6,
        },
      },
      {
        id: "s8-c2",
        label: "先让它运行起来，相信过程中还能继续调整",
        summary: "你会把完成和流动感放在更前面。",
        reaction: "你更愿意让真实运行取代过度停留。",
        effects: {
          action_initiation: 10,
          decision_style: -8,
          stress_response: -4,
        },
      },
      {
        id: "s8-c3",
        label: "停下来看看自己今晚到底是怎么一路走到这里的",
        summary: "你想在结束前先把自己接回来，而不是只盯着结果。",
        reaction: "你把这场经历也当成了理解自己的材料。",
        effects: {
          self_awareness: 12,
          emotional_variability: -4,
          self_evaluation: -4,
        },
      },
    ],
  },
];

export const storyOutcomes: Array<StoryOutcome & { profile: Record<DimensionId, number> }> =
  [
    {
      id: "quiet-lighthouse",
      title: "守夜灯塔",
      subtitle: "你更像是在复杂里维持秩序的人。",
      summary:
        "在这次故事里，你更常用稳定、界限和判断来处理变化。你不一定最热烈，但往往是那个让事情不至于失序的人。",
      reflection:
        "这类结局并不意味着你没有情绪，而是你更习惯在波动里先把自己稳住，再决定怎么回应世界。",
      why: "通常更接近稳态保持、边界清晰、审慎判断和较高行动组织力的组合。",
      profile: {
        emotional_variability: 28,
        stress_response: 46,
        relational_security: 34,
        self_evaluation: 40,
        decision_style: 74,
        boundary_expression: 80,
        action_initiation: 72,
        self_awareness: 72,
      },
    },
    {
      id: "echo-collector",
      title: "回声采集者",
      subtitle: "你更像是在细微处感受世界的人。",
      summary:
        "你会留意氛围、关系线索和自己心里的回响。你的敏锐是优势，也可能让你更容易在复杂场景里承接过多信息。",
      reflection:
        "这类结局强调的是感受力与连接感，而不是脆弱。对你来说，关键不是变迟钝，而是学会为敏锐留出缓冲。",
      why: "通常更接近高情绪敏感、高关系在意度和较强自我觉察的组合。",
      profile: {
        emotional_variability: 78,
        stress_response: 62,
        relational_security: 74,
        self_evaluation: 60,
        decision_style: 58,
        boundary_expression: 40,
        action_initiation: 48,
        self_awareness: 82,
      },
    },
    {
      id: "storm-cartographer",
      title: "风暴绘图人",
      subtitle: "你更像是在压力里仍然持续承担的人。",
      summary:
        "你会在高要求和不确定中迅速进入处理模式，既想把事情做稳，也不太容易轻易放过自己。",
      reflection:
        "这类结局的力量在于承担与推进，但也提醒你：当责任感很强时，休息和停顿同样需要被安排进系统里。",
      why: "通常更接近高压力警觉、高自我要求、审慎判断和高推进力的组合。",
      profile: {
        emotional_variability: 48,
        stress_response: 82,
        relational_security: 52,
        self_evaluation: 78,
        decision_style: 82,
        boundary_expression: 60,
        action_initiation: 80,
        self_awareness: 60,
      },
    },
    {
      id: "tide-caretaker",
      title: "潮汐照料者",
      subtitle: "你更像是在照顾连接的人。",
      summary:
        "在这次故事里，你更容易先接住关系、气氛和他人的需要。你有很强的体谅与连结感，也因此更容易把自己的疲惫放到后面。",
      reflection:
        "这类结局不是在说你不够有边界，而是在提醒：你照顾别人的能力很强，也值得把同样的照顾留一部分给自己。",
      why: "通常更接近高关系投入、较低边界表达、较高敏感度和一定觉察力的组合。",
      profile: {
        emotional_variability: 66,
        stress_response: 60,
        relational_security: 80,
        self_evaluation: 58,
        decision_style: 50,
        boundary_expression: 30,
        action_initiation: 58,
        self_awareness: 70,
      },
    },
    {
      id: "dawn-calibrator",
      title: "黎明校准者",
      subtitle: "你更像是在变化里不断微调自己的人。",
      summary:
        "你不一定总在某一端，而是更常在感受、判断、关系和行动之间做动态校准。这让你有一种柔韧的中段力量。",
      reflection:
        "这类结局强调的是弹性。它不是没有特征，而是你更容易根据情境切换自己的方式。",
      why: "通常更接近多个维度都落在中段、具备一定弹性和平衡能力的组合。",
      profile: {
        emotional_variability: 50,
        stress_response: 50,
        relational_security: 50,
        self_evaluation: 50,
        decision_style: 50,
        boundary_expression: 54,
        action_initiation: 54,
        self_awareness: 58,
      },
    },
  ];
