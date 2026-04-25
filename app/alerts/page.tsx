"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useAppStore } from "@/store/app-store";
import { SectionHeader, EmptyState } from "@/components/shared";
import { PageSkeleton } from "@/components/loading/page-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertSeverity } from "@/types";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const severityConfig: Record<
  AlertSeverity,
  { icon: ReactNode; label: string; color: string; border: string; bg: string }
> = {
  critical: {
    icon: <AlertTriangle className="h-4 w-4" />,
    label: "严重",
    color: "text-red-600",
    border: "border-red-200",
    bg: "bg-red-50",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    label: "警告",
    color: "text-amber-600",
    border: "border-amber-200",
    bg: "bg-amber-50",
  },
  info: {
    icon: <Info className="h-4 w-4" />,
    label: "提醒",
    color: "text-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50",
  },
};

type FilterType = "all" | AlertSeverity;

export default function AlertsPage() {
  const initialized = useAppStore((s) => s.initialized);
  const loading = useAppStore((s) => s.loading);
  const error = useAppStore((s) => s.error);
  const alertEvents = useAppStore((s) => s.alertEvents);
  const unreadCount = useAppStore((s) => s.unreadCount);
  const acknowledgeAlert = useAppStore((s) => s.acknowledgeAlert);
  const clearAlerts = useAppStore((s) => s.clearAlerts);

  const [filter, setFilter] = useState<FilterType>("all");

  if (!initialized || loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        icon="alert"
        title="数据加载失败"
        description={error}
        action={
          <Button variant="outline" onClick={() => window.location.reload()}>
            刷新页面
          </Button>
        }
      />
    );
  }

  const filtered =
    filter === "all"
      ? alertEvents
      : alertEvents.filter((e) => e.severity === filter);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="预警中心"
        description="实时监控舆情异常、风险事件与指标波动"
        helpText="预警规则每 30 秒自动评估一次，产生的新事件会在此聚合展示。点击「已读」消除未读标记。"
        action={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                {unreadCount} 未读
              </Badge>
            )}
            {alertEvents.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAlerts}>
                <XCircle className="h-4 w-4 mr-1" />
                清空
              </Button>
            )}
          </div>
        }
      />

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {(["all", "critical", "warning", "info"] as FilterType[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "全部" : severityConfig[f].label}
            {f !== "all" && (
              <span className="ml-1 text-muted-foreground">
                {alertEvents.filter((e) => e.severity === f).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Alert List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="暂无预警事件"
          description="当前所有监控指标正常，未触发任何预警规则"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => {
            const cfg = severityConfig[event.severity];
            return (
              <Card
                key={event.id}
                className={cn(
                  "transition-all",
                  event.acknowledged ? "opacity-60" : ""
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                        cfg.border,
                        cfg.bg,
                        cfg.color
                      )}
                    >
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] h-5", cfg.color)}
                        >
                          {cfg.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.triggeredAt).toLocaleString("zh-CN")}
                        </span>
                      </div>
                      <p className="text-sm mt-1.5 leading-relaxed">{event.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">
                          指标值: {" "}
                          <span className="font-medium tabular-nums">
                            {event.metricValue}
                          </span>
                        </span>
                        {!event.acknowledged && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => acknowledgeAlert(event.id)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            标记已读
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
