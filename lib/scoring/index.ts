import { IPItem, WeightConfig } from "@/types";
import { DEFAULT_WEIGHT_CONFIG } from "@/config";

/**
 * 综合评分计算
 * 根据热度、情感、互动、风险、转化五个维度加权计算
 */
export function calculateCompositeScore(
  ip: IPItem,
  weights: WeightConfig = DEFAULT_WEIGHT_CONFIG
): number {
  // 热度分：基于 heatScore（0-100）
  const heatScore = normalize(ip.heatScore, 0, 100);

  // 情感分：基于最近舆情情感（当前用 mock 固定值，未来接入真实数据）
  const sentimentScore = 0.75;

  // 互动分：基于粉丝量对数缩放
  const engagementScore = normalize(Math.log10(ip.followerCount + 1), 2, 8);

  // 风险分：风险越高得分越低
  const riskMap: Record<string, number> = { low: 1, medium: 0.7, high: 0.3 };
  const riskScore = riskMap[ip.riskLevel] ?? 0.5;

  // 转化分：基于历史合作数量（mock 逻辑）
  const conversionScore = Math.min(ip.cooperationHistory.length / 5, 1);

  const composite =
    heatScore * weights.heatWeight +
    sentimentScore * weights.sentimentWeight +
    engagementScore * weights.engagementWeight +
    riskScore * weights.riskWeight +
    conversionScore * weights.conversionWeight;

  return Math.round(composite * 100);
}

function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}
