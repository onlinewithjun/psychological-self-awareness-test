"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowLeft, Download, ShieldCheck } from "lucide-react";

import { FigureReferences } from "@/components/assessment/figure-references";
import { StoryOutcomePanel } from "@/components/assessment/story-outcome-panel";
import { DimensionBars, ProfileRadar } from "@/components/assessment/visuals";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadHistory, subscribeToStorage } from "@/lib/storage";
import { formatDate, formatScore } from "@/lib/utils";

function ReportNotFound() {
  return (
    <div className="section-space">
      <div className="container-shell max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>没有找到这份详细报告</CardTitle>
            <CardDescription>
              这份报告只保存在你当前浏览器的本机存储里。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button asChild>
              <Link href="/assessment/start">重新开始测试</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/history">查看本机历史</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ReportDetails({ sessionId }: { sessionId: string }) {
  const history = useSyncExternalStore(subscribeToStorage, loadHistory, loadHistory);
  const session = history.find((item) => item.id === sessionId) ?? null;

  if (!session) {
    return <ReportNotFound />;
  }

  const { report } = session;
  const figureReferences = report.figureReferences ?? [];
  const deepInsights = report.deepInsights ?? [];
  const growthPlan = report.growthPlan ?? [];
  const reflectionPrompts = report.reflectionPrompts ?? [];

  return (
    <div className="section-space">
      <div className="container-shell space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>报告详情页</Badge>
                <Badge className="bg-[rgba(243,247,250,0.85)]">
                  {session.mode === "story" ? "剧情模式" : "量表模式"}
                </Badge>
                <Badge>{formatDate(session.createdAt)}</Badge>
              </div>
              <CardTitle className="text-3xl leading-[1.35] sm:text-4xl">
                一份更完整的当下解释
              </CardTitle>
              <CardDescription className="text-sm leading-7 sm:text-base">
                {report.overallSummary}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href={`/results/${sessionId}`}>
                  <ArrowLeft className="h-4 w-4" />
                  返回结果总览
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.print()}
                className="text-foreground"
              >
                <Download className="h-4 w-4" />
                导出 / 打印为 PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>概览图</CardTitle>
              <CardDescription>
                阅读时可以把图表和下面的文字解释放在一起看。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProfileRadar report={report} />
              <DimensionBars report={report} />
            </CardContent>
          </Card>
        </section>

        {report.storyOutcome ? <StoryOutcomePanel outcome={report.storyOutcome} /> : null}

        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              维度结果与报告结构
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              每个维度都用同一套结构解释：当前倾向、可能优势、可能代价、压力下的变化，以及可以尝试的调整方向。
            </p>
          </div>
          <div className="grid gap-4">
            {report.dimensions.map((dimension) => (
              <Card key={dimension.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle>{dimension.name}</CardTitle>
                      <CardDescription>{dimension.description}</CardDescription>
                    </div>
                    <Badge>{formatScore(dimension.score)} / 100</Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[24px] border border-stroke bg-white/70 p-4">
                    <p className="text-sm font-medium text-foreground">当前倾向表现</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {dimension.currentTendency}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-stroke bg-white/70 p-4">
                    <p className="text-sm font-medium text-foreground">可能的优势</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {dimension.strengths}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-stroke bg-white/70 p-4">
                    <p className="text-sm font-medium text-foreground">可能的代价 / 盲点</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {dimension.costs}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-stroke bg-white/70 p-4">
                    <p className="text-sm font-medium text-foreground">在压力下可能如何变化</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {dimension.pressureShift}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-stroke bg-[rgba(243,247,250,0.9)] p-4 lg:col-span-2">
                    <p className="text-sm font-medium text-foreground">可尝试的自我调整方向</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {dimension.adjustment}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>组合解读</CardTitle>
              <CardDescription>
                这里强调的是模式，而不是“类型”。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.combinations.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-stroke bg-white/70 p-4"
                >
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.suggestion}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>情境建议</CardTitle>
              <CardDescription>
                同一个人会因为场景不同，启动不同的部分。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.contexts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-stroke bg-white/70 p-4"
                >
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.content}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {figureReferences.length > 0 ? <FigureReferences figures={figureReferences} /> : null}

        {deepInsights.length > 0 ? (
          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                深入解析
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                这部分会把结果放回更完整的心理机制里解释，尽量兼顾专业性与可理解性。
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {deepInsights.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-lg leading-8">{item.title}</CardTitle>
                    <CardDescription>{item.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {item.detail}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {growthPlan.length > 0 ? (
          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                改善与调整计划
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                这不是硬性的自我改造清单，而是一份更容易执行、可以按阶段推进的微调路线图。
              </p>
            </div>
            <div className="grid gap-4">
              {growthPlan.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge>{item.phase}</Badge>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </div>
                    <CardDescription>{item.focus}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-[24px] border border-stroke bg-white/70 p-4">
                      <p className="text-sm font-medium text-foreground">为什么先做这一步</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.rationale}
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-stroke bg-[rgba(243,247,250,0.9)] p-4">
                      <p className="text-sm font-medium text-foreground">可以直接开始的动作</p>
                      <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
                        {item.actions.map((action) => (
                          <li key={action} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[24px] border border-stroke bg-white/70 p-4">
                      <p className="text-sm font-medium text-foreground">如何判断这一步开始有效</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.checkpoint}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {reflectionPrompts.length > 0 ? (
          <section>
            <Card>
              <CardHeader>
                <CardTitle>反思提示</CardTitle>
                <CardDescription>
                  如果你想把这次结果用在后续观察里，可以从这几个问题开始。
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {reflectionPrompts.map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-stroke bg-white/70 p-4 text-sm leading-7 text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-accent" />
                温和提醒
              </div>
              <CardTitle>什么时候值得考虑多找一点支持</CardTitle>
              <CardDescription>
                这些提醒不是诊断结论，只是在提示你关注自己的状态是否已经明显影响生活。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.gentleReminders.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-stroke bg-white/70 p-4 text-sm leading-7 text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="scoring">
              <AccordionTrigger>评分模型说明</AccordionTrigger>
              <AccordionContent>
                每题使用 1 到 5 分作答，反向题会做方向转换，再按维度计算 0 到
                100 的结构化分数。分数只表示你更靠近某一侧，不表示优劣等级。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="generation">
              <AccordionTrigger>报告生成策略</AccordionTrigger>
              <AccordionContent>
                报告由“结构化评分 + 模板化解释 + 组合规则”生成，不会根据回答自由脑补你的童年经历、创伤史或未被测得的人生信息。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="boundary">
              <AccordionTrigger>产品边界与免责声明</AccordionTrigger>
              <AccordionContent>
                本工具仅用于自我认知与心理教育，不替代医学诊断、心理治疗或专业意见。若你存在明显情绪危机、自伤自杀想法、伤害他人的冲动或严重功能受损，请尽快寻求专业帮助。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  );
}
