"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";

import { getQuestionOptionExample } from "@/data/question-option-contexts";
import { likertOptions, questions } from "@/data/assessment";
import { generateAssessmentReport } from "@/lib/scoring";
import {
  clearDraft,
  loadDraft,
  saveDraft,
  storeSession,
  subscribeToStorage,
} from "@/lib/storage";
import type { AnswerMap } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type DraftState = {
  id: string;
  createdAt: string;
  note: string;
  answers: AnswerMap;
  questionIndex: number;
};

export function Questionnaire() {
  const router = useRouter();
  const storedDraft = useSyncExternalStore(subscribeToStorage, loadDraft, loadDraft);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const activeDraft = storedDraft;
  const hasInvalidDraft =
    !!activeDraft &&
    (activeDraft.questionIndex < 0 || activeDraft.questionIndex >= questions.length);

  useEffect(() => {
    if (hasInvalidDraft) {
      clearDraft();
      router.replace("/assessment/start");
      return;
    }

    if (!activeDraft && !isCompleting) {
      router.replace("/assessment/start");
    }
  }, [activeDraft, hasInvalidDraft, isCompleting, router]);

  const question = activeDraft ? questions[activeDraft.questionIndex] : null;
  const progressValue = activeDraft
    ? ((activeDraft.questionIndex + 1) / questions.length) * 100
    : 0;
  const currentAnswer = question ? activeDraft?.answers[question.id] : undefined;

  const answeredCount = useMemo(() => {
    return activeDraft ? Object.keys(activeDraft.answers).length : 0;
  }, [activeDraft]);

  function updateDraft(next: DraftState) {
    saveDraft(next);
  }

  function selectAnswer(value: number) {
    if (!activeDraft || !question) {
      return;
    }

    updateDraft({
      ...activeDraft,
      answers: {
        ...activeDraft.answers,
        [question.id]: value,
      },
    });
    setError("");
  }

  function goPrevious() {
    if (!activeDraft) {
      return;
    }

    if (activeDraft.questionIndex === 0) {
      router.push("/assessment/start");
      return;
    }

    updateDraft({
      ...activeDraft,
      questionIndex: activeDraft.questionIndex - 1,
    });
  }

  function goNext() {
    if (!activeDraft || !question) {
      return;
    }

    if (!activeDraft.answers[question.id]) {
      setError("先选一个最接近你的答案，再进入下一题。");
      return;
    }

    if (activeDraft.questionIndex === questions.length - 1) {
      const report = generateAssessmentReport(activeDraft.answers);
      const sessionId = activeDraft.id;
      setIsCompleting(true);

      storeSession({
        id: sessionId,
        createdAt: new Date().toISOString(),
        mode: "survey",
        note: activeDraft.note,
        answers: activeDraft.answers,
        report,
      });
      clearDraft();

      startTransition(() => {
        router.push(`/results/${sessionId}`);
      });
      return;
    }

    updateDraft({
      ...activeDraft,
      questionIndex: activeDraft.questionIndex + 1,
    });
  }

  if (!activeDraft || !question) {
    return (
      <div className="section-space">
        <div className="container-shell flex min-h-[55vh] items-center justify-center">
          <Card className="w-full max-w-xl">
            <CardContent className="flex items-center justify-center gap-3 p-8 text-sm text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              正在准备问卷…
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="section-space">
      <div className="container-shell max-w-4xl space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>测试进行页</p>
            <p>
              已完成 {answeredCount} / {questions.length}
            </p>
          </div>
          <Progress value={progressValue} />
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="space-y-4 border-b border-white/60 bg-white/45 pb-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                第 {activeDraft.questionIndex + 1} 题 / 共 {questions.length} 题
              </span>
              <span className="rounded-full border border-stroke bg-white/70 px-3 py-1 text-xs text-muted-foreground">
                请选最近更常出现的状态
              </span>
            </div>
            <CardTitle className="text-2xl leading-[1.5] sm:text-[1.8rem] sm:leading-[1.55]">
              {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <fieldset className="space-y-3">
              <legend className="mb-2 text-sm text-muted-foreground">
                请选择最接近你的选项
              </legend>

              {likertOptions.map((option) => {
                const checked = currentAnswer === option.value;
                const optionExample = getQuestionOptionExample(
                  question.id,
                  option.value,
                );

                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-4 rounded-[24px] border px-4 py-4 transition-all ${
                      checked
                        ? "border-[rgba(111,143,183,0.42)] bg-white shadow-[0_18px_50px_-34px_rgba(51,74,114,0.44)]"
                        : "border-stroke bg-white/65 hover:bg-white/85"
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={checked}
                      onChange={() => selectAnswer(option.value)}
                      className="sr-only"
                    />
                    <span
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-medium ${
                        checked
                          ? "border-[rgba(111,143,183,0.42)] bg-[rgba(111,143,183,0.12)] text-foreground"
                          : "border-stroke bg-white/85 text-muted-foreground"
                      }`}
                    >
                      {option.value}
                    </span>
                    <span className="space-y-1.5">
                      <span className="block text-sm font-medium text-foreground">
                        {option.label}
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        {option.helper}
                      </span>
                      <span className="block text-[13px] leading-6 text-muted-foreground">
                        {optionExample}
                      </span>
                    </span>
                  </label>
                );
              })}
            </fieldset>

            {error ? <p className="text-sm text-[rgb(138,80,80)]">{error}</p> : null}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/60 pt-2">
              <Button variant="ghost" size="lg" onClick={goPrevious}>
                <ArrowLeft className="h-4 w-4" />
                上一题
              </Button>
              <Button size="lg" onClick={goNext} disabled={isPending}>
                {activeDraft.questionIndex === questions.length - 1
                  ? "生成结果"
                  : "下一题"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
