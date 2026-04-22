"use client";

import { ScoreCard } from "@/components/cards/score-card";
import { SimpleRadarChart } from "@/components/charts/radar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { buildCompareResult } from "@/lib/evaluation/api";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ComparePage() {
  const targets = useAppStore((s) => s.targets);
  const selectedIds = useAppStore((s) => s.selectedCompareIds);
  const toggleCompareId = useAppStore((s) => s.toggleCompareId);
  const clearCompareIds = useAppStore((s) => s.clearCompareIds);
  const [compareResult, setCompareResult] = useState<ReturnType<typeof buildCompareResult> | null>(null);

  const handleCompare = () => {
    if (selectedIds.length >= 2) {
      setCompareResult(buildCompareResult(selectedIds));
    }
  };

  const dimLabel: Record<string, string> = {
    communication: "传播力",
    commercial: "商业力",
    reputation: "口碑力",
    risk: "风险度",
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">对比分析</h1>
        <p className="text-sm text-muted-foreground mt-1">
          选择 2-4 个对象进行多维对比
        </p>
      </div>

      {/* 对象选择区 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              选择对比对象 ({selectedIds.length}/4)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearCompareIds}>
                清空
              </Button>
              <Button size="sm" disabled={selectedIds.length < 2} onClick={handleCompare}>
                开始对比
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {targets.map((target) => (
              <div
                key={target.id}
                onClick={() => toggleCompareId(target.id)}
                className={cn(
                  "cursor-pointer rounded-lg border p-3 transition-colors",
                  selectedIds.includes(target.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent"
                )}
              >
                <div className="font-medium text-sm truncate">{target.name}</div>
                <div className="text-xs text-muted-foreground">
                  {target.category === "ip" ? "IP" : target.category === "celebrity" ? "艺人" : "合作"}
                  · {target.industry}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 对比结果 */}
      {compareResult && compareResult.targets.length >= 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">综合评分对比</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {compareResult.scores.map((s) => (
                <ScoreCard key={s.targetId} score={s} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">能力雷达图</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleRadarChart
                data={[
                  {
                    subject: "传播力",
                    A: compareResult.scores[0]?.dimensions.communication ?? 0,
                    B: compareResult.scores[1]?.dimensions.communication,
                    fullMark: 100,
                  },
                  {
                    subject: "商业力",
                    A: compareResult.scores[0]?.dimensions.commercial ?? 0,
                    B: compareResult.scores[1]?.dimensions.commercial,
                    fullMark: 100,
                  },
                  {
                    subject: "口碑力",
                    A: compareResult.scores[0]?.dimensions.reputation ?? 0,
                    B: compareResult.scores[1]?.dimensions.reputation,
                    fullMark: 100,
                  },
                  {
                    subject: "风险度",
                    A: compareResult.scores[0]?.dimensions.risk ?? 0,
                    B: compareResult.scores[1]?.dimensions.risk,
                    fullMark: 100,
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">维度差异率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(compareResult.dimensionDiffs).map(([dim, diffs]) => (
                  <div key={dim} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm font-medium">{dimLabel[dim]}</span>
                    <div className="flex items-center gap-4">
                      {Object.entries(diffs).map(([id, diff]) => {
                        const target = compareResult.targets.find((t) => t.id === id);
                        return (
                          <div key={id} className="text-xs text-right">
                            <div className="text-muted-foreground">{target?.name.slice(0, 6)}</div>
                            <div className={cn("font-medium", diff === 0 ? "text-green-600" : "text-red-500")}>
                              {diff >= 0 ? "+" : ""}
                              {diff}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {compareResult.winnerId && (
                <p className="mt-4 text-sm font-medium text-green-600">
                  综合胜出: {compareResult.targets.find((t) => t.id === compareResult.winnerId)?.name}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-muted/50 border-dashed">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          预留功能：多选对比 / 历史时段对比 / 对比报告导出 / 差异分析
        </CardContent>
      </Card>
    </div>
  );
}
