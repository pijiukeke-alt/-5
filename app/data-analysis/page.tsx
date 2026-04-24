"use client";

import { useState } from "react";
import { SimpleRadarChart } from "@/components/charts/radar-chart";
import { TrendLineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/app-store";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { getAllScores } from "@/lib/evaluation/api";
import { EVALUATION_CONFIG } from "@/config";
import { toChartData } from "@/lib/transform";
import { TargetDetailDialog } from "@/components/detail/target-detail-dialog";
import { MonitoringTarget } from "@/types";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, ShieldAlert, Info } from "lucide-react";

export default function EvaluationPage() {
  const targets = useAppStore((s) => s.targets);
  const [selectedId, setSelectedId] = useState<string>(targets[0]?.id ?? "");
  const [detailTarget, setDetailTarget] = useState<MonitoringTarget | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const target = targets.find((t) => t.id === selectedId);
  const score = target ? calculateEvaluationScore(target) : null;
  const allScores = getAllScores().sort((a, b) => b.total - a.total);

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

  const dimLabel: Record<string, string> = {
    communication: "传播力",
    commercial: "商业力",
    reputation: "口碑力",
    risk: "风险度",
  };

  const dimColors: Record<string, string> = {
    communication: "#3b82f6",
    commercial: "#f59e0b",
    reputation: "#22c55e",
    risk: "#ef4444",
  };

  const trendData = target
    ? target.trend.dates.map((date, i) => ({
        date,
        value: target.trend.heat[i],
      }))
    : [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">价值评估</h1>
        <p className="text-sm text-muted-foreground mt-1">
          4维评估模型：传播力、商业力、口碑力、风险度综合评分
        </p>
      </div>

      {/* 对象选择 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground shrink-0">评估对象</span>
        {targets.map((t) => {
          const sc = calculateEvaluationScore(t);
          return (
            <Badge
              key={t.id}
              variant={selectedId === t.id ? "default" : "outline"}
              className="cursor-pointer gap-1"
              onClick={() => setSelectedId(t.id)}
            >
              <span>{t.name}</span>
              <span
                className={cn(
                  "text-[10px] opacity-80",
                  sc.grade === "S" && "text-amber-500",
                  sc.grade === "A" && "text-green-500",
                  sc.grade === "B" && "text-blue-500",
                  sc.grade === "C" && "text-gray-500",
                  sc.grade === "D" && "text-red-500"
                )}
              >
                {sc.grade}
              </span>
            </Badge>
          );
        })}
      </div>

      {score && target && (
        <>
          {/* 综合得分 + 等级 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="text-sm text-muted-foreground mb-2">{target.name}</div>
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold border-4",
                    score.grade === "S" && "border-amber-400 text-amber-600 bg-amber-50",
                    score.grade === "A" && "border-green-400 text-green-600 bg-green-50",
                    score.grade === "B" && "border-blue-400 text-blue-600 bg-blue-50",
                    score.grade === "C" && "border-gray-400 text-gray-600 bg-gray-50",
                    score.grade === "D" && "border-red-400 text-red-600 bg-red-50"
                  )}
                >
                  {score.grade}
                </div>
                <div className="mt-3 text-4xl font-bold">{score.total}</div>
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
                <Card key={key} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{dimLabel[key]}</span>
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: dimColors[key] + "20",
                          color: dimColors[key],
                        }}
                      >
                        {key === "risk" ? (val > 40 ? "偏高" : "可控") : val >= 80 ? "优秀" : val >= 60 ? "良好" : "一般"}
                      </span>
                    </div>
                    <div className="mt-2 text-2xl font-bold">{val}</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">4维能力雷达</CardTitle>
              </CardHeader>
              <CardContent>
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
                      color: "#3b82f6",
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
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  历史热度趋势（30天）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendLineChart data={toChartData(trendData)} color="#f59e0b" />
              </CardContent>
            </Card>
          </div>

          {/* 评分说明面板 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                评分说明
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-foreground">维度定义</div>
                    <div className="mt-1 space-y-1 text-muted-foreground text-xs">
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
                              "inline-block w-5 text-center font-bold rounded",
                              g.grade === "S" && "bg-amber-100 text-amber-700",
                              g.grade === "A" && "bg-green-100 text-green-700",
                              g.grade === "B" && "bg-blue-100 text-blue-700",
                              g.grade === "C" && "bg-gray-100 text-gray-700",
                              g.grade === "D" && "bg-red-100 text-red-700"
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
                    <div className="mt-1 text-xs text-muted-foreground flex items-start gap-1">
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">全库综合评分排行</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {allScores.map((s, idx) => {
            const t = targets.find((x) => x.id === s.targetId);
            return (
              <div
                key={s.targetId}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedId(s.targetId);
                  if (t) {
                    setDetailTarget(t);
                    setDetailOpen(true);
                  }
                }}
              >
                <div className="w-6 text-center text-sm font-medium text-muted-foreground">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{s.targetName}</span>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded",
                        s.grade === "S" && "bg-amber-100 text-amber-700",
                        s.grade === "A" && "bg-green-100 text-green-700",
                        s.grade === "B" && "bg-blue-100 text-blue-700",
                        s.grade === "C" && "bg-gray-100 text-gray-700",
                        s.grade === "D" && "bg-red-100 text-red-700"
                      )}
                    >
                      {s.grade}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    传播{s.dimensions.communication} · 商业{s.dimensions.commercial} · 口碑
                    {s.dimensions.reputation} · 风险{s.dimensions.risk}
                  </div>
                </div>
                <div className="text-lg font-bold">{s.total}</div>
                <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
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
