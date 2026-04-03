"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle, Sparkles } from "lucide-react";

import { storyScenes } from "@/data/story";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { generateAssessmentReportFromDimensionScores } from "@/lib/scoring";
import { calculateStoryScores } from "@/lib/story-engine";
import {
  clearStoryDraft,
  loadStoryDraft,
  saveStoryDraft,
  storeSession,
  subscribeToStorage,
} from "@/lib/storage";
import type { DimensionId, StoryDraft } from "@/lib/types";

export function StoryJourney() {
  const router = useRouter();
  const storedDraft = useSyncExternalStore(
    subscribeToStorage,
    loadStoryDraft,
    loadStoryDraft,
  );
  const [error, setError] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const activeDraft = storedDraft;
  const hasInvalidDraft =
    !!activeDraft &&
    (activeDraft.sceneIndex < 0 || activeDraft.sceneIndex >= storyScenes.length);

  useEffect(() => {
    if (hasInvalidDraft) {
      clearStoryDraft();
      router.replace("/assessment/start");
      return;
    }

    if (!activeDraft && !isCompleting) {
      router.replace("/assessment/start");
    }
  }, [activeDraft, hasInvalidDraft, isCompleting, router]);

  const scene = activeDraft ? storyScenes[activeDraft.sceneIndex] : null;
  const currentChoice = scene?.choices.find(
    (item) => item.id === activeDraft?.currentChoiceId,
  );
  const progressValue = activeDraft
    ? ((activeDraft.sceneIndex + 1) / storyScenes.length) * 100
    : 0;

  const dimensionSnapshot = useMemo(() => {
    if (!activeDraft) {
      return [];
    }

    const quickView: Array<{ id: DimensionId; label: string }> = [
      { id: "stress_response", label: "压力反应" },
      { id: "relational_security", label: "关系模式" },
      { id: "boundary_expression", label: "边界表达" },
      { id: "self_awareness", label: "自我觉察" },
    ];

    return quickView.map((item) => ({
      ...item,
      score: Math.round(activeDraft.dimensionScores[item.id]),
    }));
  }, [activeDraft]);

  function updateDraft(next: StoryDraft) {
    saveStoryDraft(next);
  }

  function applyChoice(choiceId: string) {
    if (!activeDraft || !scene) {
      return;
    }

    const choice = scene.choices.find((item) => item.id === choiceId);

    if (!choice) {
      return;
    }

    const nextSelectedChoiceIds = [...activeDraft.selectedChoiceIds];
    nextSelectedChoiceIds[activeDraft.sceneIndex] = choice.id;

    updateDraft({
      ...activeDraft,
      currentChoiceId: choice.id,
      dimensionScores: calculateStoryScores(
        nextSelectedChoiceIds.filter(Boolean) as string[],
      ),
      selectedChoiceIds: nextSelectedChoiceIds,
    });
    setError("");
  }

  function goPrevious() {
    if (!activeDraft) {
      return;
    }

    if (activeDraft.sceneIndex === 0) {
      router.push("/assessment/start");
      return;
    }

    const previousScene = storyScenes[activeDraft.sceneIndex - 1];
    const previousChoiceId =
      activeDraft.selectedChoiceIds[activeDraft.sceneIndex - 1] ?? undefined;

    updateDraft({
      ...activeDraft,
      sceneIndex: activeDraft.sceneIndex - 1,
      currentChoiceId: previousScene?.choices.find((item) => item.id === previousChoiceId)?.id,
    });
  }

  function goNext() {
    if (!activeDraft || !scene) {
      return;
    }

    if (!activeDraft.currentChoiceId) {
      setError("先做一个选择，再进入下一章。");
      return;
    }

    if (activeDraft.sceneIndex === storyScenes.length - 1) {
      setIsCompleting(true);
      const report = generateAssessmentReportFromDimensionScores(
        activeDraft.dimensionScores,
      );

      storeSession({
        id: activeDraft.id,
        createdAt: new Date().toISOString(),
        mode: "story",
        note: activeDraft.note,
        answers: {},
        report,
      });
      clearStoryDraft();

      startTransition(() => {
        router.push(`/results/${activeDraft.id}`);
      });
      return;
    }

    updateDraft({
      ...activeDraft,
      sceneIndex: activeDraft.sceneIndex + 1,
      currentChoiceId:
        activeDraft.selectedChoiceIds[activeDraft.sceneIndex + 1] ?? undefined,
    });
  }

  if (!activeDraft || !scene) {
    return (
      <div className="section-space">
        <div className="container-shell flex min-h-[55vh] items-center justify-center">
          <Card className="w-full max-w-xl">
            <CardContent className="flex items-center justify-center gap-3 p-8 text-sm text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              正在进入夜航故事…
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="section-space">
      <div className="container-shell max-w-5xl space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>剧情测试</p>
            <p>
              {scene.chapter} / 共 {storyScenes.length} 章
            </p>
          </div>
          <Progress value={progressValue} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <Card className="overflow-hidden">
            <CardHeader className="space-y-4 border-b border-white/60 bg-white/45 pb-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{scene.setting}</p>
                <CardTitle className="text-3xl leading-[1.35]">{scene.title}</CardTitle>
              </div>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                {scene.narration}
              </p>
              <div className="rounded-[24px] border border-stroke bg-white/70 p-4 text-sm leading-7 text-foreground">
                {scene.prompt}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="space-y-3">
                {scene.choices.map((choice) => {
                  const checked = activeDraft.currentChoiceId === choice.id;

                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => applyChoice(choice.id)}
                      className={`w-full rounded-[24px] border px-4 py-4 text-left transition-all ${
                        checked
                          ? "border-[rgba(111,143,183,0.42)] bg-white shadow-[0_18px_50px_-34px_rgba(51,74,114,0.44)]"
                          : "border-stroke bg-white/65 hover:bg-white/85"
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground">
                        {choice.label}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {choice.summary}
                      </p>
                    </button>
                  );
                })}
              </div>

              {currentChoice ? (
                <div className="rounded-[24px] border border-stroke bg-[rgba(243,247,250,0.9)] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Sparkles className="h-4 w-4 text-accent" />
                    当前剧情反馈
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {currentChoice.reaction}
                  </p>
                </div>
              ) : null}

              {error ? <p className="text-sm text-[rgb(138,80,80)]">{error}</p> : null}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/60 pt-2">
                <Button variant="ghost" size="lg" onClick={goPrevious}>
                  <ArrowLeft className="h-4 w-4" />
                  上一章
                </Button>
                <Button size="lg" onClick={goNext} disabled={isPending}>
                  {activeDraft.sceneIndex === storyScenes.length - 1
                    ? "生成结局与画像"
                    : "进入下一章"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>这段故事在观察什么</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>它不是在测“你会不会玩游戏”，而是在看你在模糊、压力、关系和行动里的自然偏向。</p>
                <p>不同选择不会被判断成对或错，只会把你推向不同的剧情结局与画像组合。</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>当前线索快照</CardTitle>
                <CardDescription>
                  这里只做很轻的过程反馈，完整解释会放到结尾报告里。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dimensionSnapshot.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.score}</p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[rgba(134,149,173,0.15)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-soft"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
