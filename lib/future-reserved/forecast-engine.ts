/**
 * 【预留模块】预测引擎 (Forecast Engine)
 * ============================================================
 * 未来用途：
 *   基于时间序列分析与机器学习模型，对 IP 热度、舆情走向、
 *   合作效果进行短期（1-4周）与中期（1-3个月）预测。
 *
 * 预测场景：
 *   - 热度趋势：预测 IP 未来 30 天热度曲线，识别峰值窗口
 *   - 舆情风险：预测负面舆情爆发概率，提前 N 天预警
 *   - 合作效果：基于历史相似案例，预测新合作的效果分布
 *   - 市场容量：预测某品类联名市场的饱和度变化
 *
 * 模型预留（待数据积累后训练）：
 *   - 基线：Prophet / ARIMA 时序模型
 *   - 进阶：LSTM / Transformer 深度学习模型
 *   - 特征：历史热度、节假日、竞品动作、营销日历、宏观经济指标
 *
 * 与现有系统集成点：
 *   - 在 app/data-analysis/page.tsx 中增加「预测分析」Tab
 *   - 被 lib/future-reserved/alert-engine.ts 调用以生成风险预警
 *   - 输出数据格式与现有 TimeSeriesPoint 兼容，直接复用图表组件
 */

export interface ForecastRequest {
  targetId: string;
  targetType: "ip" | "brand" | "cooperation";
  metric: "heat" | "sentiment" | "volume" | "risk";
  horizonDays: number;
  confidenceLevel?: number;
}

export interface ForecastResult {
  dates: string[];
  predictedValues: number[];
  lowerBound: number[];
  upperBound: number[];
  modelVersion: string;
  featureImportance: Record<string, number>;
}
