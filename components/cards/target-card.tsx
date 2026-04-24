"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MonitoringTarget } from "@/types";
import { RISK_COLORS } from "@/config";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { formatNumber } from "@/lib/transform";
import { cn } from "@/lib/utils";
import { categoryLabel, industryLabel } from "@/lib/labels";

interface TargetCardProps {
  target: MonitoringTarget;
  showScore?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

/**
 * 监控对象卡片
 * 用于 IP 库列表、合作评估等场景
 */
export function TargetCard({
  target,
  showScore = true,
  onClick,
  selected,
}: TargetCardProps) {
  const score = showScore ? calculateEvaluationScore(target) : null;
  const primaryRisk =
    target.riskEvents.length > 0
      ? target.riskEvents.reduce((max, e) =>
          ({ low: 1, medium: 2, high: 3, critical: 4 }[e.severity] >
          { low: 1, medium: 2, high: 3, critical: 4 }[max.severity]
            ? e
            : max)
        )
      : null;

  return (
    <Card
      className={cn(
        "card-elevated cursor-pointer overflow-hidden",
        selected && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm sm:text-lg font-semibold">
              {target.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h3 className="font-semibold text-sm sm:text-base truncate">
                {target.name}
              </h3>
              <Badge variant="secondary" className="text-[10px] sm:text-xs">
                {categoryLabel[target.category]}
              </Badge>
              <Badge variant="outline" className="text-[10px] sm:text-xs">
                {industryLabel[target.industry]}
              </Badge>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {target.description}
            </p>
            <div className="mt-2 flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="font-medium text-foreground">热度 {target.social.heatScore}</span>
              <span>声量 {formatNumber(target.social.volume)}</span>
              {target.social.followers && (
                <span>粉丝 {formatNumber(target.social.followers)}</span>
              )}
            </div>
            {score && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md border",
                    score.grade === "S" && "bg-amber-50 text-amber-700 border-amber-200",
                    score.grade === "A" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                    score.grade === "B" && "bg-blue-50 text-blue-700 border-blue-200",
                    score.grade === "C" && "bg-gray-50 text-gray-700 border-gray-200",
                    score.grade === "D" && "bg-red-50 text-red-700 border-red-200"
                  )}
                >
                  {score.grade} · {score.total}分
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:inline">
                  传播{score.dimensions.communication} 商业
                  {score.dimensions.commercial} 口碑
                  {score.dimensions.reputation} 风险
                  {score.dimensions.risk}
                </span>
              </div>
            )}
            {primaryRisk && !primaryRisk.resolved && (
              <div
                className="mt-2 text-[10px] font-medium px-2.5 py-0.5 rounded-full inline-block"
                style={{
                  backgroundColor: RISK_COLORS[primaryRisk.severity] + "15",
                  color: RISK_COLORS[primaryRisk.severity],
                }}
              >
                未解决风险: {primaryRisk.title}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
