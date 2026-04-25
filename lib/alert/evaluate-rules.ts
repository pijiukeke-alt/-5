/**
 * 预警规则评估引擎
 * 对监控对象集执行规则判断，生成 AlertEvent 列表
 */

import { MonitoringTarget, AlertRule, AlertEvent, AlertSeverity } from "@/types";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function severityPriority(a: AlertSeverity, b: AlertSeverity): number {
  const map = { critical: 3, warning: 2, info: 1 };
  return map[a] - map[b];
}

/** 计算目标在趋势最近 N 天的变化率 */
function calcTrendChange(values: number[], days: number): number {
  if (values.length < days + 1) return 0;
  const recent = values[values.length - 1];
  const past = values[values.length - 1 - days];
  if (!past) return 0;
  return ((recent - past) / past) * 100;
}

function evaluateRule(targets: MonitoringTarget[], rule: AlertRule): AlertEvent[] {
  const events: AlertEvent[] = [];
  const now = new Date().toISOString();

  for (const target of targets) {
    const score = calculateEvaluationScore(target);
    let triggered = false;
    let metricValue = 0;
    let message = "";

    switch (rule.metric) {
      case "sentiment": {
        const negRatio = target.sentiment.negativeRatio;
        const posRatio = target.sentiment.positiveRatio;
        if (rule.operator === "gt" && negRatio > rule.threshold) {
          triggered = true;
          metricValue = Math.round(negRatio * 100);
          message = `${target.name} 负面情感占比达 ${metricValue}%，超过阈值 ${Math.round(rule.threshold * 100)}%`;
        }
        if (rule.operator === "changeRate") {
          const change = calcTrendChange(target.trend.sentiment, 7);
          // 口碑分骤降：取 reputation 维度变化近似
          if (change < rule.threshold) {
            triggered = true;
            metricValue = Math.round(change);
            message = `${target.name} 近7天情感走势下降 ${Math.abs(metricValue)}%，口碑稳定性降低`;
          }
        }
        break;
      }
      case "riskKeywords": {
        // 24h 内新增未解决风险事件
        const dayAgo = Date.now() - rule.timeWindowMinutes * 60 * 1000;
        const newEvents = target.riskEvents.filter(
          (e) => !e.resolved && new Date(e.date).getTime() > dayAgo
        );
        if (newEvents.length > 0) {
          triggered = true;
          metricValue = newEvents.length;
          message = `${target.name} 新增 ${newEvents.length} 个未解决风险事件：${newEvents[0].title}`;
        }
        break;
      }
      case "volume": {
        const change = calcTrendChange(target.trend.volume, 7);
        if (rule.operator === "changeRate" && Math.abs(change) > Math.abs(rule.threshold)) {
          triggered = true;
          metricValue = Math.round(change);
          message = `${target.name} 近7天声量${change > 0 ? "激增" : "骤降"} ${Math.abs(metricValue)}%`;
        }
        break;
      }
      default:
        break;
    }

    if (triggered) {
      events.push({
        id: generateId(),
        ruleId: rule.id,
        triggeredAt: now,
        metricValue,
        severity: rule.severity,
        message,
        relatedIPs: [target.id],
        acknowledged: false,
      });
    }
  }

  return events;
}

/**
 * 对全部目标执行规则评估
 * 返回去重后的 AlertEvent 列表（按 severity 降序）
 */
export function evaluateRules(
  targets: MonitoringTarget[],
  rules: AlertRule[]
): AlertEvent[] {
  const allEvents: AlertEvent[] = [];

  for (const rule of rules) {
    if (!rule.enabled) continue;
    const events = evaluateRule(targets, rule);
    allEvents.push(...events);
  }

  // 去重：同一 ruleId + 同一 relatedIPs[0] 保留 severity 最高的一条
  const seen = new Map<string, AlertEvent>();
  for (const ev of allEvents) {
    const key = `${ev.ruleId}-${ev.relatedIPs[0] || "none"}`;
    const existing = seen.get(key);
    if (!existing || severityPriority(ev.severity, existing.severity) > 0) {
      seen.set(key, ev);
    }
  }

  return Array.from(seen.values()).sort(
    (a, b) => severityPriority(b.severity, a.severity) || new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()
  );
}
