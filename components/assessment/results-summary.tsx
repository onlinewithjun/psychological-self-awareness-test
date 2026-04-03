"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRight, History, NotebookPen, RotateCcw } from "lucide-react";

import { FigureReferences } from "@/components/assessment/figure-references";
import { StoryOutcomePanel } from "@/components/assessment/story-outcome-panel";
import {
  DimensionBars,
  HistoryComparisonChart,
  ProfileRadar,
} from "@/components/assessment/visuals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadHistory, subscribeToStorage } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import type { AssessmentReport } from "@/lib/types";

function NotFoundState() {
  return (
    <div className="section-space">
      <div className="container-shell max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>没有找到这份结果</CardTitle>
            <CardDescription>
              这份报告可能来自另一台设备，或当前浏览器里已经没有对应的本机记录。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/assessment/start">重新开始一次测试</Link>
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

function getDynamicResultTitle(report: AssessmentReport) {
  if (report.storyOutcome) {
    return report.storyOutcome.title;
  }

  const salient = [...report.dimensions]
    .sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50))
    .slice(0, 2);

  if (salient.length >= 2) {
    return `你这次更靠近「${salient[0].anchorLabel}」与「${salient[1].anchorLabel}」的组合`;
  }

  if (salient.length === 1) {
    return `你这次更靠近「${salient[0].anchorLabel}」这一侧`;
  }

  return "这次结果更像你当前阶段的一张多维切片";
}

export function ResultsSummary({ sessionId }: { sessionId: string }) {
  const history = useSyncExternalStore(subscribeToStorage, loadHistory, loadHistory);
  const session = history.find((item) => item.id === sessionId) ?? null;
  const sessionIndex = history.findIndex((item) => item.id === sessionId);
  const previous =
    sessionIndex >= 0 && sessionIndex < history.length - 1
      ? history[sessionIndex + 1]
      : null;

  if (!session) {
    return <NotFoundState />;
  }

  const { report } = session;
  const figureReferences = report.figureReferences ?? [];
  const deepInsights = report.deepInsights ?? [];
  const growthPlan = report.growthPlan ?? [];
  const modeLabel = session.mode === "story" ? "剧情模式" : "量表模式";
  const resultTitle = getDynamicResultTitle(report);

  return (
    <div className="section-space">
      <div className="container-shell space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>结果页</Badge>
                <Badge className="bg-[rgba(243,247,250,0.85)]">{modeLabel}</Badge>
                <Badge>{formatDate(session.createdAt)}</Badge>
              </div>
              <CardTitle className="text-3xl leading-[1.35] sm:text-4xl">
                {resultTitle}
              </CardTitle>
              <CardDescription className="text-sm leading-7 sm:text-base">
                {report.overallSummary}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {session.note ? (
                <div className="rounded-[24px] border border-stroke bg-white/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <NotebookPen className="h-4 w-4 text-accent" />
                    进入测试前，你写下的关注点
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">{session.note}</p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href={`/report/${session.id}`}>
                    查看完整报告
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/assessment/start">
                    <RotateCcw className="h-4 w-4" />
                    重新测一次
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>维度总览</CardTitle>
              <CardDescription>
                分数越高，并不代表越好，只表示你这次更靠近该维度的某一侧。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DimensionBars report={report} />
            </CardContent>
          </Card>
        </section>

        {report.storyOutcome ? (
          <StoryOutcomePanel outcome={report.storyOutcome} compact />
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <Card>
            <CardHeader>
              <CardTitle>轮廓可视化</CardTitle>
              <CardDescription>
                图表只作为辅助阅读工具，不替代文字解释。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileRadar report={report} />
            </CardContent>
          </Card>

          <Tabs defaultValue="patterns">
            <TabsList>
              <TabsTrigger value="patterns">组合解读</TabsTrigger>
              <TabsTrigger value="contexts">情境建议</TabsTrigger>
              <TabsTrigger value="reminders">温和提醒</TabsTrigger>
            </TabsList>

            <TabsContent value="patterns">
              <div className="grid gap-4">
                {report.combinations.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {item.suggestion}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contexts">
              <div className="grid gap-4">
                {report.contexts.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription>{item.content}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reminders">
              <div className="grid gap-4">
                {report.gentleReminders.map((item) => (
                  <Card key={item}>
                    <CardContent className="p-5 text-sm leading-7 text-muted-foreground">
                      {item}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {figureReferences.length > 0 ? (
          <FigureReferences figures={figureReferences} compact />
        ) : null}

        {deepInsights.length > 0 || growthPlan.length > 0 ? (
          <section className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr] lg:items-start">
            {deepInsights.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>深入解析摘录</CardTitle>
                  <CardDescription>
                    这部分会把你的结果放回更完整的心理机制里解释。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {deepInsights.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[24px] border border-stroke bg-white/70 p-4"
                    >
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.summary}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {growthPlan.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>接下来可以怎么调</CardTitle>
                  <CardDescription>
                    先从能执行的小步骤开始，不急着一次改变很多。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {growthPlan.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[24px] border border-stroke bg-white/70 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge>{item.phase}</Badge>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {item.focus}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.actions[0]}
                      </p>
                    </div>
                  ))}

                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/report/${session.id}`}>
                      查看完整深入报告与改善计划
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </section>
        ) : null}

        {previous ? (
          <section>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <History className="h-4 w-4" />
                  与上一份本机记录对比
                </div>
                <CardTitle>你并不是固定不变的</CardTitle>
                <CardDescription>
                  这部分只帮助你观察相邻两次记录之间的变化，不是判断自己“进步了还是退步了”。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HistoryComparisonChart
                  current={session}
                  previous={previous}
                  currentLabel="当前查看"
                  previousLabel="更早一份"
                />
              </CardContent>
            </Card>
          </section>
        ) : null}
      </div>
    </div>
  );
}
