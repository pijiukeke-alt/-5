"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardKPI } from "@/types";

interface KPICardProps {
  data: DashboardKPI;
}

export function KPICard({ data }: KPICardProps) {
  const TrendIcon =
    data.trend === "up" ? TrendingUp : data.trend === "down" ? TrendingDown : Minus;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {data.title}
        </CardTitle>
        <TrendIcon
          className={cn(
            "h-4 w-4",
            data.trend === "up" && "text-green-500",
            data.trend === "down" && "text-red-500",
            data.trend === "flat" && "text-gray-400"
          )}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span
            className={cn(
              "font-medium",
              data.change > 0 && "text-green-600",
              data.change < 0 && "text-red-600"
            )}
          >
            {data.change > 0 ? "+" : ""}
            {data.change}%
          </span>{" "}
          {data.changeLabel}
        </p>
      </CardContent>
    </Card>
  );
}
