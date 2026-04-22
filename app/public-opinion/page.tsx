"use client";

import { RiskCard } from "@/components/cards/risk-card";
import { TrendLineChart } from "@/components/charts/line-chart";
import { FilterBar } from "@/components/filters/filter-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/app-store";
import { toChartData } from "@/lib/transform";
import { SENTIMENT_COLORS } from "@/config";
import { SimplePieChart } from "@/components/charts/pie-chart";

const severityOptions = [
  { value: null, label: "全部" },
  { value: "critical", label: "危急" },
  { value: "high", label: "高风险" },
  { value: "medium", label: "中风险" },
  { value: "low", label: "低风险" },
];

export default function PublicOpinionPage() {
  const filters = useAppStore((s) => s.filters);
  const setRiskSeverityFilter = useAppStore((s) => s.setRiskSeverityFilter);
  const getFilteredRiskEvents = useAppStore((s) => s.getFilteredRiskEvents);
  const targets = useAppStore((s) => s.targets);

  const unresolvedRisks = getFilteredRiskEvents().filter((e) => !e.resolved);

  const totalPos = targets.reduce((s, t) => s + t.sentiment.positiveRatio, 0);
  const totalNeu = targets.reduce((s, t) => s + t.sentiment.neutralRatio, 0);
  const totalNeg = targets.reduce((s, t) => s + t.sentiment.negativeRatio, 0);
  const sentimentPieData = [
    { name: "正面", value: Math.round(totalPos), color: SENTIMENT_COLORS.positive },
    { name: "中性", value: Math.round(totalNeu), color: SENTIMENT_COLORS.neutral },
    { name: "负面", value: Math.round(totalNeg), color: SENTIMENT_COLORS.negative },
  ];

  const avgSentimentTrend = targets[0]?.trend.dates.map((date, i) => ({
    date,
    value: parseFloat((targets.reduce((sum, t) => sum + (t.trend.sentiment[i] || 0), 0) / targets.length).toFixed(2)),
  })) ?? [];

  const avgVolumeTrend = targets[0]?.trend.dates.map((date, i) => ({
    date,
    value: Math.round(targets.reduce((sum, t) => sum + (t.trend.volume[i] || 0), 0) / targets.length),
  })) ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">舆情监控</h1>
        <p className="text-sm text-muted-foreground mt-1">
          风险事件追踪与整体情感走势（未解决: {unresolvedRisks.length} 个）
        </p>
      </div>

      <FilterBar
        title="严重度"
        options={severityOptions}
        value={filters.riskSeverityFilter}
        onChange={setRiskSeverityFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">风险事件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unresolvedRisks.length > 0 ? (
              unresolvedRisks.map((e) => (
                <RiskCard key={e.id} event={e} targetName={e.targetName} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                当前无未解决风险事件
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">整体情感分布</CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePieChart data={sentimentPieData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">平均情感走势</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={toChartData(avgSentimentTrend)} color="#3b82f6" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">平均声量走势</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={toChartData(avgVolumeTrend)} color="#f59e0b" />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50 border-dashed">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          预留功能：预警规则配置 / 实时推送 / 传播路径分析 / 情感极性下钻
        </CardContent>
      </Card>
    </div>
  );
}
