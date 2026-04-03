"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, NotebookPen } from "lucide-react";

import { makeInitialAssessmentDraft } from "@/lib/assessment-engine";
import { detectHighRiskExpression } from "@/lib/risk";
import { makeInitialStoryDraft } from "@/lib/story-engine";
import {
  loadDraft,
  loadStoryDraft,
  saveDraft,
  saveStoryDraft,
  subscribeToStorage,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function IntakeForm() {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const hasHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const storedStoryDraft = useSyncExternalStore(
    subscribeToStorage,
    loadStoryDraft,
    loadStoryDraft,
  );
  const storedSurveyDraft = useSyncExternalStore(
    subscribeToStorage,
    loadDraft,
    loadDraft,
  );
  const hasStoryDraft =
    !!storedStoryDraft && Array.isArray(storedStoryDraft.selectedChoiceIds);
  const hasStoryProgress =
    hasStoryDraft && storedStoryDraft.selectedChoiceIds.length > 0;
  const hasSurveyDraft =
    !!storedSurveyDraft && Object.keys(storedSurveyDraft.answers ?? {}).length > 0;

  const riskResult = useMemo(() => detectHighRiskExpression(note), [note]);

  function guardAssessmentEntry() {
    if (!consent) {
      setError(
        "开始前需要先确认：本工具用于自我认知与心理教育，不替代诊断或治疗。",
      );
      return false;
    }

    if (riskResult.hasHighRisk) {
      router.push("/support");
      return false;
    }

    setError("");
    return true;
  }

  function beginStory() {
    if (!guardAssessmentEntry()) {
      return;
    }

    const nextDraft = makeInitialStoryDraft(note.trim());
    saveStoryDraft(nextDraft);

    startTransition(() => {
      router.push("/assessment/journey");
    });
  }

  function continueStory() {
    if (!guardAssessmentEntry()) {
      return;
    }

    if (!storedStoryDraft) {
      beginStory();
      return;
    }

    startTransition(() => {
      router.push("/assessment/journey");
    });
  }

  function beginSurvey() {
    if (!guardAssessmentEntry()) {
      return;
    }

    const nextDraft = makeInitialAssessmentDraft(note.trim());
    saveDraft(nextDraft);

    startTransition(() => {
      router.push("/assessment/questions");
    });
  }

  function continueSurvey() {
    if (!guardAssessmentEntry()) {
      return;
    }

    if (!storedSurveyDraft) {
      beginSurvey();
      return;
    }

    startTransition(() => {
      router.push("/assessment/questions");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <Card>
        <CardHeader>
          <CardTitle>开始前说明</CardTitle>
          <CardDescription>
            这次默认是“剧情向测试”。你会在一段虚构夜晚里连续做选择，结局和画像会一起生成。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>它仍然不是游戏化娱乐站，故事只是帮助你更自然地暴露真实反应。</p>
          <p>每一章都会对应不同的心理行为线索，例如压力处理、边界表达、关系敏感度和行动启动方式。</p>
          <p>最终会给出剧情结局、当前画像、组合解读，以及与之匹配的温和提醒。</p>

          {hasHydrated && hasStoryProgress ? (
            <div className="rounded-[24px] border border-stroke bg-white/70 p-4">
              <p className="font-medium text-foreground">检测到未完成的剧情草稿</p>
              <p className="mt-2">
                你可以继续上次的夜航故事，也可以直接开始新的剧情版本。
              </p>
              <Button
                variant="secondary"
                className="mt-4 w-full"
                onClick={continueStory}
                disabled={isPending}
              >
                继续未完成的剧情
              </Button>
            </div>
          ) : null}

          {hasHydrated && hasSurveyDraft ? (
            <div className="rounded-[24px] border border-stroke bg-white/70 p-4">
              <p className="font-medium text-foreground">检测到未完成的量表草稿</p>
              <p className="mt-2">
                如果你更想回到题目模式，也可以继续之前未完成的问卷。
              </p>
              <Button
                variant="secondary"
                className="mt-4 w-full"
                onClick={continueSurvey}
                disabled={isPending}
              >
                继续未完成的量表
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>可选：写下你最近最想理解的一点</CardTitle>
          <CardDescription>
            这不是剧情答案的一部分，只是让你带着问题进入体验。若内容包含明显高风险表达，系统会优先引导你查看支持信息。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <NotebookPen className="h-4 w-4 text-accent" />
              当前最想弄清的一点（可选）
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              className="w-full rounded-[24px] border border-stroke bg-white/80 px-4 py-4 text-sm leading-7 text-foreground outline-none transition focus:border-[rgba(111,143,183,0.45)] focus:ring-4 focus:ring-[rgba(111,143,183,0.12)]"
              placeholder="例如：最近我常在忙乱里把自己顶得很紧，也会在关系里优先照顾别人，想更清楚地知道自己到底在怎样运作。"
            />
          </label>

          {riskResult.hasHighRisk ? (
            <div className="rounded-[24px] border border-[rgba(188,110,110,0.28)] bg-[rgba(255,244,244,0.88)] p-4 text-sm leading-7 text-[rgb(122,76,76)]">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-1 h-4 w-4 shrink-0" />
                <div>
                  检测到内容里可能包含明显风险信号。系统不会继续进入普通测试结果，而会优先引导你查看支持信息。
                </div>
              </div>
            </div>
          ) : null}

          <label className="flex items-start gap-3 rounded-[24px] border border-stroke bg-white/65 p-4 text-sm leading-7 text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-stroke text-accent accent-[color:var(--accent)]"
            />
            <span>
              我理解：本工具仅用于自我认知与心理教育，不构成医学诊断、心理治疗或专业意见；若我正处在明显危机中，应尽快联系专业支持或紧急援助。
            </span>
          </label>

          {error ? <p className="text-sm text-[rgb(138,80,80)]">{error}</p> : null}

          <div className="grid gap-3">
            <Button onClick={beginStory} size="lg" disabled={isPending}>
              开始新的剧情测试
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button onClick={beginSurvey} variant="secondary" size="lg" disabled={isPending}>
              改用量表模式
            </Button>
            <p className="text-xs leading-6 text-muted-foreground">
              两种模式都会输出同一套心理画像；剧情模式更像互动叙事，量表模式更像经典问卷。
            </p>
            <p className="text-xs leading-6 text-muted-foreground">
              若想再确认方法边界，可以查看
              {" "}
              <Link href="/about" className="text-foreground underline decoration-stroke underline-offset-4">
                关于与免责声明
              </Link>
              。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
