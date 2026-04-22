/**
 * 【预留模块】权重配置中心 (Weight Config Center)
 * ============================================================
 * 未来用途：
 *   提供评分模型的多维度权重动态调整能力，支持预设模板与自定义配置，
 *   让不同业务场景（如品牌联名 vs 明星代言）使用不同的评分侧重。
 *
 * 核心能力：
 *   - 预设模板：联名评估、代言评估、授权评估、舆情监控
 *   - 自定义配置：UI 拖拽调整权重，实时预览评分变化
 *   - A/B 测试：同时运行多套权重，对比评估结果差异
 *   - 历史版本：权重修改记录可追溯，支持回滚
 *
 * 评分维度（与 lib/scoring/index.ts 对齐）：
 *   - heatWeight      (热度)
 *   - sentimentWeight (情感)
 *   - engagementWeight(互动)
 *   - riskWeight      (风险)
 *   - conversionWeight(转化)
 *
 * 与现有系统集成点：
 *   - 被 lib/scoring/index.ts 读取作为 calculateCompositeScore 的参数
 *   - 在 app/data-analysis/page.tsx 中增加「模型配置」Tab
 *   - 配置持久化到后端，前端通过 Zustand store 缓存
 */

import { WeightConfig } from "@/types";

export interface WeightTemplate {
  id: string;
  name: string;
  description: string;
  config: WeightConfig;
  applicableScenes: string[];
}

export interface WeightPreset {
  id: string;
  name: string;
  templates: WeightTemplate[];
  defaultTemplateId: string;
}

export const PRESET_TEMPLATES: WeightTemplate[] = [
  {
    id: "default",
    name: "默认均衡",
    description: "五维均衡评估，适用于通用场景",
    config: {
      heatWeight: 0.25,
      sentimentWeight: 0.2,
      engagementWeight: 0.2,
      riskWeight: 0.2,
      conversionWeight: 0.15,
    },
    applicableScenes: ["通用"],
  },
  {
    id: "co-branding",
    name: "联名评估",
    description: "侧重热度与转化，适合短期联名爆发",
    config: {
      heatWeight: 0.35,
      sentimentWeight: 0.15,
      engagementWeight: 0.2,
      riskWeight: 0.1,
      conversionWeight: 0.2,
    },
    applicableScenes: ["联名", "跨界"],
  },
  {
    id: "endorsement",
    name: "代言评估",
    description: "侧重情感与风险，适合长期代言人选择",
    config: {
      heatWeight: 0.2,
      sentimentWeight: 0.3,
      engagementWeight: 0.15,
      riskWeight: 0.25,
      conversionWeight: 0.1,
    },
    applicableScenes: ["代言", "大使"],
  },
  {
    id: "risk-monitor",
    name: "风险监控",
    description: "极高风险权重，适合舆情监控预警",
    config: {
      heatWeight: 0.1,
      sentimentWeight: 0.25,
      engagementWeight: 0.15,
      riskWeight: 0.45,
      conversionWeight: 0.05,
    },
    applicableScenes: ["舆情监控", "危机管理"],
  },
];
