import { NavItem, WeightConfig } from "@/types";

export const APP_NAME = "IP 智鉴";
export const APP_DESCRIPTION = "IP 联名 / 授权 / 代言数据智能分析与舆情监控系统";

export const NAV_ITEMS: NavItem[] = [
  { title: "首页", path: "/", icon: "LayoutDashboard" },
  { title: "IP 库", path: "/ip-management/", icon: "Users" },
  { title: "价值评估", path: "/data-analysis/", icon: "BarChart3" },
  { title: "舆情监控", path: "/public-opinion/", icon: "Eye" },
  { title: "合作评估", path: "/cooperation/", icon: "Handshake" },
  { title: "对比分析", path: "/compare/", icon: "GitCompare" },
];

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_WEIGHT_CONFIG: WeightConfig = {
  heatWeight: 0.25,
  sentimentWeight: 0.2,
  engagementWeight: 0.2,
  riskWeight: 0.2,
  conversionWeight: 0.15,
};

export const SENTIMENT_COLORS = {
  positive: "#22c55e",
  neutral: "#3b82f6",
  negative: "#ef4444",
};

export const RISK_COLORS = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#7f1d1d",
};

/** MVP 评估模型配置（预留完整扩展位） */
export const EVALUATION_CONFIG = {
  /** 当前支持的评分维度（未来可扩展更多子维度） */
  dimensions: [
    {
      key: "communication",
      name: "传播力",
      description: "声量、曝光、互动、热度",
    },
    {
      key: "commercial",
      name: "商业力",
      description: "销量、GMV、转化率、客单价",
    },
    {
      key: "reputation",
      name: "口碑力",
      description: "正向比例、评论口碑、稳定性",
    },
    {
      key: "risk",
      name: "风险度",
      description: "负面占比、风险事件、异常波动",
    },
  ],
  /** 默认维度权重（后续接入 weight-config.ts 可动态调整） */
  defaultWeights: {
    communication: 0.3,
    commercial: 0.25,
    reputation: 0.25,
    riskInverted: 0.2, // 风险为反向指标，计算总分时使用 (100 - risk)
  },
  /** 等级阈值 */
  gradeThresholds: [
    { grade: "S", min: 90, max: 100 },
    { grade: "A", min: 80, max: 89 },
    { grade: "B", min: 70, max: 79 },
    { grade: "C", min: 60, max: 69 },
    { grade: "D", min: 0, max: 59 },
  ],
  /** 评分归一化基准值（用于未来权重配置的动态校准） */
  benchmarks: {
    maxDailyVolume: 70000,
    maxDailyExposure: 2000000,
    maxHeatScore: 100,
    maxEngagementRate: 0.05,
    maxSalesLift: 50,
    maxGmv: 250000000,
    maxConversionRate: 0.15,
    maxAvgOrderValue: 800,
  },
};
