import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleRadarChart } from "@/components/charts/radar-chart";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { mockIPList } from "@/data/mock/ip-data";
import { calculateCompositeScore } from "@/lib/scoring";

export default function DataAnalysisPage() {
  const radarData = [
    { subject: "热度", A: 85, B: 70, fullMark: 100 },
    { subject: "情感", A: 80, B: 65, fullMark: 100 },
    { subject: "互动", A: 75, B: 85, fullMark: 100 },
    { subject: "风险", A: 90, B: 60, fullMark: 100 },
    { subject: "转化", A: 70, B: 75, fullMark: 100 },
  ];

  const scoreData = mockIPList.map((ip) => ({
    name: ip.name,
    value: calculateCompositeScore(ip),
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">数据分析</h1>
        <p className="text-sm text-muted-foreground mt-1">
          多维度评分分析与 IP 对比
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">综合评分对比</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={scoreData} color="#8b5cf6" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">能力雷达图</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleRadarChart data={radarData} />
          </CardContent>
        </Card>
      </div>
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          预留功能：深度下钻 / 时段对比 / 预测分析 / 模型权重配置
        </CardContent>
      </Card>
    </div>
  );
}
