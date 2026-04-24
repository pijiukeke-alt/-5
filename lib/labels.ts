/**
 * 统一的标签映射表
 * 避免各组件重复定义相同的 label map
 */

export const categoryLabel: Record<string, string> = {
  ip: "IP",
  celebrity: "艺人",
  cooperation: "合作",
};

export const industryLabel: Record<string, string> = {
  beauty: "美妆",
  food: "食品饮料",
  "3c": "3C数码",
  toy: "潮玩",
  fashion: "服饰",
  travel: "文旅",
};

export const riskSeverityLabel: Record<string, string> = {
  critical: "危急",
  high: "高风险",
  medium: "中风险",
  low: "低风险",
};

export const riskCategoryLabel: Record<string, string> = {
  negative_opinion: "负面舆情",
  controversy: "争议事件",
  legal: "法律合规",
  quality: "产品质量",
};

export const sentimentLabel: Record<string, { text: string; class: string }> = {
  positive: { text: "正面", class: "bg-green-50 text-green-700 border-green-200" },
  neutral: { text: "中性", class: "bg-gray-50 text-gray-700 border-gray-200" },
  negative: { text: "负面", class: "bg-red-50 text-red-700 border-red-200" },
};

export const gradeStyle: Record<string, string> = {
  S: "bg-amber-50 text-amber-700 border-amber-200",
  A: "bg-emerald-50 text-emerald-700 border-emerald-200",
  B: "bg-blue-50 text-blue-700 border-blue-200",
  C: "bg-gray-50 text-gray-700 border-gray-200",
  D: "bg-red-50 text-red-700 border-red-200",
};

export const dimLabel: Record<string, string> = {
  communication: "传播力",
  commercial: "商业力",
  reputation: "口碑力",
  risk: "风险度",
};

export const dimColors: Record<string, string> = {
  communication: "#2563eb",
  commercial: "#d97706",
  reputation: "#059669",
  risk: "#dc2626",
};
