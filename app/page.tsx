"use client";

import { useState, useMemo } from "react";
import { KPICard } from "@/components/cards/kpi-card";
import { TargetCard } from "@/components/cards/target-card";
import { RiskCard } from "@/components/cards/risk-card";
import { ScoreCard } from "@/components/cards/score-card";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { SimplePieChart } from "@/components/charts/pie-chart";
import { TrendLineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TargetDetailDialog } from "@/components/detail/target-detail-dialog";
import { SectionHeader, EmptyState } from "@/components/shared";
import { useAppStore } from "@/store/app-store";
import { toChartData, formatNumber } from "@/lib/transform";
import { DashboardKPI, MonitoringTarget } from "@/types";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { RISK_COLORS } from "@/config";
import { Flame, AlertTriangle, TrendingUp, Activity, BarChart3, Award } from "lucide-react";

export default function HomePage() {
  const targets = useAppStore((s) => s.targets);
  const scores = useAppStore((s) => s.scores);
  const [detailTarget, setDetailTarget] = useState<MonitoringTarget | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const ongoingCooperation = targets.filter((t) => t.category === "cooperation").length;
  const unresolvedRisks = targets.reduce(
    (sum, t) => sum + t.riskEvents.filter((e) => !e.resolved).length,
    0
  );
  const avgTotalScore = Math.round(
    scores.reduce((s, sc) => s + sc.total, 0) / (scores.length || 1)
  );

  // 今日热度摘要
  const todayHeat = useMemo(() => {
    if (!targets[0]?.trend.heat.length) return 0;
    const lastIdx = targets[0].trend.heat.length - 1;
    return Math.round(
      targets.reduce((sum, t) => sum + (t.trend.heat[lastIdx] || 0), 0) / targets.length
    );
  }, [targets]);

  const heatChange = useMemo(() => {
    if (!targets[0]?.trend.heat.length) return 0;
    const last = targets[0].trend.heat.length - 1;
    const prev = last - 1;
    const avgLast = targets.reduce((sum, t) => sum + (t.trend.heat[last] || 0), 0) / targets.length;
    const avgPrev = targets.reduce((sum, t) => sum + (t.trend.heat[prev] || 0), 0) / targets.length;
    return avgPrev > 0 ? Math.round(((avgLast - avgPrev) / avgPrev) * 100) : 0;
  }, [targets]);

  const kpis: DashboardKPI[] = [
    {
      title: "监控对象总数",
      value: targets.length,
      change: 2,
      changeLabel: "较上周",
      trend: "up",
    },
    {
      title: "在合作案例",
      value: ongoingCooperation,
      change: 1,
      changeLabel: "较上月",
      trend: "up",
    },
    {
      title: "未解决风险",
      value: unresolvedRisks,
      change: unresolvedRisks > 3 ? 1 : -1,
      changeLabel: "较昨日",
      trend: unresolvedRisks > 3 ? "up" : "down",
    },
    {
      title: "平均综合评分",
      value: avgTotalScore,
      change: 3,
      changeLabel: "较上周",
      trend: "up",
    },
  ];

  const topScoreData = scores
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)
    .map((s) => ({ name: s.targetName.slice(0, 4), value: s.total }));

  const gradeDist: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  scores.forEach((s) => {
    gradeDist[s.grade] = (gradeDist[s.grade] || 0) + 1;
  });
  const gradePieData = [
    { name: "S", value: gradeDist.S, color: "#f59e0b" },
    { name: "A", value: gradeDist.A, color: "#22c55e" },
    { name: "B", value: gradeDist.B, color: "#3b82f6" },
    { name: "C", value: gradeDist.C, color: "#6b7280" },
    { name: "D", value: gradeDist.D, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const avgHeatTrend =
    targets[0]?.trend.dates.map((date, i) => ({
      date,
      value: Math.round(targets.reduce((sum, t) => sum + (t.trend.heat[i] || 0), 0) / targets.length),
    })) ?? [];

  const avgSentimentTrend =
    targets[0]?.trend.dates.map((date, i) => ({
      date,
      value: parseFloat(
        (targets.reduce((sum, t) => sum + (t.trend.sentiment[i] || 0), 0) / targets.length).toFixed(2)
      ),
    })) ?? [];

  const avgVolumeTrend =
    targets[0]?.trend.dates.map((date, i) => ({
      date,
      value: Math.round(targets.reduce((sum, t) => sum + (t.trend.volume[i] || 0), 0) / targets.length),
    })) ?? [];

  const topTargets = [...targets]
    .sort((a, b) => {
      const sa = scores.find((s) => s.targetId === a.id)?.total ?? 0;
      const sb = scores.find((s) => s.targetId === b.id)?.total ?? 0;
      return sb - sa;
    })
    .slice(0, 3);

  const highRiskTargets = [...targets].sort((a, b) => {
    const ra = scores.find((s) => s.targetId === a.id)?.dimensions.risk ?? 0;
    const rb = scores.find((s) => s.targetId === b.id)?.dimensions.risk ?? 0;
    return rb - ra;
  });

  const unresolvedRiskEvents = highRiskTargets
    .flatMap((t) => t.riskEvents.filter((e) => !e.resolved).map((e) => ({ event: e, target: t })))
    .slice(0, 4);

  const openDetail = (target: MonitoringTarget) => {
    setDetailTarget(target);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="IP 智鉴总览"
        description="IP 联名 / 授权 / 代言数据智能分析与舆情监控概览"
        helpText="本页展示全库核心指标、热度趋势、评分分布与风险提醒。点击卡片可查看对象详情。"
        action={
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">数据更新于</span>
            {new Date().toLocaleDateString("zh-CN")}
          </div>
        }
      />

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi, i) => (
          <div key={kpi.title} className={`animate-fade-in animate-fade-in-delay-${i + 1}`}>
            <KPICard data={kpi} highlight={kpi.title === "未解决风险" && unresolvedRisks > 0} />
          </div>
        ))}
      </div>

      {/* 今日热度摘要 + 综合评分概览 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                今日热度摘要
              </CardTitle>
              <span
                className={`text-xs font-semibold ${heatChange >= 0 ? "text-emerald-600" : "text-red-500"}`}
              >
                {heatChange >= 0 ? "+" : ""}
                {heatChange}% 较昨日
              </span>
            </div>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight">{todayHeat}</span>
              <span className="text-sm text-muted-foreground mb-1.5">平均热度指数</span>
            </div>
            <TrendLineChart data={toChartData(avgHeatTrend)} color="#f59e0b" height={180} />
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              综合评分概览
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="text-center py-2">
              <div className="text-4xl sm:text-5xl font-bold tracking-tight">{avgTotalScore}</div>
              <div className="text-xs text-muted-foreground mt-1">全库平均综合分</div>
            </div>
            <div className="mt-4 space-y-2">
              {scores
                .sort((a, b) => b.total - a.total)
                .slice(0, 4)
                .map((s) => (
                  <div
                    key={s.targetId}
                    className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/60 rounded-lg px-2 py-1.5 transition-colors"
                    onClick={() => {
                      const t = targets.find((x) => x.id === s.targetId);
                      if (t) openDetail(t);
                    }}
                  >
                    <span className="truncate max-w-[100px] sm:max-w-[120px] font-medium">{s.targetName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{s.grade}</span>
                      <span className="font-semibold tabular-nums">{s.total}分</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 趋势摘要卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium">平均声量趋势（30天）</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <TrendLineChart data={toChartData(avgVolumeTrend)} color="#8b5cf6" />
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium">平均情感走势（30天）</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <TrendLineChart data={toChartData(avgSentimentTrend)} color="#3b82f6" />
          </CardContent>
        </Card>
      </div>

      {/* 等级分布 + 评分排行 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              综合评分排行 Top 6
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <SimpleBarChart data={topScoreData} color="#8b5cf6" />
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium">等级分布</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            {gradePieData.length > 0 ? (
              <SimplePieChart data={gradePieData} />
            ) : (
              <EmptyState title="暂无等级数据" description="评分计算中，请稍后查看" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* 风险提醒 */}
      <Card className="card-elevated border-l-4" style={{ borderLeftColor: unresolvedRisks > 0 ? RISK_COLORS.high : RISK_COLORS.low }}>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            风险提醒 ({unresolvedRisks} 个未解决)
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 px-4 space-y-3">
          {unresolvedRiskEvents.length > 0 ? (
            unresolvedRiskEvents.map(({ event, target }) => (
              <div key={event.id} onClick={() => openDetail(target)} className="cursor-pointer">
                <RiskCard event={event} targetName={target.name} />
              </div>
            ))
          ) : (
            <EmptyState
              icon="inbox"
              title="当前无未解决风险"
              description="所有监控对象状态良好，暂无需要关注的风险事件"
            />
          )}
        </CardContent>
      </Card>

      {/* Top 对象 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Top 3 高价值对象
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4 space-y-3">
            {topTargets.map((t) => (
              <TargetCard key={t.id} target={t} onClick={() => openDetail(t)} />
            ))}
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Top 3 高风险对象
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4 space-y-3">
            {highRiskTargets.slice(0, 3).map((t) => {
              const score = calculateEvaluationScore(t);
              return (
                <div key={t.id} onClick={() => openDetail(t)} className="cursor-pointer">
                  <ScoreCard score={score} compact />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <TargetDetailDialog target={detailTarget} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
