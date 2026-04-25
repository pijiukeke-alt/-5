export interface IPItem {
  id: string;
  name: string;
  category: "anime" | "game" | "celebrity" | "brand" | "sports" | "art";
  avatar?: string;
  heatScore: number;
  followerCount: number;
  fanProfile: {
    ageRange: Record<string, number>;
    gender: Record<string, number>;
    region: Record<string, number>;
  };
  cooperationHistory: string[];
  tags: string[];
  riskLevel: "low" | "medium" | "high";
  createdAt: string;
}

export interface CooperationCase {
  id: string;
  ipId: string;
  ipName: string;
  brandName: string;
  brandLogo?: string;
  type: "co-branding" | "endorsement" | "licensing" | "crossover";
  startDate: string;
  endDate?: string;
  effectScore: number;
  salesLift?: number;
  mediaExposure: number;
  sentimentScore: number;
  tags: string[];
  status: "ongoing" | "completed" | "planned";
}

export interface OpinionEvent {
  id: string;
  title: string;
  source: string;
  url?: string;
  publishTime: string;
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  volume: number;
  keywords: string[];
  relatedIPs: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  summary: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface DashboardKPI {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  trend: "up" | "down" | "flat";
}

export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

export interface WeightConfig {
  heatWeight: number;
  sentimentWeight: number;
  engagementWeight: number;
  riskWeight: number;
  conversionWeight: number;
}

export interface CompareItem {
  id: string;
  name: string;
  metrics: Record<string, number>;
}

export interface NavItem {
  title: string;
  path: string;
  icon: string;
}

// ============================================================
// P0: API & Alert Types
// ============================================================

export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type AlertSeverity = "info" | "warning" | "critical";

export interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  metric: "sentiment" | "volume" | "riskKeywords" | "competitor";
  operator: "gt" | "lt" | "eq" | "changeRate";
  threshold: number;
  timeWindowMinutes: number;
  severity: AlertSeverity;
  notifyChannels: string[];
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  triggeredAt: string;
  metricValue: number;
  severity: AlertSeverity;
  message: string;
  relatedIPs: string[];
  acknowledged: boolean;
}

// ============================================================
// MVP 核心数据类型（数据层 + 评分层）
// ============================================================

/** 监控对象分类 */
export type TargetCategory = "ip" | "celebrity" | "cooperation";

/** 行业分类 */
export type Industry =
  | "beauty"
  | "food"
  | "3c"
  | "toy"
  | "fashion"
  | "travel";

/** 社媒传播数据 */
export interface SocialMetric {
  /** 声量：近30天日均提及数 */
  volume: number;
  /** 曝光量：近30天日均曝光人次 */
  exposure: number;
  /** 互动量：点赞+评论+转发总数 */
  engagement: number;
  /** 热度指数 0-100 */
  heatScore: number;
  /** 粉丝量（艺人/IP 适用） */
  followers?: number;
  /** 相关媒体/内容数 */
  mediaCount: number;
}

/** 舆情情感指标 */
export interface SentimentMetric {
  /** 正面占比 0-1 */
  positiveRatio: number;
  /** 中性占比 0-1 */
  neutralRatio: number;
  /** 负面占比 0-1 */
  negativeRatio: number;
  /** 口碑稳定性 0-100（情感波动越小越高） */
  stabilityScore: number;
  /** 平均评论评分 0-5 */
  avgCommentRating: number;
}

/** 商业数据指标 */
export interface BusinessMetric {
  /** 销量提升百分比 */
  salesLift?: number;
  /** GMV（元） */
  gmv?: number;
  /** 转化率 % */
  conversionRate?: number;
  /** 客单价（元） */
  avgOrderValue?: number;
  /** ROI */
  roi?: number;
}

/** 风险事件 */
export interface RiskEvent {
  id: string;
  title: string;
  date: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "negative_opinion" | "controversy" | "legal" | "quality";
  description: string;
  /** 是否已妥善解决 */
  resolved: boolean;
}

/** 历史合作摘要 */
export interface CooperationHistoryItem {
  brandName: string;
  type: string;
  date: string;
  effectScore: number;
}

/** 30天趋势数据 */
export interface TrendData {
  dates: string[];
  volume: number[];
  heat: number[];
  /** 日均情感分 -1 ~ 1 */
  sentiment: number[];
  exposure: number[];
}

/** 监控对象（IP / 艺人 / 合作案例的统一抽象） */
export interface MonitoringTarget {
  id: string;
  name: string;
  category: TargetCategory;
  industry: Industry;
  avatar?: string;
  description: string;
  social: SocialMetric;
  sentiment: SentimentMetric;
  business: BusinessMetric;
  riskEvents: RiskEvent[];
  cooperationHistory: CooperationHistoryItem[];
  trend: TrendData;
  /** 数据最后更新时间 */
  updatedAt: string;
}

/** 4维评估得分 */
export interface EvaluationScore {
  targetId: string;
  targetName: string;
  dimensions: {
    communication: number; // 传播力 0-100
    commercial: number; // 商业力 0-100
    reputation: number; // 口碑力 0-100
    risk: number; // 风险度 0-100（越高越危险）
  };
  /** 综合总分 0-100（已反向计算风险） */
  total: number;
  /** 等级 */
  grade: "S" | "A" | "B" | "C" | "D";
  calculatedAt: string;
}

/** 对比结果 */
export interface CompareResult {
  targets: MonitoringTarget[];
  scores: EvaluationScore[];
  /** 各维度差异率：dimensionKey -> targetId -> diff% */
  dimensionDiffs: Record<string, Record<string, number>>;
  /** 综合胜出者 ID */
  winnerId: string | null;
}

/** 评分配置 */
export interface EvaluationConfig {
  dimensions: {
    key: string;
    name: string;
    description: string;
  }[];
  defaultWeights: {
    communication: number;
    commercial: number;
    reputation: number;
    riskInverted: number;
  };
  gradeThresholds: {
    grade: string;
    min: number;
    max: number;
  }[];
}
