"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskEvent } from "@/types";
import { RISK_COLORS } from "@/config";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface RiskCardProps {
  event: RiskEvent;
  targetName?: string;
}

const categoryLabel: Record<string, string> = {
  negative_opinion: "负面舆情",
  controversy: "争议事件",
  legal: "法律合规",
  quality: "产品质量",
};

export function RiskCard({ event, targetName }: RiskCardProps) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-sm">{event.title}</h4>
              <Badge
                className="text-[10px]"
                style={{
                  backgroundColor: RISK_COLORS[event.severity] + "20",
                  color: RISK_COLORS[event.severity],
                  borderColor: RISK_COLORS[event.severity] + "40",
                }}
                variant="outline"
              >
                {event.severity === "critical"
                  ? "危急"
                  : event.severity === "high"
                  ? "高风险"
                  : event.severity === "medium"
                  ? "中风险"
                  : "低风险"}
              </Badge>
              {!event.resolved && (
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-red-50 text-red-600"
                >
                  未解决
                </Badge>
              )}
            </div>
            {targetName && (
              <p className="text-xs text-muted-foreground mt-0.5">
                涉及: {targetName}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {event.description}
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px]">
                {categoryLabel[event.category]}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {formatDistanceToNow(new Date(event.date), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
