"use client";

import { useState, useMemo } from "react";
import { RiskCard } from "@/components/cards/risk-card";
import { TrendLineChart } from "@/components/charts/line-chart";
import { SimplePieChart } from "@/components/charts/pie-chart";
import { FilterBar } from "@/components/filters/filter-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader, DemoSwitcher, EmptyState } from "@/components/shared";
import { PageSkeleton } from "@/components/loading/page-skeleton";
import { useAppStore } from "@/store/app-store";
import { toChartData } from "@/lib/transform";
import { SENTIMENT_COLORS, RISK_COLORS } from "@/config";
import { hotKeywords, hotContents, platformShares } from "@/data/mock/opinion-extra";
import { TargetDetailDialog } from "@/components/detail/target-detail-dialog";
import { MonitoringTarget } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  Eye,
  Hash,
  Flame,
  ShieldAlert,
} from "lucide-react";

const severityOptions = [
  { value: null, label: "全部" },
  { value: "critical", label: "危急" },
  { value: "high", label: "高风险" },
  { value: "medium", label: "中风险" },
  { value: "low", label: "低风险" },
];

const timeOptions = [
  { value: "7", label: "近7天" },
  { value: "30", label: "近30天" },
];

export default function PublicOpinionPage() {
  const initialized = useAppStore((s) => s.initialized);
  const loading = useAppStore((s) => s.loading);
  const error = useAppStore((s) => s.error);
  const filters = useAppStore((s) => s.filters);
  const setRiskSeverityFilter = useAppStore((s) => s.setRiskSeverityFilter);
  const getFilteredRiskEvents = useAppStore((s) => s.getFilteredRiskEvents);
  const targets = useAppStore((s) => s.targets);

  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("30");
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [detailTarget, setDetailTarget] = useState<MonitoringTarget | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

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

  const selectedTarget = selectedTargetId
    ? targets.find((t) => t.id === selectedTargetId)
    : null;

  const effectiveTargets = selectedTarget ? [selectedTarget] : targets;

  const unresolvedRisks = getFilteredRiskEvents().filter((e) => !e.resolved);

  // 情感分布
  const totalPos = effectiveTargets.reduce((s, t) => s + t.sentiment.positiveRatio, 0);
  const totalNeu = effectiveTargets.reduce((s, t) => s + t.sentiment.neutralRatio, 0);
  const totalNeg = effectiveTargets.reduce((s, t) => s + t.sentiment.negativeRatio, 0);
  const sentimentPieData = [
    {
      name: "正面",
      value: Math.round((totalPos * 100) / effectiveTargets.length),
      color: SENTIMENT_COLORS.positive,
    },
    {
      name: "中性",
      value: Math.round((totalNeu * 100) / effectiveTargets.length),
      color: SENTIMENT_COLORS.neutral,
    },
    {
      name: "负面",
      value: Math.round((totalNeg * 100) / effectiveTargets.length),
      color: SENTIMENT_COLORS.negative,
    },
  ];

  const sliceCount = timeRange === "7" ? 7 : 30;

  const avgSentimentTrend = useMemo(() => {
    const base = effectiveTargets[0]?.trend.dates ?? [];
    const start = Math.max(0, base.length - sliceCount);
    return base.slice(start).map((date, i) => ({
      date,
      value: parseFloat(
        (
          effectiveTargets.reduce((sum, t) => sum + (t.trend.sentiment[start + i] || 0), 0) /
          effectiveTargets.length
        ).toFixed(2)
      ),
    }));
  }, [effectiveTargets, sliceCount]);

  const avgVolumeTrend = useMemo(() => {
    const base = effectiveTargets[0]?.trend.dates ?? [];
    const start = Math.max(0, base.length - sliceCount);
    return base.slice(start).map((date, i) => ({
      date,
      value: Math.round(
        effectiveTargets.reduce((sum, t) => sum + (t.trend.volume[start + i] || 0), 0) /
          effectiveTargets.length
      ),
    }));
  }, [effectiveTargets, sliceCount]);

  const avgHeatTrend = useMemo(() => {
    const base = effectiveTargets[0]?.trend.dates ?? [];
    const start = Math.max(0, base.length - sliceCount);
    return base.slice(start).map((date, i) => ({
      date,
      value: Math.round(
        effectiveTargets.reduce((sum, t) => sum + (t.trend.heat[start + i] || 0), 0) /
          effectiveTargets.length
      ),
    }));
  }, [effectiveTargets, sliceCount]);

  const filteredPlatformData = platformFilter
    ? platformShares.filter((p) => p.platform === platformFilter)
    : platformShares;

  const platformPieData = filteredPlatformData.map((p) => ({
    name: p.platform,
    value: p.value,
    color: p.color,
  }));

  const filteredKeywords = platformFilter ? hotKeywords.slice(0, 8) : hotKeywords;

  const filteredContents = platformFilter
    ? hotContents.filter((c) => c.platform === platformFilter)
    : hotContents;

  const openDetail = (target: MonitoringTarget) => {
    setDetailTarget(target);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="舆情监控"
        description={`全量舆情追踪、情感分析与风险预警（未解决风险: ${unresolvedRisks.length} 个）`}
        helpText="可切换单个监控对象查看专属舆情，或查看全库汇总。平台占比支持点击筛选。"
      />

      {/* 对象选择 + 时间范围 */}
      <div className="flex flex-col gap-3">
        <DemoSwitcher
          options={targets.map((t) => ({ id: t.id, label: t.name }))}
          activeId={selectedTargetId}
          onChange={setSelectedTargetId}
        />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground shrink-0">时间范围</span>
          {timeOptions.map((opt) => (
            <Badge
              key={opt.value}
              variant={timeRange === opt.value ? "default" : "outline"}
              className="cursor-pointer text-xs font-normal h-7 px-2.5"
              onClick={() => setTimeRange(opt.value)}
            >
              {opt.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* 趋势图表区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              声量趋势
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <TrendLineChart data={toChartData(avgVolumeTrend)} color="#8b5cf6" />
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium">情感分布</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <SimplePieChart data={sentimentPieData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-orange-500" />
              热度趋势
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <TrendLineChart data={toChartData(avgHeatTrend)} color="#f59e0b" />
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium">情感走势</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <TrendLineChart data={toChartData(avgSentimentTrend)} color="#3b82f6" />
          </CardContent>
        </Card>
      </div>

      {/* 平台占比 + 热门关键词 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium">平台占比</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <SimplePieChart data={platformPieData} />
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {platformShares.map((p) => (
                <Badge
                  key={p.platform}
                  variant={platformFilter === p.platform ? "default" : "outline"}
                  className="cursor-pointer text-xs font-normal"
                  onClick={() =>
                    setPlatformFilter(platformFilter === p.platform ? null : p.platform)
                  }
                >
                  {p.platform} {p.value}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4 text-purple-500" />
              热门关键词
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="flex flex-wrap gap-2">
              {filteredKeywords.map((kw) => (
                <div
                  key={kw.word}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    kw.sentiment === "positive" && "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
                    kw.sentiment === "negative" && "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
                    kw.sentiment === "neutral" && "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="font-medium">{kw.word}</span>
                  <span className="text-xs opacity-70">{formatNumber(kw.count)}</span>
                  {kw.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : kw.trend === "down" ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 热门内容摘要 */}
      <Card className="card-elevated">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium">热门内容摘要</CardTitle>
        </CardHeader>
        <CardContent className="pb-4 px-4 space-y-3">
          {filteredContents.slice(0, 5).map((content) => {
            const target = targets.find((t) => t.id === content.relatedTarget);
            return (
              <div
                key={content.id}
                className="rounded-xl border p-3 sm:p-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => target && openDetail(target)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm">{content.title}</h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          content.sentiment === "positive" && "border-green-200 text-green-600",
                          content.sentiment === "negative" && "border-red-200 text-red-600",
                          content.sentiment === "neutral" && "border-gray-200 text-gray-600"
                        )}
                      >
                        {content.sentiment === "positive"
                          ? "正面"
                          : content.sentiment === "negative"
                          ? "负面"
                          : "中性"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {content.summary}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                      <span>{content.platform}</span>
                      <span>{content.author}</span>
                      <span>{content.publishTime}</span>
                      <span className="flex items-center gap-0.5">
                        <Flame className="h-3 w-3 text-orange-400" />
                        热度 {content.heat}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredContents.length === 0 && (
            <EmptyState title="暂无热门内容" description="当前平台筛选条件下无内容数据" />
          )}
        </CardContent>
      </Card>

      {/* 风险事件 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium">风险事件</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4 space-y-3">
            <FilterBar
              title="严重度"
              options={severityOptions}
              value={filters.riskSeverityFilter}
              onChange={setRiskSeverityFilter}
            />
            {unresolvedRisks.length > 0 ? (
              unresolvedRisks.map((e) => (
                <div
                  key={e.id}
                  onClick={() => {
                    const t = targets.find((x) => x.name === e.targetName);
                    if (t) openDetail(t);
                  }}
                  className="cursor-pointer"
                >
                  <RiskCard event={e} targetName={e.targetName} />
                </div>
              ))
            ) : (
              <EmptyState
                title="当前无未解决风险事件"
                description="监控对象状态良好，或请调整严重度筛选条件"
              />
            )}
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              风险统计
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="space-y-3">
              {["critical", "high", "medium", "low"].map((sev) => {
                const count = targets.reduce(
                  (sum, t) =>
                    sum +
                    t.riskEvents.filter((e) => !e.resolved && e.severity === sev).length,
                  0
                );
                const label =
                  sev === "critical"
                    ? "危急"
                    : sev === "high"
                    ? "高风险"
                    : sev === "medium"
                    ? "中风险"
                    : "低风险";
                return (
                  <div key={sev} className="flex items-center justify-between">
                    <span className="text-sm">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 sm:w-24 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, count * 20)}%`,
                            backgroundColor: (RISK_COLORS as Record<string, string>)[sev],
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-4 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <TargetDetailDialog
        target={detailTarget}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + "万";
  return num.toLocaleString();
}
