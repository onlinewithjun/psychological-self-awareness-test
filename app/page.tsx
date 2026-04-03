import Link from "next/link";
import {
  ArrowRight,
  ChartColumn,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";

import { dimensions } from "@/data/assessment";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const highlights = [
  {
    title: "不是标签测试",
    description:
      "结果以多维倾向呈现，强调当前状态、情境差异和组合模式，而不是把人压缩成一个固定类型。",
    icon: ChartColumn,
  },
  {
    title: "研究导向",
    description:
      "采用结构化评分、模板化解释和清晰边界，不靠玄学语气，也不凭空脑补你的经历。",
    icon: ShieldCheck,
  },
  {
    title: "先保护用户",
    description:
      "内置免责声明、危机词识别和温和提醒机制。它服务于自我认知，不替代诊断或治疗。",
    icon: HeartHandshake,
  },
];

const flow = [
  "默认模式改成了 8 段剧情体验，你也可以切换回 32 题量表模式。",
  "最终会同时给出剧情结局、当前画像、组合解读、情境建议和温和提醒。",
  "结果默认保存在本机浏览器中，方便你之后和不同阶段的自己做比较。",
];

export default function HomePage() {
  const dimensionCards = Object.values(dimensions);

  return (
    <div className="pb-16">
      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-7 animate-rise">
              <Badge>研究导向的心理自我认知平台</Badge>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.75rem] lg:leading-[1.08]">
                  用一段更克制的互动叙事，
                  <br />
                  重新理解自己。
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  这不是要定义你，而是把你放进一段生活化故事里，观察你在情绪、压力、关系、边界、行动和觉察上的自然选择。
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/assessment">
                    开始剧情测试
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/about">先看方法与边界</Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <Badge>8 段剧情</Badge>
                <Badge>8 个维度</Badge>
                <Badge>结果默认仅保存在本机</Badge>
              </div>
            </div>

            <Card className="animate-rise overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">这不是一种“看透你”的工具</CardTitle>
                <CardDescription>
                  它只尝试更清楚地描述你当前更常出现的心理倾向。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {highlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-[24px] border border-stroke/70 bg-white/70 p-4"
                      >
                        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(111,143,183,0.14)] text-accent">
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="rounded-[24px] border border-stroke bg-[rgba(244,247,250,0.7)] p-4">
                  <p className="text-sm leading-7 text-muted-foreground">
                    若你当前存在明显情绪危机、自伤自杀想法、伤害他人的冲动，或功能明显受损，请不要把它当作帮助的终点，应尽快联系当地紧急援助、可信任的人或专业机构。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell space-y-8">
          <SectionHeading
            eyebrow="Step 1"
            title="你会看到的是一份多维画像，而不是人格标签。"
            description="MVP 先聚焦 8 个维度。每个维度都不是好坏判断，而是不同侧重点的代价与优势。"
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dimensionCards.map((dimension) => (
              <Card key={dimension.id} className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">{dimension.name}</CardTitle>
                  <CardDescription>{dimension.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Step 2"
            title="结果会如何呈现"
            description="我们先给出结构化分数，再映射到受控的解释模板。重点是理解模式，而不是制造“神准感”。"
          />
          <div className="grid gap-4">
            {flow.map((item, index) => (
              <Card key={item}>
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stroke bg-white/80 text-sm font-medium text-foreground">
                    0{index + 1}
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <Badge>温和提醒</Badge>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  这份结果只用于自我认知与心理教育。
                </h2>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                  它不构成医学诊断、心理治疗或专业意见。如果某些状态已经明显影响你的生活功能，下一步更合适的方向，是向专业支持靠近一步。
                </p>
              </div>
              <Button asChild variant="secondary" size="lg">
                <Link href="/assessment/start">进入测试前说明</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
