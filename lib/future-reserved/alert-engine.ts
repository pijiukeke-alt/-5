/**
 * 【预留模块】舆情预警引擎 (Alert Engine)
 * ============================================================
 * 未来用途：
 *   实时监控舆情数据流，当特定指标突破阈值时触发多渠道告警，
 *   支持规则引擎与机器学习模型的混合判断模式。
 *
 * 预警维度：
 *   - 情感突变：负面情感占比在短时间内大幅上升
 *   - 声量激增：某 IP/品牌的提及量超过历史基线 N 个标准差
 *   - 风险事件：检测到敏感关键词组合（如"翻车""抵制""道歉"）
 *   - 竞品动态：竞品的重大联名/代言动作
 *   - 合规风险：广告法敏感词、虚假宣传线索
 *
 * 告警渠道（预留）：
 *   企业微信、钉钉、飞书、邮件、短信、Webhook
 *
 * 与现有系统集成点：
 *   - 输入：lib/future-reserved/data-cleaning.ts 输出的实时清洗数据
 *   - 配置：读取 config/index.ts 中的默认阈值，支持 UI 动态调整
 *   - 展示：在 app/public-opinion/page.tsx 中增加「预警看板」子模块
 */

export interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  metric: "sentiment" | "volume" | "riskKeywords" | "competitor";
  operator: "gt" | "lt" | "eq" | "changeRate";
  threshold: number;
  timeWindowMinutes: number;
  severity: "info" | "warning" | "critical";
  notifyChannels: string[];
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  triggeredAt: string;
  metricValue: number;
  severity: "info" | "warning" | "critical";
  message: string;
  relatedIPs: string[];
  acknowledged: boolean;
}
