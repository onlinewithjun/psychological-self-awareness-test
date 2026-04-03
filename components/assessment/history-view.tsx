"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { HistoryComparisonChart } from "@/components/assessment/visuals";
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
import { formatDate } from "@/lib/utils";

export function HistoryView() {
  const history = useSyncExternalStore(subscribeToStorage, loadHistory, loadHistory);

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>还没有本机记录</CardTitle>
          <CardDescription>
            完成一次测试后，结果会默认保存在当前浏览器里，方便之后回看。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/assessment/start">开始第一次测试</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const [latest, previous] = history;

  return (
    <div className="space-y-6">
      {latest && previous ? (
        <Card>
          <CardHeader>
            <CardTitle>最近两次结果对比</CardTitle>
            <CardDescription>
              只用于帮助你观察变化趋势，不是评价自己“好转”还是“变差”。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HistoryComparisonChart
              current={latest}
              previous={previous}
              currentLabel="最新"
              previousLabel="上一份"
            />
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {history.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">{formatDate(item.createdAt)}</CardTitle>
                  <CardDescription>
                    {item.mode === "story" && item.report.storyOutcome
                      ? `${item.report.storyOutcome.title} · ${item.report.overallSummary}`
                      : item.report.overallSummary}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[rgba(243,247,250,0.85)]">
                    {item.mode === "story" ? "剧情模式" : "量表模式"}
                  </Badge>
                  <Badge>{item.report.dimensions.length} 个维度</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={`/results/${item.id}`}>查看总览</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={`/report/${item.id}`}>查看详细报告</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
