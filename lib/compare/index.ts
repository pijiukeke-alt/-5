import { CompareItem } from "@/types";

/**
 * 对比分析：计算差异率与胜出项
 */
export function compareMetrics(
  items: CompareItem[],
  metricKey: string
): {
  winnerId: string | null;
  diffs: Record<string, number>;
} {
  if (items.length < 2) return { winnerId: null, diffs: {} };

  const values = items.map((i) => ({ id: i.id, value: i.metrics[metricKey] || 0 }));
  const max = Math.max(...values.map((v) => v.value));
  const winner = values.find((v) => v.value === max);

  const diffs: Record<string, number> = {};
  values.forEach((v) => {
    diffs[v.id] = max > 0 ? Math.round(((v.value - max) / max) * 100) : 0;
  });

  return { winnerId: winner?.id ?? null, diffs };
}
