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
import { categoryLabel, industryLabel, sentimentLabel } from "@/lib/labels";
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

/**
 * 监控对象详情弹窗
 * 展示基础信息、评分明细、趋势图表、历史合作与风险
 */
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

  const relatedContents = hotContents.filter(
    (c) => c.relatedTarget === target.id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-5 pb-3 sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b">
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {target.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-base sm:text-lg font-semibold">{target.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px]">
                  {categoryLabel[target.category]}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {industryLabel[target.industry]}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-5 pt-4">
          {/* 基础信息 */}
          <Card className="card-elevated">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs flex items-center gap-1.5 font-medium">
                <User className="h-3.5 w-3.5" />
                基础信息
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 px-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {target.description}
              </p>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-sm">
                <MetricItem label="声量" value={formatNumber(target.social.volume)} />
                <MetricItem label="曝光" value={formatNumber(target.social.exposure)} />
                <MetricItem label="互动" value={formatNumber(target.social.engagement)} />
                <MetricItem label="热度" value={target.social.heatScore} />
                {target.social.followers && (
                  <MetricItem label="粉丝" value={formatNumber(target.social.followers)} />
                )}
                <MetricItem label="媒体数" value={target.social.mediaCount} />
              </div>
            </CardContent>
          </Card>

          {/* 评分明细 */}
          <Card className="card-elevated">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs flex items-center gap-1.5 font-medium">
                <Award className="h-3.5 w-3.5" />
                评分明细
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 px-4">
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
                      color: "#2563eb",
                      fillOpacity: 0.3,
                    },
                  ]}
                  height={220}
                />
              </div>
            </CardContent>
          </Card>

          {/* 趋势图表 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TrendCard
              title="热度趋势"
              icon={<TrendingUp className="h-3.5 w-3.5 text-orange-500" />}
              data={toChartData(heatTrend)}
              color="#f59e0b"
            />
            <TrendCard
              title="情感走势"
              icon={<MessageSquare className="h-3.5 w-3.5 text-blue-500" />}
              data={toChartData(sentimentTrend)}
              color="#3b82f6"
            />
            <TrendCard
              title="声量趋势"
              icon={<BarChart3 className="h-3.5 w-3.5 text-purple-500" />}
              data={toChartData(volumeTrend)}
              color="#8b5cf6"
            />
          </div>

          {/* 历史合作摘要 */}
          {target.cooperationHistory.length > 0 && (
            <Card className="card-elevated">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-xs flex items-center gap-1.5 font-medium">
                  <Briefcase className="h-3.5 w-3.5" />
                  历史合作摘要
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 px-4 space-y-2">
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
                      <div className="w-12 sm:w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${h.effectScore}%` }}
                        />
                      </div>
                      <div className="text-sm font-semibold w-8 text-right">
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
            <Card className="card-elevated">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-xs flex items-center gap-1.5 font-medium">
                  <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                  舆情摘要
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 px-4 space-y-2">
                {relatedContents.map((content) => (
                  <div
                    key={content.id}
                    className="rounded-xl border p-3 hover:shadow-sm transition-shadow"
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
            <Card className="card-elevated">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-xs flex items-center gap-1.5 font-medium">
                  <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                  风险标签
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 px-4 space-y-2">
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

function MetricItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  );
}

function TrendCard({
  title,
  icon,
  data,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  data: { name: string; value: number }[];
  color: string;
}) {
  return (
    <Card className="card-elevated">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-[11px] flex items-center gap-1.5 font-medium">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 px-3">
        <TrendLineChart data={data} color={color} height={140} />
      </CardContent>
    </Card>
  );
}
