"use client";

import { useState } from "react";
import { ScoreCard } from "@/components/cards/score-card";
import { TargetCard } from "@/components/cards/target-card";
import { FilterBar } from "@/components/filters/filter-bar";
import { TargetDetailDialog } from "@/components/detail/target-detail-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/store/app-store";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { MonitoringTarget } from "@/types";

const gradeOptions = [
  { value: null, label: "全部" },
  { value: "S", label: "S" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
];

export default function CooperationPage() {
  const targets = useAppStore((s) => s.targets);
  const [gradeFilter, setGradeFilter] = useState<string | null>(null);
  const [detailTarget, setDetailTarget] = useState<MonitoringTarget | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  let cooperationTargets = targets.filter((t) => t.category === "cooperation");

  if (gradeFilter) {
    cooperationTargets = cooperationTargets.filter((t) => {
      const score = calculateEvaluationScore(t);
      return score.grade === gradeFilter;
    });
  }

  const avgScore =
    cooperationTargets.length > 0
      ? Math.round(
          cooperationTargets.reduce((s, t) => s + calculateEvaluationScore(t).total, 0) /
            cooperationTargets.length
        )
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">合作评估</h1>
          <p className="text-sm text-muted-foreground mt-1">
            历史合作案例回顾与4维效果评估（{cooperationTargets.length} 个）
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{avgScore}</div>
          <div className="text-xs text-muted-foreground">平均综合评分</div>
        </div>
      </div>

      <FilterBar
        title="等级"
        options={gradeOptions}
        value={gradeFilter}
        onChange={setGradeFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cooperationTargets.map((target) => (
          <TargetCard
            key={target.id}
            target={target}
            onClick={() => {
              setDetailTarget(target);
              setDetailOpen(true);
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cooperationTargets.map((target) => {
          const score = calculateEvaluationScore(target);
          return <ScoreCard key={target.id} score={score} />;
        })}
      </div>

      {cooperationTargets.length === 0 && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            未找到匹配的合作案例
          </CardContent>
        </Card>
      )}

      <TargetDetailDialog target={detailTarget} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
