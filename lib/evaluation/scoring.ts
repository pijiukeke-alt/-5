/**
 * 4维评分模型
 * ============================================================
 * 维度：
 *   1. 传播力（Communication）
 *   2. 商业力（Commercial）
 *   3. 口碑力（Reputation）
 *   4. 风险度（Risk）——反向指标
 *
 * 综合总分 = 传播力*w1 + 商业力*w2 + 口碑力*w3 + (100-风险度)*w4
 * 等级映射：S(90-100) A(80-89) B(70-79) C(60-69) D(0-59)
 */

import { MonitoringTarget, EvaluationScore } from "@/types";
import { EVALUATION_CONFIG } from "@/config";

/** 归一化到 0-100 */
function normalize(value: number, max: number): number {
  return Math.max(0, Math.min(100, (value / max) * 100));
}

/**
 * 传播力：基于声量、曝光、热度、互动密度
 * 满分基准：声量 100k/天，曝光 500w/天，热度 100，互动率 5%
 */
function calcCommunication(target: MonitoringTarget): number {
  const { social } = target;
  const b = EVALUATION_CONFIG.benchmarks;

  const volumeScore = normalize(social.volume, b.maxDailyVolume);
  const exposureScore = normalize(social.exposure, b.maxDailyExposure);
  const heatScore = social.heatScore; // 本身就是 0-100

  const engagementRate = social.volume > 0 ? social.engagement / social.volume : 0;
  const engagementScore = normalize(engagementRate, b.maxEngagementRate);

  return Math.round(
    volumeScore * 0.25 + exposureScore * 0.25 + heatScore * 0.3 + engagementScore * 0.2
  );
}

/**
 * 商业力：基于销量提升、GMV、转化率、客单价
 * 若无直接商业数据，回退到历史合作效果平均分
 */
function calcCommercial(target: MonitoringTarget): number {
  const { business, cooperationHistory } = target;
  const b = EVALUATION_CONFIG.benchmarks;

  // 有直接商业数据时优先使用
  if (business.salesLift || business.gmv) {
    const salesScore = business.salesLift ? normalize(business.salesLift, b.maxSalesLift) : 0;
    const gmvScore = business.gmv ? normalize(business.gmv, b.maxGmv) : 0;
    const conversionScore = business.conversionRate
      ? normalize(business.conversionRate, b.maxConversionRate)
      : 0;
    const aovScore = business.avgOrderValue
      ? normalize(business.avgOrderValue, b.maxAvgOrderValue)
      : 0;

    // 存在哪些指标就加权计算
    const weights: number[] = [];
    const scores: number[] = [];
    if (business.salesLift) {
      weights.push(0.35);
      scores.push(salesScore);
    }
    if (business.gmv) {
      weights.push(0.25);
      scores.push(gmvScore);
    }
    if (business.conversionRate) {
      weights.push(0.25);
      scores.push(conversionScore);
    }
    if (business.avgOrderValue) {
      weights.push(0.15);
      scores.push(aovScore);
    }

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const weightedSum = scores.reduce((a, s, i) => a + s * weights[i], 0);
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;
  }

  // 回退：基于历史合作效果
  if (cooperationHistory.length > 0) {
    const avg =
      cooperationHistory.reduce((sum, h) => sum + h.effectScore, 0) /
      cooperationHistory.length;
    return Math.round(avg);
  }

  return 50; // 无数据默认中位
}

/**
 * 口碑力：基于正面比例、评论评分、稳定性
 */
function calcReputation(target: MonitoringTarget): number {
  const { sentiment } = target;

  const posScore = sentiment.positiveRatio * 100;
  const ratingScore = (sentiment.avgCommentRating / 5) * 100;
  const stabilityScore = sentiment.stabilityScore;

  return Math.round(posScore * 0.4 + ratingScore * 0.3 + stabilityScore * 0.3);
}

/**
 * 风险度：负面占比、风险事件严重度、稳定性反向
 * 风险越高分数越高（0-100）
 */
function calcRisk(target: MonitoringTarget): number {
  const { sentiment, riskEvents } = target;

  // 负面情感基础分（负面占比 100% = 60 分）
  const negativeBase = sentiment.negativeRatio * 60;

  // 风险事件加成（未解决的事件权重更高）
  let eventScore = 0;
  riskEvents.forEach((e) => {
    const severityMap = { low: 5, medium: 15, high: 30, critical: 50 };
    const base = severityMap[e.severity];
    const multiplier = e.resolved ? 0.3 : 1.0;
    eventScore += base * multiplier;
  });
  // 事件分封顶 40 分
  eventScore = Math.min(40, eventScore);

  // 不稳定性加成（稳定性越低风险越高）
  const instabilityScore = (100 - sentiment.stabilityScore) * 0.2;

  return Math.min(100, Math.round(negativeBase + eventScore + instabilityScore));
}

/** 等级映射 */
export function calculateGrade(score: number): "S" | "A" | "B" | "C" | "D" {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

/**
 * 计算监控对象的完整评估得分
 */
export function calculateEvaluationScore(target: MonitoringTarget): EvaluationScore {
  const communication = calcCommunication(target);
  const commercial = calcCommercial(target);
  const reputation = calcReputation(target);
  const risk = calcRisk(target);

  const weights = EVALUATION_CONFIG.defaultWeights;
  const total = Math.round(
    communication * weights.communication +
      commercial * weights.commercial +
      reputation * weights.reputation +
      (100 - risk) * weights.riskInverted
  );

  return {
    targetId: target.id,
    targetName: target.name,
    dimensions: { communication, commercial, reputation, risk },
    total,
    grade: calculateGrade(total),
    calculatedAt: new Date().toISOString(),
  };
}
