"use client";

import { useState, useMemo } from "react";
import { ScoreCard } from "@/components/cards/score-card";
import { RiskCard } from "@/components/cards/risk-card";
import { SimpleRadarChart } from "@/components/charts/radar-chart";
import { TrendLineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/app-store";
import { buildCompareResult } from "@/lib/evaluation/api";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { cn } from "@/lib/utils";
import { toChartData } from "@/lib/transform";
import { TargetDetailDialog } from "@/components/detail/target-detail-dialog";
import { MonitoringTarget } from "@/types";
import {
  GitCompare,
  Trophy,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export default function ComparePage() {
  const targets = useAppStore((s) => s.targets);
  const selectedIds = useAppStore((s) => s.selectedCompareIds);
  const toggleCompareId = useAppStore((s) => s.toggleCompareId);
  const clearCompareIds = useAppStore((s) => s.clearCompareIds);
  const [compareResult, setCompareResult] = useState<ReturnType<typeof buildCompareResult> | null>(null);
  const [detailTarget, setDetailTarget] = useState<MonitoringTarget | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

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

  // 自动结论摘要
  const conclusion = useMemo(() => {
    if (!compareResult || compareResult.scores.length < 2) return null;
    const winner = compareResult.scores.reduce((best, curr) => (curr.total > best.total ? curr : best));
    const loser = compareResult.scores.reduce((best, curr) => (curr.total < best.total ? curr : best));
    const diff = winner.total - loser.total;

    // 找出 winner 最强的维度
    let bestDim = "";
    let bestDimVal = -1;
    Object.entries(winner.dimensions).forEach(([dim, val]) => {
      if (dim !== "risk" && val > bestDimVal) {
        bestDimVal = val;
        bestDim = dim;
      }
    });

    // 找出 loser 最弱的维度
    let worstDim = "";
    let worstDimVal = 101;
    Object.entries(loser.dimensions).forEach(([dim, val]) => {
      if (dim !== "risk" && val < worstDimVal) {
        worstDimVal = val;
        worstDim = dim;
      }
    });

    return {
      winnerName: winner.targetName,
      loserName: loser.targetName,
      diff,
      bestDim: dimLabel[bestDim],
      worstDim: dimLabel[worstDim],
    };
  }, [compareResult]);

  const openDetail = (target: MonitoringTarget) => {
    setDetailTarget(target);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          对比分析
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          选择 2-4 个对象进行多维对比，自动生成结论摘要
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
            {targets.map((target) => {
              const score = calculateEvaluationScore(target);
              return (
                <div
                  key={target.id}
                  onClick={() => toggleCompareId(target.id)}
                  className={cn(
                    "cursor-pointer rounded-lg border p-3 transition-colors relative",
                    selectedIds.includes(target.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  )}
                >
                  {selectedIds.includes(target.id) && (
                    <div className="absolute top-1 right-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="font-medium text-sm truncate">{target.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {target.category === "ip" ? "IP" : target.category === "celebrity" ? "艺人" : "合作"}
                    · {target.industry}
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <Badge variant="outline" className="text-[10px]">
                      {score.grade} · {score.total}分
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 对比结果 */}
      {compareResult && compareResult.targets.length >= 2 && (
        <div className="space-y-4">
          {/* 综合得分对比 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                综合得分对比
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {compareResult.scores.map((s) => (
                <div
                  key={s.targetId}
                  onClick={() => {
                    const t = targets.find((x) => x.id === s.targetId);
                    if (t) openDetail(t);
                  }}
                  className="cursor-pointer"
                >
                  <ScoreCard score={s} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 雷达图对比 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">能力雷达图对比</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleRadarChart
                subjects={["传播力", "商业力", "口碑力", "风险度"]}
                series={compareResult.scores.map((s, i) => ({
                  name: s.targetName.slice(0, 6),
                  data: [
                    s.dimensions.communication,
                    s.dimensions.commercial,
                    s.dimensions.reputation,
                    s.dimensions.risk,
                  ],
                  color: ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b"][i % 4],
                  fillOpacity: 0.2,
                }))}
              />
            </CardContent>
          </Card>

          {/* 趋势对比 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                热度趋势对比（30天）
              </CardTitle>
            </CardHeader>
            <CardContent>
              {compareResult.targets[0]?.trend.dates && (
                <TrendLineChart
                  data={compareResult.targets[0].trend.dates.map((date, i) => ({
                    name: date,
                    value: Math.round(
                      compareResult.targets.reduce((sum, t) => sum + (t.trend.heat[i] || 0), 0) /
                        compareResult.targets.length
                    ),
                  }))}
                  color="#8b5cf6"
                />
              )}
            </CardContent>
          </Card>

          {/* 风险对比 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                风险对比
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {compareResult.targets.map((t) => {
                  const s = compareResult.scores.find((sc) => sc.targetId === t.id);
                  const unresolved = t.riskEvents.filter((e) => !e.resolved);
                  return (
                    <div
                      key={t.id}
                      className="rounded-lg border p-3 cursor-pointer hover:shadow-sm transition-shadow"
                      onClick={() => openDetail(t)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{t.name}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            s && s.dimensions.risk > 40
                              ? "border-red-200 text-red-600"
                              : "border-green-200 text-green-600"
                          )}
                        >
                          风险度 {s?.dimensions.risk ?? 0}
                        </Badge>
                      </div>
                      {unresolved.length > 0 ? (
                        <div className="space-y-2">
                          {unresolved.map((e) => (
                            <RiskCard key={e.id} event={e} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">无未解决风险事件</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 维度差异率 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">维度差异分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(compareResult.dimensionDiffs).map(([dim, diffs]) => (
                  <div
                    key={dim}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <span className="text-sm font-medium">{dimLabel[dim]}</span>
                    <div className="flex items-center gap-4">
                      {Object.entries(diffs).map(([id, diff]) => {
                        const target = compareResult.targets.find((t) => t.id === id);
                        return (
                          <div key={id} className="text-xs text-right">
                            <div className="text-muted-foreground">{target?.name.slice(0, 6)}</div>
                            <div
                              className={cn(
                                "font-medium",
                                diff === 0 ? "text-green-600" : "text-red-500"
                              )}
                            >
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
            </CardContent>
          </Card>

          {/* 自动结论摘要 */}
          {conclusion && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  自动结论摘要
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p>
                    综合评分最高为 <span className="font-semibold">{conclusion.winnerName}</span>，
                    较 <span className="font-semibold">{conclusion.loserName}</span> 领先{" "}
                    <span className="font-semibold text-green-600">{conclusion.diff} 分</span>。
                  </p>
                  <p>
                    {conclusion.winnerName} 在{" "}
                    <span className="font-semibold">{conclusion.bestDim}</span>{" "}
                    维度表现最优；{conclusion.loserName} 在{" "}
                    <span className="font-semibold">{conclusion.worstDim}</span>{" "}
                    维度相对薄弱，建议重点关注提升。
                  </p>
                  {compareResult.scores.some((s) => s.dimensions.risk > 40) && (
                    <p className="flex items-start gap-1 text-red-600">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      注意：部分对象风险度偏高，建议审慎评估合作风险。
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
