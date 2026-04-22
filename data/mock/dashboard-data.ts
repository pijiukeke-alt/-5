import { DashboardKPI, TimeSeriesPoint, SentimentDistribution } from "@/types";

export const mockDashboardKPIs: DashboardKPI[] = [
  {
    title: "监控 IP 总数",
    value: 128,
    change: 12,
    changeLabel: "较上月",
    trend: "up",
  },
  {
    title: "正在合作",
    value: 45,
    change: 5,
    changeLabel: "较上月",
    trend: "up",
  },
  {
    title: "本周舆情事件",
    value: 342,
    change: -8,
    changeLabel: "较上周",
    trend: "down",
  },
  {
    title: "高风险预警",
    value: 3,
    change: 1,
    changeLabel: "较昨日",
    trend: "up",
  },
];

export const mockHeatTrend: TimeSeriesPoint[] = [
  { date: "2024-08-01", value: 72 },
  { date: "2024-08-05", value: 78 },
  { date: "2024-08-10", value: 85 },
  { date: "2024-08-15", value: 82 },
  { date: "2024-08-20", value: 91 },
  { date: "2024-08-25", value: 88 },
  { date: "2024-08-30", value: 95 },
];

export const mockSentimentDistribution: SentimentDistribution = {
  positive: 62,
  neutral: 28,
  negative: 10,
};

export const mockVolumeTrend: TimeSeriesPoint[] = [
  { date: "2024-08-01", value: 1200000 },
  { date: "2024-08-05", value: 1350000 },
  { date: "2024-08-10", value: 1580000 },
  { date: "2024-08-15", value: 1420000 },
  { date: "2024-08-20", value: 1890000 },
  { date: "2024-08-25", value: 1750000 },
  { date: "2024-08-30", value: 2100000 },
];
