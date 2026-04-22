/**
 * 趋势数据生成器
 * 为 mock 监控对象生成 30 天看起来真实的趋势序列
 */

import { TrendData } from "@/types";

interface TrendOptions {
  /** 基础声量 */
  baseVolume: number;
  /** 基础热度 */
  baseHeat: number;
  /** 基础情感分 -1 ~ 1 */
  baseSentiment?: number;
  /** 波动系数 0-1 */
  volatility?: number;
  /** 整体趋势方向：up | down | flat */
  direction?: "up" | "down" | "flat";
  /** 是否存在异常 spike（如活动/事件） */
  spikeDay?: number; // 0-29，在哪一天出现峰值
  /** spike 强度倍数 */
  spikeMultiplier?: number;
}

/**
 * 生成 30 天趋势数据
 * 内部注入周末效应、随机波动、趋势方向和可选的 spike 事件
 */
export function generateTrend(options: TrendOptions): TrendData {
  const {
    baseVolume,
    baseHeat,
    baseSentiment = 0.2,
    volatility = 0.25,
    direction = "flat",
    spikeDay,
    spikeMultiplier = 1.5,
  } = options;

  const dates: string[] = [];
  const volume: number[] = [];
  const heat: number[] = [];
  const sentiment: number[] = [];
  const exposure: number[] = [];

  const today = new Date();

  // 方向因子：30 天内整体变化幅度 ±20%
  const directionFactor = direction === "up" ? 1.2 : direction === "down" ? 0.7 : 1;

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);

    // 周末效应：周六日声量下降 20-30%
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendFactor = isWeekend ? 0.75 : 1.05;

    // 趋势漂移：随时间线性变化
    const driftFactor = 1 + ((29 - i) / 29) * (directionFactor - 1);

    // spike 事件：指定日期声量暴增
    const isSpike = spikeDay !== undefined && i === 29 - spikeDay;
    const spikeFactor = isSpike ? spikeMultiplier : 1;

    // 随机波动
    const randomFactor = 1 + (Math.random() - 0.5) * volatility * 2;

    const dayVolume = Math.max(
      100,
      Math.round(baseVolume * weekendFactor * driftFactor * spikeFactor * randomFactor)
    );

    const dayHeat = Math.min(
      100,
      Math.max(10, Math.round(baseHeat * driftFactor * randomFactor * (isSpike ? 1.15 : 1)))
    );

    // 曝光量 ≈ 声量 * (15~40) 的随机倍数
    const exposureMultiplier = 15 + Math.random() * 25 + (isSpike ? 20 : 0);
    const dayExposure = Math.round(dayVolume * exposureMultiplier);

    // 情感分：围绕 baseSentiment 波动，spike 事件当天可能情感分化
    let daySentiment = baseSentiment + (Math.random() - 0.5) * 0.4;
    if (isSpike && spikeMultiplier > 2) {
      // 大 spike 可能伴随争议，情感趋于两极化
      daySentiment = baseSentiment > 0.3 ? 0.6 + Math.random() * 0.3 : -0.3 - Math.random() * 0.4;
    }
    daySentiment = Math.max(-1, Math.min(1, parseFloat(daySentiment.toFixed(2))));

    volume.push(dayVolume);
    heat.push(dayHeat);
    exposure.push(dayExposure);
    sentiment.push(daySentiment);
  }

  return { dates, volume, heat, sentiment, exposure };
}

/**
 * 基于趋势数据反算稳定性得分
 * 情感波动标准差越小，稳定性越高
 */
export function calcStabilityFromTrend(trend: TrendData): number {
  const sentiments = trend.sentiment;
  const mean = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
  const variance =
    sentiments.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sentiments.length;
  const stdDev = Math.sqrt(variance);
  // 标准差 0 = 100分，0.5 = 50分，>1 = 0分
  return Math.max(0, Math.min(100, Math.round(100 - stdDev * 100)));
}
