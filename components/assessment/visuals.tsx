"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AssessmentReport, SessionRecord } from "@/lib/types";
import { formatScore } from "@/lib/utils";

type DimensionBarsProps = {
  report: AssessmentReport;
};

export function DimensionBars({ report }: DimensionBarsProps) {
  return (
    <div className="space-y-4">
      {report.dimensions.map((dimension) => (
        <div key={dimension.id} className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">{dimension.name}</p>
              <p className="text-xs text-muted-foreground">{dimension.anchorLabel}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatScore(dimension.score)} / 100
            </p>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[rgba(134,149,173,0.14)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-soft"
              style={{ width: `${dimension.score}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{dimension.oppositeLabel}</span>
            <span>{dimension.anchorLabel}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

type ProfileRadarProps = {
  report: AssessmentReport;
};

function ChartShell({
  className,
  children,
}: {
  className: string;
  children: (size: { width: number; height: number }) => React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return;
    }

    const updateSize = () => {
      const nextWidth = node.clientWidth;
      const nextHeight = node.clientHeight;

      if (nextWidth > 0 && nextHeight > 0) {
        setSize((current) =>
          current.width === nextWidth && current.height === nextHeight
            ? current
            : { width: nextWidth, height: nextHeight },
        );
      }
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`${className} min-w-0`}>
      {size.width > 0 && size.height > 0 ? (
        children(size)
      ) : (
        <div className="h-full w-full animate-pulse rounded-[28px] bg-[rgba(243,247,250,0.72)]" />
      )}
    </div>
  );
}

export function ProfileRadar({ report }: ProfileRadarProps) {
  return (
    <ChartShell className="h-[300px] w-full sm:h-[360px]">
      {({ width, height }) => (
        <RadarChart width={width} height={height} data={report.radarData} outerRadius="68%">
          <PolarGrid stroke="rgba(116,132,155,0.18)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#5f6f87", fontSize: 12 }}
          />
          <Radar
            dataKey="score"
            stroke="rgba(96,127,166,0.9)"
            fill="rgba(111,143,183,0.18)"
            fillOpacity={1}
          />
          <Tooltip
            formatter={(value) => [`${value ?? 0} / 100`, "当前倾向"]}
            contentStyle={{
              borderRadius: 18,
              border: "1px solid rgba(109,128,155,0.18)",
              background: "rgba(255,255,255,0.96)",
              boxShadow: "0 22px 50px -36px rgba(38,54,78,0.35)",
              fontSize: 12,
            }}
          />
        </RadarChart>
      )}
    </ChartShell>
  );
}

type HistoryComparisonChartProps = {
  current: SessionRecord;
  previous: SessionRecord;
  currentLabel?: string;
  previousLabel?: string;
};

export function HistoryComparisonChart({
  current,
  previous,
  currentLabel = "当前",
  previousLabel = "上一份",
}: HistoryComparisonChartProps) {
  const chartData = current.report.dimensions.map((dimension) => {
    const previousDimension = previous.report.dimensions.find(
      (item) => item.id === dimension.id,
    );

    return {
      dimension: dimension.shortName,
      [currentLabel]: Math.round(dimension.score),
      [previousLabel]: Math.round(previousDimension?.score ?? 0),
    };
  });

  return (
    <ChartShell className="h-[340px] w-full">
      {({ width, height }) => (
        <BarChart
          width={width}
          height={height}
          data={chartData}
          margin={{ top: 8, right: 8, left: -20, bottom: 8 }}
        >
          <XAxis
            dataKey="dimension"
            tick={{ fill: "#5f6f87", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#5f6f87", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 18,
              border: "1px solid rgba(109,128,155,0.18)",
              background: "rgba(255,255,255,0.96)",
              boxShadow: "0 22px 50px -36px rgba(38,54,78,0.35)",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey={currentLabel}
            fill="rgba(111,143,183,0.85)"
            radius={[12, 12, 0, 0]}
          />
          <Bar
            dataKey={previousLabel}
            fill="rgba(189,201,220,0.88)"
            radius={[12, 12, 0, 0]}
          />
        </BarChart>
      )}
    </ChartShell>
  );
}
