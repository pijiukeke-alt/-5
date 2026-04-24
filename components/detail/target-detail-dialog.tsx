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
import { SimpleRadarChart } from "@/components/charts/radar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitoringTarget } from "@/types";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { toChartData, formatNumber } from "@/lib/transform";
import { hotContents } from "@/data/mock/opinion-extra";
import { cn } from "@/lib/utils";
import {
  User,
  Briefcase,
  MessageSquare,
  ShieldAlert,
  Award,
  TrendingUp,
  BarChart3,
} from "lucide-react";

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

const sentimentLabel = {
  positive: { text: "正面", class: "bg-green-50 text-green-700 border-green-200" },
  neutral: { text: "中性", class: "bg-gray-50 text-gray-700 border-gray-200" },
  negative: { text: "负面", class: "bg-red-50 text-red-700 border-red-200" },
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

  const volumeTrend = target.trend.dates.map((date, i) => ({
    date,
    value: target.trend.volume[i],
  }));

  // 关联的舆情内容
  const relatedContents = hotContents.filter(
    (c) => c.relatedTarget === target.id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
          {/* 基础信息 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                基础信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{target.description}</p>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg bg-muted/50 p-2">
                  <div className="text-xs text-muted-foreground">声量</div>
                  <div className="font-medium">{formatNumber(target.social.volume)}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <div className="text-xs text-muted-foreground">曝光</div>
                  <div className="font-medium">{formatNumber(target.social.exposure)}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <div className="text-xs text-muted-foreground">互动</div>
                  <div className="font-medium">{formatNumber(target.social.engagement)}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <div className="text-xs text-muted-foreground">热度</div>
                  <div className="font-medium">{target.social.heatScore}</div>
                </div>
                {target.social.followers && (
                  <div className="rounded-lg bg-muted/50 p-2">
                    <div className="text-xs text-muted-foreground">粉丝</div>
                    <div className="font-medium">
                      {formatNumber(target.social.followers)}
                    </div>
                  </div>
                )}
                <div className="rounded-lg bg-muted/50 p-2">
                  <div className="text-xs text-muted-foreground">媒体数</div>
                  <div className="font-medium">{target.social.mediaCount}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 评分明细 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" />
                评分明细
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScoreCard score={score} />
              <div className="mt-3">
                <SimpleRadarChart
                  subjects={["传播力", "商业力", "口碑力", "风险度"]}
                  series={[
                    {
                      name: target.name,
                      data: [
                        score.dimensions.communication,
                        score.dimensions.commercial,
                        score.dimensions.reputation,
                        score.dimensions.risk,
                      ],
                      color: "#3b82f6",
                      fillOpacity: 0.3,
                    },
                  ]}
                  height={220}
                />
              </div>
            </CardContent>
          </Card>

          {/* 趋势图表 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                  热度趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendLineChart
                  data={toChartData(heatTrend)}
                  color="#f59e0b"
                  height={160}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                  情感走势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendLineChart
                  data={toChartData(sentimentTrend)}
                  color="#3b82f6"
                  height={160}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5 text-purple-500" />
                  声量趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendLineChart
                  data={toChartData(volumeTrend)}
                  color="#8b5cf6"
                  height={160}
                />
              </CardContent>
            </Card>
          </div>

          {/* 历史合作摘要 */}
          {target.cooperationHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  历史合作摘要
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {target.cooperationHistory.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium">{h.brandName}</div>
                      <div className="text-xs text-muted-foreground">
                        {h.type} · {h.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${h.effectScore}%` }}
                        />
                      </div>
                      <div className="text-sm font-medium w-8 text-right">
                        {h.effectScore}分
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 舆情摘要 */}
          {relatedContents.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                  舆情摘要
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {relatedContents.map((content) => (
                  <div
                    key={content.id}
                    className="rounded-lg border p-3 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm">{content.title}</h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          sentimentLabel[content.sentiment].class
                        )}
                      >
                        {sentimentLabel[content.sentiment].text}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {content.summary}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{content.platform}</span>
                      <span>{content.publishTime}</span>
                      <span>热度 {content.heat}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 风险标签 */}
          {target.riskEvents.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                  风险标签
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {target.riskEvents.map((e) => (
                  <RiskCard key={e.id} event={e} />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
