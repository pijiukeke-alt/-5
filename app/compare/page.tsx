import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleRadarChart } from "@/components/charts/radar-chart";
import { mockIPList } from "@/data/mock/ip-data";
import { calculateCompositeScore } from "@/lib/scoring";

export default function ComparePage() {
  const compareData = [
    { subject: "热度", A: mockIPList[0].heatScore, B: mockIPList[1].heatScore, fullMark: 100 },
    { subject: "粉丝", A: Math.min(mockIPList[0].followerCount / 300000, 100), B: Math.min(mockIPList[1].followerCount / 300000, 100), fullMark: 100 },
    { subject: "合作", A: mockIPList[0].cooperationHistory.length * 20, B: mockIPList[1].cooperationHistory.length * 20, fullMark: 100 },
    { subject: "评分", A: calculateCompositeScore(mockIPList[0]), B: calculateCompositeScore(mockIPList[1]), fullMark: 100 },
    { subject: "风险", A: mockIPList[0].riskLevel === "low" ? 90 : 50, B: mockIPList[1].riskLevel === "low" ? 90 : 50, fullMark: 100 },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">对比分析</h1>
        <p className="text-sm text-muted-foreground mt-1">
          IP 与 IP、品牌与品牌之间的多维对比
        </p>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {mockIPList[0].name} vs {mockIPList[1].name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleRadarChart data={compareData} />
        </CardContent>
      </Card>
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          预留功能：多选对比 / 历史时段对比 / 对比报告导出 / 差异分析
        </CardContent>
      </Card>
    </div>
  );
}
