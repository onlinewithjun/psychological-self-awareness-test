"use client";

import { MoonStar, Sparkles } from "lucide-react";

import type { StoryOutcome } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StoryOutcomePanelProps = {
  outcome: StoryOutcome;
  compact?: boolean;
};

export function StoryOutcomePanel({
  outcome,
  compact = false,
}: StoryOutcomePanelProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4 border-b border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,247,250,0.88))]">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>剧情结局</Badge>
          <Badge className="bg-[rgba(243,247,250,0.85)]">当前状态映射</Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MoonStar className="h-4 w-4 text-accent" />
            夜航叙事的收束点
          </div>
          <CardTitle className="text-2xl leading-[1.35] sm:text-[1.8rem]">
            {outcome.title}
          </CardTitle>
          <CardDescription className="text-sm leading-7 sm:text-base">
            {outcome.subtitle}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5 sm:p-6">
        <div className="rounded-[24px] border border-stroke bg-white/70 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            这次结局在说什么
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            {outcome.summary}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-stroke bg-white/70 p-4">
            <p className="text-sm font-medium text-foreground">为什么会走到这里</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {outcome.why}
            </p>
          </div>

          {!compact ? (
            <div className="rounded-[24px] border border-stroke bg-[rgba(243,247,250,0.9)] p-4">
              <p className="text-sm font-medium text-foreground">给自己的回看角度</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {outcome.reflection}
              </p>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
