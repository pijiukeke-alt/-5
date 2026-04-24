"use client";

import { useState, useMemo } from "react";
import { ScoreCard } from "@/components/cards/score-card";
import { RiskCard } from "@/components/cards/risk-card";
import { SimpleRadarChart } from "@/components/charts/radar-chart";
import { TrendLineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader, EmptyState } from "@/components/shared";
import { useAppStore } from "@/store/app-store";
import { buildCompareResult } from "@/lib/evaluation/api";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { cn } from "@/lib/utils";
import { dimLabel } from "@/lib/labels";
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
  X,
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

  // 自动结论摘要
  const conclusion = useMemo(() => {
    if (!compareResult || compareResult.scores.length < 2) return null;
    const winner = compareResult.scores.reduce((best, curr) => (curr.total > best.total ? curr : best));
    const loser = compareResult.scores.reduce((best, curr) => (curr.total < best.total ? curr : best));
    const diff = winner.total - loser.total;

    let bestDim = "";
    let bestDimVal = -1;
    Object.entries(winner.dimensions).forEach(([dim, val]) => {
      if (dim !== "risk" && val > bestDimVal) {
        bestDimVal = val;
        bestDim = dim;
      }
    });

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
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="对比分析"
        description="选择 2-4 个对象进行多维对比，自动生成结论摘要"
        helpText="点击卡片选中对象，最多可选4个。对比维度包括传播力、商业力、口碑力、风险度及30天热度趋势。"
      />

      {/* 对象选择区 */}
      <Card className="card-elevated">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-medium">
              选择对比对象 ({selectedIds.length}/4)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearCompareIds} className="text-xs h-8">
                <X className="h-3.5 w-3.5 mr-1" />
                清空
              </Button>
              <Button size="sm" disabled={selectedIds.length < 2} onClick={handleCompare} className="text-xs h-8">
                <GitCompare className="h-3.5 w-3.5 mr-1" />
                开始对比
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4 px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {targets.map((target) => {
              const score = calculateEvaluationScore(target);
              const isSelected = selectedIds.includes(target.id);
              return (
                <div
                  key={target.id}
                  onClick={() => toggleCompareId(target.id)}
                  className={cn(
                    "cursor-pointer rounded-xl border p-3 transition-all relative select-none",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:bg-accent hover:border-accent"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="font-medium text-sm truncate pr-5">{target.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {target.category === "ip"
                      ? "IP"
                      : target.category === "celebrity"
                      ? "艺人"
                      : "合作"}
                    · {target.industry}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1">
                    <Badge variant="outline" className="text-[10px]">
                      {score.grade} · {score.total}分
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
          {selectedIds.length < 2 && (
            <p className="text-xs text-muted-foreground mt-3 text-center">
              请至少选择 2 个对象进行对比
            </p>
          )}
        </CardContent>
      </Card>

      {/* 对比结果 */}
      {compareResult && compareResult.targets.length >= 2 && (
        <div className="space-y-4 animate-fade-in">
          {/* 综合得分对比 */}
          <Card className="card-elevated">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                综合得分对比
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
          <Card className="card-elevated">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium">能力雷达图对比</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 px-4">
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
                  color: ["#2563eb", "#dc2626", "#059669", "#d97706"][i % 4],
                  fillOpacity: 0.2,
                }))}
              />
            </CardContent>
          </Card>

          {/* 趋势对比 */}
          <Card className="card-elevated">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                热度趋势对比（30天）
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 px-4">
              {compareResult.targets[0]?.trend.dates ? (
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
              ) : (
                <EmptyState title="无趋势数据" description="选中对象缺少历史趋势数据" />
              )}
            </CardContent>
          </Card>

          {/* 风险对比 */}
          <Card className="card-elevated">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                风险对比
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 px-4">
              <div className="space-y-3">
                {compareResult.targets.map((t) => {
                  const s = compareResult.scores.find((sc) => sc.targetId === t.id);
                  const unresolved = t.riskEvents.filter((e) => !e.resolved);
                  return (
                    <div
                      key={t.id}
                      className="rounded-xl border p-3 sm:p-4 cursor-pointer hover:shadow-sm transition-shadow"
                      onClick={() => openDetail(t)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{t.name}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            s && s.dimensions.risk > 40
                              ? "border-red-200 text-red-600"
                              : "border-emerald-200 text-emerald-600"
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
          <Card className="card-elevated">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium">维度差异分析</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 px-4">
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
                            <div className="text-muted-foreground truncate max-w-[80px]">{target?.name.slice(0, 6)}</div>
                            <div
                              className={cn(
                                "font-semibold",
                                diff === 0 ? "text-emerald-600" : "text-red-500"
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
            <Card className="card-elevated border-amber-200/60 bg-amber-50/30">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  自动结论摘要
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 px-4">
                <div className="text-sm space-y-2 leading-relaxed">
                  <p>
                    综合评分最高为{" "}
                    <span className="font-semibold">{conclusion.winnerName}</span>，
                    较{" "}
                    <span className="font-semibold">{conclusion.loserName}</span>{" "}
                    领先{" "}
                    <span className="font-semibold text-emerald-600">{conclusion.diff} 分</span>。
                  </p>
                  <p>
                    {conclusion.winnerName} 在{" "}
                    <span className="font-semibold">{conclusion.bestDim}</span>{" "}
                    维度表现最优；{conclusion.loserName} 在{" "}
                    <span className="font-semibold">{conclusion.worstDim}</span>{" "}
                    维度相对薄弱，建议重点关注提升。
                  </p>
                  {compareResult.scores.some((s) => s.dimensions.risk > 40) && (
                    <p className="flex items-start gap-1.5 text-red-600 text-xs sm:text-sm">
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

      <TargetDetailDialog target={detailTarget} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
