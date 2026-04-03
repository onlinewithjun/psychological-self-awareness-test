import Link from "next/link";
import { BookOpenText, Clock3, Database, Shield } from "lucide-react";

import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const notes = [
  {
    title: "预计 6 到 8 分钟",
    body: "默认是 8 段剧情章节。每次只做一个选择，节奏更像进入一段安静的互动叙事。",
    icon: Clock3,
  },
  {
    title: "结果默认保存在本机",
    body: "MVP 不要求登录。你可以在同一台设备上回看之前的剧情结局和画像变化。",
    icon: Database,
  },
  {
    title: "先做安全边界",
    body: "开始前会再次说明免责声明，并对高风险表达做拦截提示。",
    icon: Shield,
  },
  {
    title: "量表模式仍然可用",
    body: "如果你更想用传统题目作答，也可以在下一页切换到经典量表模式。",
    icon: BookOpenText,
  },
];

export default function AssessmentIntroPage() {
  return (
    <div className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeading
          eyebrow="测试介绍页"
          title="这次测试更像一段互动叙事，而不是一张答题卡。"
          description="我们把心理测评改造成了剧情向体验：你会在一段虚构夜晚里连续做选择，系统据此观察你在压力、关系、边界、行动和自我觉察里的自然偏向。"
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {notes.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <CardHeader>
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(111,143,183,0.12)] text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>开始前请先确认</CardTitle>
            <CardDescription>
              如果你正在寻找诊断、治疗方案，或者危机中的即时帮助，这里都不是合适的替代品。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>默认体验是 8 段连续剧情，每一段都围绕一种生活化情境展开，没有“最佳路线”。</p>
            <p>如果你更习惯传统测评，也仍然可以切换到 32 题的量表模式。</p>
            <p>我们关心的是“你最近更常怎样”，而不是“理论上你应该怎样”。</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg">
                <Link href="/assessment/start">继续，进入测试前说明</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/about">再看一次边界说明</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
