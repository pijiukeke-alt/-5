import { TimeSeriesPoint } from "@/types";

/**
 * 将原始数据序列转换为 Recharts 可用格式
 */
export function toChartData(points: TimeSeriesPoint[]) {
  return points.map((p) => ({
    name: p.label || p.date,
    value: p.value,
    date: p.date,
  }));
}

/**
 * 按日期聚合
 */
export function aggregateByDate<T extends { date: string }>(
  items: T[],
  getter: (item: T) => number
): TimeSeriesPoint[] {
  const map = new Map<string, number>();
  items.forEach((item) => {
    const current = map.get(item.date) || 0;
    map.set(item.date, current + getter(item));
  });
  return Array.from(map.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 数字格式化（万/亿）
 */
export function formatNumber(num: number): string {
  if (num >= 100000000) return (num / 100000000).toFixed(1) + "亿";
  if (num >= 10000) return (num / 10000).toFixed(1) + "万";
  return num.toLocaleString();
}
