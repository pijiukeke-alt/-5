import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPCard } from "@/components/cards/ip-card";
import { mockIPList } from "@/data/mock/ip-data";

export default function IPManagementPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">IP 库管理</h1>
        <p className="text-sm text-muted-foreground mt-1">
          维护监控 IP 列表，查看画像与历史合作
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockIPList.map((ip) => (
          <IPCard key={ip.id} ip={ip} />
        ))}
      </div>
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          预留功能：IP 新增 / 编辑 / 删除 / 批量导入 / 智能推荐
        </CardContent>
      </Card>
    </div>
  );
}
