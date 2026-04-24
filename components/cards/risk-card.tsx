"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskEvent } from "@/types";
import { RISK_COLORS } from "@/config";
import { riskSeverityLabel, riskCategoryLabel } from "@/lib/labels";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";

interface RiskCardProps {
  event: RiskEvent;
  targetName?: string;
}

/**
 * 风险事件卡片
 * 展示风险严重度、类别、描述与时间
 */
export function RiskCard({ event, targetName }: RiskCardProps) {
  return (
    <Card className="card-elevated overflow-hidden border-l-4" style={{ borderLeftColor: RISK_COLORS[event.severity] }}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-sm leading-snug">{event.title}</h4>
              <Badge
                className="text-[10px] border"
                style={{
                  backgroundColor: RISK_COLORS[event.severity] + "12",
                  color: RISK_COLORS[event.severity],
                  borderColor: RISK_COLORS[event.severity] + "30",
                }}
                variant="outline"
              >
                {riskSeverityLabel[event.severity]}
              </Badge>
              {!event.resolved && (
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-red-50 text-red-600 border-red-100"
                >
                  未解决
                </Badge>
              )}
            </div>
            {targetName && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                涉及: {targetName}
              </p>
            )}
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {event.description}
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px]">
                {riskCategoryLabel[event.category]}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {formatDistanceToNow(new Date(event.date), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            </div>
          </div>
          <AlertTriangle
            className="h-5 w-5 shrink-0 mt-0.5"
            style={{ color: RISK_COLORS[event.severity] }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
