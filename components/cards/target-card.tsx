"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MonitoringTarget } from "@/types";
import { RISK_COLORS } from "@/config";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { formatNumber } from "@/lib/transform";
import { cn } from "@/lib/utils";

interface TargetCardProps {
  target: MonitoringTarget;
  showScore?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

const categoryLabel: Record<string, string> = {
  ip: "IP",
  celebrity: "艺人",
  cooperation: "合作",
};

const industryLabel: Record<string, string> = {
  beauty: "美妆",
  food: "食品饮料",
  "3c": "3C数码",
  toy: "潮玩",
  fashion: "服饰",
  travel: "文旅",
};

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
        "hover:shadow-md transition-shadow cursor-pointer",
        selected && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {target.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base truncate">
                {target.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {categoryLabel[target.category]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {industryLabel[target.industry]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {target.description}
            </p>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span>热度 {target.social.heatScore}</span>
              <span>声量 {formatNumber(target.social.volume)}</span>
              {target.social.followers && (
                <span>粉丝 {formatNumber(target.social.followers)}</span>
              )}
            </div>
            {score && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded",
                    score.grade === "S" && "bg-amber-100 text-amber-700",
                    score.grade === "A" && "bg-green-100 text-green-700",
                    score.grade === "B" && "bg-blue-100 text-blue-700",
                    score.grade === "C" && "bg-gray-100 text-gray-700",
                    score.grade === "D" && "bg-red-100 text-red-700"
                  )}
                >
                  {score.grade} · {score.total}分
                </span>
                <span className="text-[10px] text-muted-foreground">
                  传播{score.dimensions.communication} 商业
                  {score.dimensions.commercial} 口碑
                  {score.dimensions.reputation} 风险
                  {score.dimensions.risk}
                </span>
              </div>
            )}
            {primaryRisk && !primaryRisk.resolved && (
              <div
                className="mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full inline-block"
                style={{
                  backgroundColor: RISK_COLORS[primaryRisk.severity] + "20",
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
