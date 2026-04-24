"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvaluationScore } from "@/types";
import { cn } from "@/lib/utils";
import { gradeStyle, dimLabel } from "@/lib/labels";
import { Progress } from "@/components/ui/progress";

interface ScoreCardProps {
  score: EvaluationScore;
  compact?: boolean;
}

/**
 * 评分明细卡片
 * 展示 4 维得分与综合等级
 */
export function ScoreCard({ score, compact }: ScoreCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border shrink-0",
            gradeStyle[score.grade]
          )}
        >
          {score.grade}
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{score.targetName}</div>
          <div className="text-[11px] text-muted-foreground truncate">
            总分 {score.total} · 传播{score.dimensions.communication} 商业
            {score.dimensions.commercial} 口碑
            {score.dimensions.reputation} 风险
            {score.dimensions.risk}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="card-elevated overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium truncate">
            {score.targetName}
          </CardTitle>
          <div
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-md border shrink-0",
              gradeStyle[score.grade]
            )}
          >
            {score.grade} · {score.total}分
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4 px-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {(Object.keys(score.dimensions) as Array<keyof typeof score.dimensions>).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{dimLabel[key]}</span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    key === "risk" && score.dimensions[key] > 40
                      ? "text-red-500"
                      : "text-foreground"
                  )}
                >
                  {score.dimensions[key]}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Progress value={score.total} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}
