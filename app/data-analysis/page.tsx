"use client";

import { useState, useEffect } from "react";
import { SimpleRadarChart } from "@/components/charts/radar-chart";
import { TrendLineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader, DemoSwitcher, EmptyState } from "@/components/shared";
import { PageSkeleton } from "@/components/loading/page-skeleton";
import { useAppStore } from "@/store/app-store";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { EVALUATION_CONFIG } from "@/config";
import { toChartData } from "@/lib/transform";
import { TargetDetailDialog } from "@/components/detail/target-detail-dialog";
import { MonitoringTarget } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, ShieldAlert, Info, Award } from "lucide-react";
import { dimLabel, dimColors, gradeStyle } from "@/lib/labels";

export default function EvaluationPage() {
  const initialized = useAppStore((s) => s.initialized);
  const loading = useAppStore((s) => s.loading);
  const error = useAppStore((s) => s.error);
  const targets = useAppStore((s) => s.targets);
  const [selectedId, setSelectedId] = useState<string>(targets[0]?.id ?? "");
  const [detailTarget, setDetailTarget] = useState<MonitoringTarget | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!selectedId && targets.length > 0) {
      setSelectedId(targets[0].id);
    }
  }, [targets, selectedId]);

  if (!initialized || loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        icon="alert"
        title="数据加载失败"
        description={error}
        action={
          <Button variant="outline" onClick={() => window.location.reload()}>
            刷新页面
          </Button>
        }
      />
    );
  }

  const target = targets.find((t) => t.id === selectedId);
  const score = target ? calculateEvaluationScore(target) : null;
  const allScores = targets
    .map((t) => calculateEvaluationScore(t))
    .sort((a, b) => b.total - a.total);

  // 4维平均分
  const avgDims = {
    communication: Math.round(
      allScores.reduce((s, sc) => s + sc.dimensions.communication, 0) / allScores.length
    ),
    commercial: Math.round(
      allScores.reduce((s, sc) => s + sc.dimensions.commercial, 0) / allScores.length
    ),
    reputation: Math.round(
      allScores.reduce((s, sc) => s + sc.dimensions.reputation, 0) / allScores.length
    ),
    risk: Math.round(
      allScores.reduce((s, sc) => s + sc.dimensions.risk, 0) / allScores.length
    ),
  };

  const trendData = target
    ? target.trend.dates.map((date, i) => ({
        date,
        value: target.trend.heat[i],
      }))
    : [];

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="价值评估"
        description="4维评估模型：传播力、商业力、口碑力、风险度综合评分"
        helpText="选择对象查看专属评分雷达图与历史趋势。总分 = 传播力×30% + 商业力×25% + 口碑力×25% + (100−风险度)×20%"
      />

      {/* 对象选择 */}
      <DemoSwitcher
        options={targets.map((t) => {
          const sc = calculateEvaluationScore(t);
          return { id: t.id, label: t.name, badge: sc.grade };
        })}
        activeId={selectedId}
        onChange={(id) => id && setSelectedId(id)}
        label="评估对象"
      />

      {score && target && (
        <>
          {/* 综合得分 + 等级 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            <Card className="lg:col-span-1 card-elevated">
              <CardContent className="p-5 sm:p-6 text-center">
                <div className="text-sm text-muted-foreground mb-2 font-medium">{target.name}</div>
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold border-4",
                    score.grade === "S" && "border-amber-400 text-amber-600 bg-amber-50",
                    score.grade === "A" && "border-emerald-400 text-emerald-600 bg-emerald-50",
                    score.grade === "B" && "border-blue-400 text-blue-600 bg-blue-50",
                    score.grade === "C" && "border-gray-400 text-gray-600 bg-gray-50",
                    score.grade === "D" && "border-red-400 text-red-600 bg-red-50"
                  )}
                >
                  {score.grade}
                </div>
                <div className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">{score.total}</div>
                <div className="text-xs text-muted-foreground mt-1">综合得分</div>
                <div className="mt-4 flex items-center justify-center gap-1 text-xs">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                  <span>
                    全库排名 #{allScores.findIndex((s) => s.targetId === target.id) + 1} / {allScores.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 各维度分数卡片 */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              {Object.entries(score.dimensions).map(([key, val]) => (
                <Card key={key} className="card-elevated relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground font-medium">{dimLabel[key]}</span>
                      <span
                        className="text-[11px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{
                          backgroundColor: dimColors[key] + "15",
                          color: dimColors[key],
                        }}
                      >
                        {key === "risk"
                          ? val > 40
                            ? "偏高"
                            : "可控"
                          : val >= 80
                          ? "优秀"
                          : val >= 60
                          ? "良好"
                          : "一般"}
                      </span>
                    </div>
                    <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">{val}</div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${val}%`,
                          backgroundColor: dimColors[key],
                        }}
                      />
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      全库平均 {avgDims[key as keyof typeof avgDims]}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 雷达图 + 历史趋势 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <Card className="card-elevated">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium">4维能力雷达</CardTitle>
              </CardHeader>
              <CardContent className="pb-4 px-4">
                <SimpleRadarChart
                  subjects={["传播力", "商业力", "口碑力", "风险度"]}
                  series={[
                    {
                      name: target.name,
                      data: [
                        score.dimensions.communication,
                        score.dimensions.commercial,
                        score.dimensions.reputation,
                        score.dimensions.risk,
                      ],
                      color: "#2563eb",
                      fillOpacity: 0.3,
                    },
                    {
                      name: "全库平均",
                      data: [avgDims.communication, avgDims.commercial, avgDims.reputation, avgDims.risk],
                      color: "#9ca3af",
                      fillOpacity: 0.15,
                    },
                  ]}
                />
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  历史热度趋势（30天）
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 px-4">
                <TrendLineChart data={toChartData(trendData)} color="#f59e0b" />
              </CardContent>
            </Card>
          </div>

          {/* 评分说明面板 */}
          <Card className="card-elevated">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                评分说明
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-foreground">维度定义</div>
                    <div className="mt-1 space-y-1 text-muted-foreground text-xs leading-relaxed">
                      {EVALUATION_CONFIG.dimensions.map((d) => (
                        <div key={d.key}>
                          <span className="font-medium text-foreground">{d.name}</span>：{d.description}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">权重配置</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      传播力 {EVALUATION_CONFIG.defaultWeights.communication * 100}% ·
                      商业力 {EVALUATION_CONFIG.defaultWeights.commercial * 100}% ·
                      口碑力 {EVALUATION_CONFIG.defaultWeights.reputation * 100}% ·
                      风险反向 {EVALUATION_CONFIG.defaultWeights.riskInverted * 100}%
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-foreground">等级标准</div>
                    <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                      {EVALUATION_CONFIG.gradeThresholds.map((g) => (
                        <div key={g.grade} className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-block w-5 text-center font-bold rounded text-[10px] py-0.5",
                              gradeStyle[g.grade]
                            )}
                          >
                            {g.grade}
                          </span>
                          <span>
                            {g.min}-{g.max} 分
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">风险说明</div>
                    <div className="mt-1 text-xs text-muted-foreground flex items-start gap-1 leading-relaxed">
                      <ShieldAlert className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                      风险度为反向指标，计算总分时使用 (100 - 风险度)。风险度越高，对综合得分的拖累越大。
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* 全库评分排行 */}
      <Card className="card-elevated">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            全库综合评分排行
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 px-4 space-y-1">
          {allScores.map((s, idx) => {
            const t = targets.find((x) => x.id === s.targetId);
            return (
              <div
                key={s.targetId}
                className="flex items-center gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedId(s.targetId);
                  if (t) {
                    setDetailTarget(t);
                    setDetailOpen(true);
                  }
                }}
              >
                <div className="w-6 text-center text-sm font-semibold text-muted-foreground shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{s.targetName}</span>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded border",
                        gradeStyle[s.grade]
                      )}
                    >
                      {s.grade}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
                    传播{s.dimensions.communication} · 商业{s.dimensions.commercial} · 口碑
                    {s.dimensions.reputation} · 风险{s.dimensions.risk}
                  </div>
                </div>
                <div className="text-lg font-bold tabular-nums">{s.total}</div>
                <div className="w-16 sm:w-20 h-1.5 rounded-full bg-muted overflow-hidden shrink-0">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${s.total}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <TargetDetailDialog target={detailTarget} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
