"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardKPI } from "@/types";

interface KPICardProps {
  data: DashboardKPI;
  highlight?: boolean;
}

const trendConfig = {
  up: { Icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
  down: { Icon: TrendingDown, color: "text-red-500", bg: "bg-red-50" },
  flat: { Icon: Minus, color: "text-gray-400", bg: "bg-gray-50" },
};

/**
 * KPI 指标卡片
 * 支持高亮状态，移动端字体自适应
 */
export function KPICard({ data, highlight }: KPICardProps) {
  const { Icon, color, bg } = trendConfig[data.trend];

  return (
    <Card className={cn("card-elevated overflow-hidden", highlight && "ring-1 ring-primary/15")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
          {data.title}
        </CardTitle>
        <div className={cn("rounded-md p-1.5", bg)}>
          <Icon className={cn("h-3.5 w-3.5", color)} />
        </div>
      </CardHeader>
      <CardContent className="pb-4 px-4">
        <div className="text-xl sm:text-2xl font-bold tracking-tight">{data.value}</div>
        <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <span
            className={cn(
              "font-semibold",
              data.change > 0 && "text-emerald-600",
              data.change < 0 && "text-red-600",
              data.change === 0 && "text-muted-foreground"
            )}
          >
            {data.change > 0 ? "+" : ""}
            {data.change}%
          </span>
          <span>{data.changeLabel}</span>
        </p>
      </CardContent>
    </Card>
  );
}
