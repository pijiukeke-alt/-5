import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCooperationCases } from "@/data/mock/cooperation-data";
import { formatNumber } from "@/lib/transform";

export default function CooperationPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">合作评估</h1>
        <p className="text-sm text-muted-foreground mt-1">
          历史合作案例回顾与效果评估
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockCooperationCases.map((coop) => (
          <Card key={coop.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{coop.brandName} × {coop.ipName}</h3>
                <Badge variant="outline" className="text-[10px]">
                  {coop.type}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>效果评分: <span className="font-medium text-foreground">{coop.effectScore || "-"}</span></div>
                <div>销售提升: <span className="font-medium text-foreground">{coop.salesLift ? `${coop.salesLift}%` : "-"}</span></div>
                <div>媒体曝光: <span className="font-medium text-foreground">{coop.mediaExposure ? formatNumber(coop.mediaExposure) : "-"}</span></div>
                <div>情感得分: <span className="font-medium text-foreground">{coop.sentimentScore || "-"}</span></div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {coop.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {coop.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          预留功能：合作效果预测 / ROI 模拟 / 合同管理 / 结算跟踪
        </CardContent>
      </Card>
    </div>
  );
}
