/**
 * 数据层输出函数
 * 为页面组件提供统一的数据查询与评估接口
 */

import {
  MonitoringTarget,
  EvaluationScore,
  CompareResult,
  TrendData,
} from "@/types";
import { mockTargets } from "@/data/mock/targets";
import { calculateEvaluationScore } from "./scoring";

/**
 * 获取所有监控对象
 */
export function getAllTargets(): MonitoringTarget[] {
  return mockTargets;
}

/**
 * 按 ID 获取单个监控对象
 */
export function getTargetById(id: string): MonitoringTarget | undefined {
  return mockTargets.find((t) => t.id === id);
}

/**
 * 获取指定对象的 30 天趋势数据
 */
export function getTargetTrendData(id: string): TrendData | undefined {
  return getTargetById(id)?.trend;
}

/**
 * 获取指定对象的评估得分（若已预计算可直接返回，否则实时计算）
 */
export function getTargetScore(id: string): EvaluationScore | undefined {
  const target = getTargetById(id);
  if (!target) return undefined;
  return calculateEvaluationScore(target);
}

/**
 * 获取全部对象的评估得分列表
 */
export function getAllScores(): EvaluationScore[] {
  return mockTargets.map((t) => calculateEvaluationScore(t));
}

/**
 * 构建对比结果
 * @param targetIds 要对比的对象 ID 列表（建议 2-4 个）
 */
export function buildCompareResult(targetIds: string[]): CompareResult {
  const targets = targetIds
    .map((id) => getTargetById(id))
    .filter(Boolean) as MonitoringTarget[];

  const scores = targets.map((t) => calculateEvaluationScore(t));

  const dimensionKeys = ["communication", "commercial", "reputation", "risk"] as const;
  const dimensionDiffs: Record<string, Record<string, number>> = {};

  dimensionKeys.forEach((dim) => {
    const values = scores.map((s) => ({
      id: s.targetId,
      value: s.dimensions[dim],
    }));
    const max = Math.max(...values.map((v) => v.value));

    const diffs: Record<string, number> = {};
    values.forEach((v) => {
      diffs[v.id] = max > 0 ? Math.round(((v.value - max) / max) * 100) : 0;
    });
    dimensionDiffs[dim] = diffs;
  });

  const winnerId =
    scores.length > 0
      ? scores.reduce((best, curr) => (curr.total > best.total ? curr : best)).targetId
      : null;

  return { targets, scores, dimensionDiffs, winnerId };
}

/**
 * 按行业筛选监控对象
 */
export function getTargetsByIndustry(
  industry: MonitoringTarget["industry"]
): MonitoringTarget[] {
  return mockTargets.filter((t) => t.industry === industry);
}

/**
 * 按分类筛选监控对象
 */
export function getTargetsByCategory(
  category: MonitoringTarget["category"]
): MonitoringTarget[] {
  return mockTargets.filter((t) => t.category === category);
}

/**
 * 获取风险对象列表（按风险度降序）
 */
export function getHighRiskTargets(limit = 5): MonitoringTarget[] {
  return mockTargets
    .map((t) => ({ target: t, score: calculateEvaluationScore(t) }))
    .sort((a, b) => b.score.dimensions.risk - a.score.dimensions.risk)
    .slice(0, limit)
    .map((item) => item.target);
}

/**
 * 获取 Top 对象列表（按综合总分降序）
 */
export function getTopTargets(limit = 5): MonitoringTarget[] {
  return mockTargets
    .map((t) => ({ target: t, score: calculateEvaluationScore(t) }))
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, limit)
    .map((item) => item.target);
}
