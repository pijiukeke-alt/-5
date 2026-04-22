"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScoreCard } from "@/components/cards/score-card";
import { RiskCard } from "@/components/cards/risk-card";
import { TrendLineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitoringTarget } from "@/types";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { toChartData, formatNumber } from "@/lib/transform";

interface TargetDetailDialogProps {
  target: MonitoringTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function TargetDetailDialog({
  target,
  open,
  onOpenChange,
}: TargetDetailDialogProps) {
  if (!target) return null;

  const score = calculateEvaluationScore(target);

  const heatTrend = target.trend.dates.map((date, i) => ({
    date,
    value: target.trend.heat[i],
  }));

  const sentimentTrend = target.trend.dates.map((date, i) => ({
    date,
    value: target.trend.sentiment[i],
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {target.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg">{target.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {categoryLabel[target.category]}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {industryLabel[target.industry]}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            {target.description}
          </p>

          <ScoreCard score={score} />

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">热度趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendLineChart
                  data={toChartData(heatTrend)}
                  color="#f59e0b"
                  height={180}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">情感走势</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendLineChart
                  data={toChartData(sentimentTrend)}
                  color="#3b82f6"
                  height={180}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs">社媒数据</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">声量</span>
                  <span>{formatNumber(target.social.volume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">曝光</span>
                  <span>{formatNumber(target.social.exposure)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">互动</span>
                  <span>{formatNumber(target.social.engagement)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">热度</span>
                  <span>{target.social.heatScore}</span>
                </div>
                {target.social.followers && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">粉丝</span>
                    <span>{formatNumber(target.social.followers)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {target.riskEvents.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">风险事件</h4>
              {target.riskEvents.map((e) => (
                <RiskCard key={e.id} event={e} />
              ))}
            </div>
          )}

          {target.cooperationHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">历史合作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {target.cooperationHistory.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm py-1 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium">{h.brandName}</div>
                      <div className="text-xs text-muted-foreground">
                        {h.type} · {h.date}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {h.effectScore}分
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
