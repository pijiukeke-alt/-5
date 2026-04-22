import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          IP 联名 / 授权 / 代言数据智能分析与舆情监控概览
        </p>
      </div>
      <DashboardOverview />
    </div>
  );
}
