/**
 * 默认预警规则配置
 */

import { AlertRule } from "@/types";

export const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    id: "rule-negative-sentiment",
    name: "负面舆情激增",
    enabled: true,
    metric: "sentiment",
    operator: "gt",
    threshold: 0.6,
    timeWindowMinutes: 1440,
    severity: "warning",
    notifyChannels: ["ui"],
  },
  {
    id: "rule-new-risk",
    name: "风险事件新增",
    enabled: true,
    metric: "riskKeywords",
    operator: "gt",
    threshold: 0,
    timeWindowMinutes: 1440,
    severity: "critical",
    notifyChannels: ["ui"],
  },
  {
    id: "rule-reputation-drop",
    name: "口碑分骤降",
    enabled: true,
    metric: "sentiment",
    operator: "changeRate",
    threshold: -15,
    timeWindowMinutes: 10080,
    severity: "warning",
    notifyChannels: ["ui"],
  },
  {
    id: "rule-communication-spike",
    name: "传播力异常波动",
    enabled: true,
    metric: "volume",
    operator: "changeRate",
    threshold: 30,
    timeWindowMinutes: 10080,
    severity: "info",
    notifyChannels: ["ui"],
  },
];
