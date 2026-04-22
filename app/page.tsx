"use client";

import { useState } from "react";
import { KPICard } from "@/components/cards/kpi-card";
import { TargetCard } from "@/components/cards/target-card";
import { RiskCard } from "@/components/cards/risk-card";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { SimplePieChart } from "@/components/charts/pie-chart";
import { TrendLineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TargetDetailDialog } from "@/components/detail/target-detail-dialog";
import { useAppStore } from "@/store/app-store";
import { toChartData } from "@/lib/transform";
import { DashboardKPI, MonitoringTarget } from "@/types";

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

  const kpis: DashboardKPI[] = [
    { title: "监控对象总数", value: targets.length, change: 0, changeLabel: "较上周", trend: "flat" },
    { title: "在合作案例", value: ongoingCooperation, change: 0, changeLabel: "较上月", trend: "flat" },
    { title: "未解决风险", value: unresolvedRisks, change: 0, changeLabel: "较昨日", trend: unresolvedRisks > 3 ? "up" : "flat" },
    { title: "平均综合评分", value: avgTotalScore, change: 0, changeLabel: "较上周", trend: "flat" },
  ];

  const topScoreData = scores.sort((a, b) => b.total - a.total).slice(0, 6).map((s) => ({ name: s.targetName.slice(0, 4), value: s.total }));

  const gradeDist: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  scores.forEach((s) => { gradeDist[s.grade] = (gradeDist[s.grade] || 0) + 1; });
  const gradePieData = [
    { name: "S", value: gradeDist.S, color: "#f59e0b" },
    { name: "A", value: gradeDist.A, color: "#22c55e" },
    { name: "B", value: gradeDist.B, color: "#3b82f6" },
    { name: "C", value: gradeDist.C, color: "#6b7280" },
    { name: "D", value: gradeDist.D, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const avgHeatTrend = targets[0]?.trend.dates.map((date, i) => ({
    date,
    value: Math.round(targets.reduce((sum, t) => sum + (t.trend.heat[i] || 0), 0) / targets.length),
  })) ?? [];

  const avgSentimentTrend = targets[0]?.trend.dates.map((date, i) => ({
    date,
    value: parseFloat((targets.reduce((sum, t) => sum + (t.trend.sentiment[i] || 0), 0) / targets.length).toFixed(2)),
  })) ?? [];

  const topTargets = [...targets].sort((a, b) => {
    const sa = scores.find((s) => s.targetId === a.id)?.total ?? 0;
    const sb = scores.find((s) => s.targetId === b.id)?.total ?? 0;
    return sb - sa;
  }).slice(0, 3);

  const highRiskTargets = [...targets].sort((a, b) => {
    const ra = scores.find((s) => s.targetId === a.id)?.dimensions.risk ?? 0;
    const rb = scores.find((s) => s.targetId === b.id)?.dimensions.risk ?? 0;
    return rb - ra;
  }).slice(0, 3);

  const openDetail = (target: MonitoringTarget) => {
    setDetailTarget(target);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">IP 联名 / 授权 / 代言数据智能分析与舆情监控概览</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} data={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">综合评分排行</CardTitle></CardHeader>
          <CardContent><SimpleBarChart data={topScoreData} color="#8b5cf6" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">等级分布</CardTitle></CardHeader>
          <CardContent><SimplePieChart data={gradePieData} /></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">平均热度趋势</CardTitle></CardHeader>
          <CardContent><TrendLineChart data={toChartData(avgHeatTrend)} color="#f59e0b" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">平均情感走势</CardTitle></CardHeader>
          <CardContent><TrendLineChart data={toChartData(avgSentimentTrend)} color="#3b82f6" /></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top 对象</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {topTargets.map((t) => (
              <TargetCard key={t.id} target={t} onClick={() => openDetail(t)} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">高风险预警</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {highRiskTargets.flatMap((t) => t.riskEvents.filter((e) => !e.resolved).map((e) => (
              <div key={e.id} onClick={() => openDetail(t)} className="cursor-pointer">
                <RiskCard event={e} targetName={t.name} />
              </div>
            ))).slice(0, 4)}
          </CardContent>
        </Card>
      </div>

      <TargetDetailDialog target={detailTarget} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
