import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpinionCard } from "@/components/cards/opinion-card";
import { SimplePieChart } from "@/components/charts/pie-chart";
import { mockOpinionEvents } from "@/data/mock/opinion-data";
import { SENTIMENT_COLORS } from "@/config";

export default function PublicOpinionPage() {
  const positive = mockOpinionEvents.filter((e) => e.sentiment === "positive").length;
  const neutral = mockOpinionEvents.filter((e) => e.sentiment === "neutral").length;
  const negative = mockOpinionEvents.filter((e) => e.sentiment === "negative").length;

  const sentimentData = [
    { name: "正面", value: positive, color: SENTIMENT_COLORS.positive },
    { name: "中性", value: neutral, color: SENTIMENT_COLORS.neutral },
    { name: "负面", value: negative, color: SENTIMENT_COLORS.negative },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">舆情监控</h1>
        <p className="text-sm text-muted-foreground mt-1">
          实时追踪 IP 相关舆情动态与风险预警
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">最新舆情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockOpinionEvents.map((event) => (
              <OpinionCard key={event.id} event={event} />
            ))}
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">情感分布</CardTitle>
            </CardHeader>
            <CardContent>
              <SimplePieChart data={sentimentData} />
            </CardContent>
          </Card>
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              预留：预警规则 / 实时推送 / 传播路径分析
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
