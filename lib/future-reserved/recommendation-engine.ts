/**
 * 【预留模块】智能推荐引擎 (Recommendation Engine)
 * ============================================================
 * 未来用途：
 *   基于品牌画像与 IP 画像的多维匹配算法，为品牌方智能推荐最适合的
 *   联名/代言 IP，或为 IP 方推荐潜在合作品牌。
 *
 * 推荐策略（预留）：
 *   - 协同过滤：分析历史上相似品牌的合作选择
 *   - 内容匹配：基于粉丝画像重叠度、调性契合度计算匹配分
 *   - 热点追踪：推荐当前热度上升期的 IP，把握流量窗口
 *   - 风险规避：自动过滤近期有负面舆情或高风险标签的 IP
 *   - 收益预测：结合历史案例预测合作 ROI 区间
 *
 * 输入输出：
 *   - 输入：品牌需求（预算、目标人群、品类、时间窗口）
 *   - 输出：排序后的 IP 推荐列表 + 匹配理由 + 预估效果
 *
 * 与现有系统集成点：
 *   - 被 app/ip-management/page.tsx 的「智能推荐」Tab 调用
 *   - 依赖 lib/scoring/index.ts 中的评分函数作为特征输入
 *   - 结果通过 Zustand store 供组件消费
 */

export interface RecommendationRequest {
  brandProfile: {
    industry: string;
    targetAgeRange: string[];
    budgetLevel: "low" | "medium" | "high";
    preferredCategories?: string[];
    avoidTags?: string[];
  };
  timeWindow: "immediate" | "quarter" | "year";
  topK?: number;
}

export interface RecommendationResult {
  ipId: string;
  ipName: string;
  matchScore: number;
  matchReasons: string[];
  estimatedROI: { min: number; max: number };
  riskAssessment: string;
}
