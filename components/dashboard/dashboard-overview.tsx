"use client";

import { KPICard } from "@/components/cards/kpi-card";
import { IPCard } from "@/components/cards/ip-card";
import { OpinionCard } from "@/components/cards/opinion-card";
import { TrendLineChart } from "@/components/charts/line-chart";
import { SimplePieChart } from "@/components/charts/pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockDashboardKPIs,
  mockHeatTrend,
  mockSentimentDistribution,
  mockVolumeTrend,
} from "@/data/mock/dashboard-data";
import { mockIPList } from "@/data/mock/ip-data";
import { mockOpinionEvents } from "@/data/mock/opinion-data";
import { toChartData } from "@/lib/transform";

export function DashboardOverview() {
  const sentimentData = [
    { name: "正面", value: mockSentimentDistribution.positive, color: "#22c55e" },
    { name: "中性", value: mockSentimentDistribution.neutral, color: "#3b82f6" },
    { name: "负面", value: mockSentimentDistribution.negative, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mockDashboardKPIs.map((kpi) => (
          <KPICard key={kpi.title} data={kpi} />
        ))}
      </div>

      {/* 图表区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">热度趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={toChartData(mockHeatTrend)} color="#f59e0b" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">情感分布</CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePieChart data={sentimentData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">声量走势</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={toChartData(mockVolumeTrend)} color="#3b82f6" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">高热度 IP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockIPList.slice(0, 3).map((ip) => (
              <IPCard key={ip.id} ip={ip} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 近期舆情 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">近期舆情事件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockOpinionEvents.slice(0, 4).map((event) => (
            <OpinionCard key={event.id} event={event} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
