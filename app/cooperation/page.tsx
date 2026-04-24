"use client";

import { useState } from "react";
import { ScoreCard } from "@/components/cards/score-card";
import { TargetCard } from "@/components/cards/target-card";
import { FilterBar } from "@/components/filters/filter-bar";
import { TargetDetailDialog } from "@/components/detail/target-detail-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader, EmptyState } from "@/components/shared";
import { useAppStore } from "@/store/app-store";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { MonitoringTarget } from "@/types";
import { Briefcase } from "lucide-react";

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
    <div className="space-y-4 animate-fade-in">
      <SectionHeader
        title="合作评估"
        description={`历史合作案例回顾与4维效果评估（${cooperationTargets.length} 个）`}
        helpText="合作案例按综合评分等级筛选，可快速定位高价值或高风险的合作项目。"
        action={
          <div className="text-right shrink-0">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight">{avgScore}</div>
            <div className="text-xs text-muted-foreground">平均综合评分</div>
          </div>
        }
      />

      <FilterBar
        title="等级"
        options={gradeOptions}
        value={gradeFilter}
        onChange={setGradeFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cooperationTargets.map((target) => {
          const score = calculateEvaluationScore(target);
          return <ScoreCard key={target.id} score={score} />;
        })}
      </div>

      {cooperationTargets.length === 0 && (
        <Card className="bg-muted/40 border-dashed">
          <CardContent>
            <EmptyState
              icon={<Briefcase className="h-6 w-6 text-muted-foreground" />}
              title="未找到匹配的合作案例"
              description="当前等级筛选条件下无合作案例，请尝试其他等级"
            />
          </CardContent>
        </Card>
      )}

      <TargetDetailDialog
        target={detailTarget}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
