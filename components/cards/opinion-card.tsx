"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OpinionEvent } from "@/types";
import { SENTIMENT_COLORS, RISK_COLORS } from "@/config";
import { riskSeverityLabel, sentimentLabel } from "@/lib/labels";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface OpinionCardProps {
  event: OpinionEvent;
}

/**
 * 舆情事件卡片
 * 展示事件标题、情感、来源与风险等级
 */
export function OpinionCard({ event }: OpinionCardProps) {
  return (
    <Card className="card-elevated overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-snug">{event.title}</h4>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {event.summary}
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Badge
                className="text-[10px] border"
                style={{
                  backgroundColor: SENTIMENT_COLORS[event.sentiment] + "15",
                  color: SENTIMENT_COLORS[event.sentiment],
                  borderColor: SENTIMENT_COLORS[event.sentiment] + "30",
                }}
                variant="outline"
              >
                {sentimentLabel[event.sentiment].text}
              </Badge>
              <span className="text-[10px] text-muted-foreground">{event.source}</span>
              <span className="text-[10px] text-muted-foreground">
                {formatDistanceToNow(new Date(event.publishTime), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: RISK_COLORS[event.riskLevel] + "15",
                color: RISK_COLORS[event.riskLevel],
              }}
            >
              {riskSeverityLabel[event.riskLevel]}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              声量 {(event.volume / 10000).toFixed(1)}万
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
