"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";

interface MetricHighlightProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "flat";
  size?: "sm" | "md" | "lg";
  highlight?: boolean;
}

const sizeMap = {
  sm: { value: "text-xl", label: "text-xs" },
  md: { value: "text-2xl", label: "text-sm" },
  lg: { value: "text-3xl sm:text-4xl", label: "text-sm" },
};

/**
 * 关键指标高亮卡片
 * 支持三种尺寸和趋势指示
 */
export function MetricHighlight({
  label,
  value,
  change,
  changeLabel,
  trend = "flat",
  size = "md",
  highlight = false,
}: MetricHighlightProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 sm:p-5 transition-shadow",
        highlight && "ring-1 ring-primary/20 shadow-sm"
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("text-muted-foreground font-medium", sizeMap[size].label)}>
          {label}
        </span>
        <TrendIcon
          className={cn(
            "h-4 w-4 shrink-0",
            trend === "up" && "text-emerald-500",
            trend === "down" && "text-red-500",
            trend === "flat" && "text-gray-400"
          )}
        />
      </div>
      <div className={cn("font-bold tracking-tight mt-1", sizeMap[size].value)}>
        {value}
      </div>
      {(change !== undefined || changeLabel) && (
        <div className="flex items-center gap-1 mt-1.5">
          {change !== undefined && (
            <span
              className={cn(
                "text-xs font-semibold",
                change > 0 && "text-emerald-600",
                change < 0 && "text-red-600",
                change === 0 && "text-muted-foreground"
              )}
            >
              {change > 0 ? "+" : ""}
              {change}%
            </span>
          )}
          {changeLabel && (
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
