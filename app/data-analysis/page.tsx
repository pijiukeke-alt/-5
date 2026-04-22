"use client";

import { ScoreCard } from "@/components/cards/score-card";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { SimpleRadarChart } from "@/components/charts/radar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllScores, getTopTargets } from "@/lib/evaluation/api";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";

export default function DataAnalysisPage() {
  const scores = getAllScores().sort((a, b) => b.total - a.total);
  const top3 = getTopTargets(3);

  // 4维平均分
  const avgDims = {
    communication: Math.round(
      scores.reduce((s, sc) => s + sc.dimensions.communication, 0) /
        scores.length
    ),
    commercial: Math.round(
      scores.reduce((s, sc) => s + sc.dimensions.commercial, 0) /
        scores.length
    ),
    reputation: Math.round(
      scores.reduce((s, sc) => s + sc.dimensions.reputation, 0) /
        scores.length
    ),
    risk: Math.round(
      scores.reduce((s, sc) => s + sc.dimensions.risk, 0) / scores.length
    ),
  };

  const dimBarData = [
    { name: "传播力", value: avgDims.communication },
    { name: "商业力", value: avgDims.commercial },
    { name: "口碑力", value: avgDims.reputation },
    { name: "风险度", value: avgDims.risk },
  ];

  // Top 3 雷达图
  const radarData = [
    {
      subject: "传播力",
      A: top3[0] ? calculateEvaluationScore(top3[0]).dimensions.communication : 0,
      B: top3[1] ? calculateEvaluationScore(top3[1]).dimensions.communication : 0,
      fullMark: 100,
    },
    {
      subject: "商业力",
      A: top3[0] ? calculateEvaluationScore(top3[0]).dimensions.commercial : 0,
      B: top3[1] ? calculateEvaluationScore(top3[1]).dimensions.commercial : 0,
      fullMark: 100,
    },
    {
      subject: "口碑力",
      A: top3[0] ? calculateEvaluationScore(top3[0]).dimensions.reputation : 0,
      B: top3[1] ? calculateEvaluationScore(top3[1]).dimensions.reputation : 0,
      fullMark: 100,
    },
    {
      subject: "风险度",
      A: top3[0] ? calculateEvaluationScore(top3[0]).dimensions.risk : 0,
      B: top3[1] ? calculateEvaluationScore(top3[1]).dimensions.risk : 0,
      fullMark: 100,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">数据分析</h1>
        <p className="text-sm text-muted-foreground mt-1">
          4维评分分布、综合排行与能力雷达对比
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              综合评分排行
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scores.slice(0, 6).map((s) => (
              <ScoreCard key={s.targetId} score={s} compact />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">维度均值</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={dimBarData} color="#3b82f6" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {top3[0]?.name} vs {top3[1]?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleRadarChart data={radarData} />
        </CardContent>
      </Card>

      <Card className="bg-muted/50 border-dashed">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          预留功能：深度下钻 / 时段对比 / 预测分析 / 模型权重配置
        </CardContent>
      </Card>
    </div>
  );
}
