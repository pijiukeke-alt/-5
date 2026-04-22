"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvaluationScore } from "@/types";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  score: EvaluationScore;
  compact?: boolean;
}

const gradeStyle: Record<string, string> = {
  S: "bg-amber-100 text-amber-700 border-amber-200",
  A: "bg-green-100 text-green-700 border-green-200",
  B: "bg-blue-100 text-blue-700 border-blue-200",
  C: "bg-gray-100 text-gray-700 border-gray-200",
  D: "bg-red-100 text-red-700 border-red-200",
};

const dimLabel: Record<string, string> = {
  communication: "传播力",
  commercial: "商业力",
  reputation: "口碑力",
  risk: "风险度",
};

export function ScoreCard({ score, compact }: ScoreCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border",
            gradeStyle[score.grade]
          )}
        >
          {score.grade}
        </div>
        <div>
          <div className="font-medium text-sm">{score.targetName}</div>
          <div className="text-xs text-muted-foreground">
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {score.targetName}
          </CardTitle>
          <div
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded border",
              gradeStyle[score.grade]
            )}
          >
            {score.grade} · {score.total}分
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {(
            Object.keys(score.dimensions) as Array<
              keyof typeof score.dimensions
            >
          ).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {dimLabel[key]}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  key === "risk" && score.dimensions[key] > 40
                    ? "text-red-500"
                    : "text-foreground"
                )}
              >
                {score.dimensions[key]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
