import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MatchedFigure } from "@/lib/types";

export function FigureReferences({
  figures,
  compact = false,
}: {
  figures: MatchedFigure[];
  compact?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle>可能产生共鸣的参考人物</CardTitle>
          <Badge>仅作类比，不作等同判断</Badge>
        </div>
        <CardDescription>
          这部分不是在说“你就是这些名人”。它只是从更大的候选人物库里，挑出与你当前模式更容易产生共鸣的 2 个参考点，帮助你更立体地理解自己。
        </CardDescription>
      </CardHeader>
      <CardContent className={`grid gap-4 ${compact ? "xl:grid-cols-2" : "lg:grid-cols-2"}`}>
        {figures.map((figure) => (
          <div
            key={figure.id}
            className="rounded-[24px] border border-stroke bg-white/70 p-4"
          >
            <div className="flex gap-4">
              <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-[20px] border border-stroke bg-[rgba(244,247,250,0.75)] sm:w-28">
                {figure.imagePath ? (
                  <Image
                    src={figure.imagePath}
                    alt={figure.imageAlt ?? `${figure.name} 参考肖像`}
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className={
                      figure.imageFit === "contain"
                        ? "object-contain p-1.5"
                        : "object-cover"
                    }
                    style={{
                      objectPosition: figure.imagePosition ?? "50% 20%",
                    }}
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{figure.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {figure.era} · {figure.region} · {figure.role}
                    </p>
                  </div>
                  <Badge>{figure.matchScore}% 共鸣度</Badge>
                </div>

                {figure.matchHighlights?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {figure.matchHighlights.map((item) => (
                      <span
                        key={item}
                        className="inline-flex rounded-full border border-stroke bg-[rgba(243,247,250,0.9)] px-3 py-1 text-[11px] text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}

                <p className="text-sm leading-7 text-muted-foreground">
                  {figure.summary}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[20px] border border-stroke bg-[rgba(243,247,250,0.9)] p-4">
              <p className="text-sm leading-7 text-muted-foreground">{figure.resonance}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
