"use client";

import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

/**
 * 整页骨架屏
 * 匹配当前 Dashboard 布局的卡片密度
 */
export function PageSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card">
            <CardSkeleton />
          </div>
        ))}
      </div>

      {/* Main Chart + Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2 rounded-xl border bg-card">
          <ChartSkeleton />
        </div>
        <div className="rounded-xl border bg-card">
          <CardSkeleton />
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-xl border bg-card">
          <ChartSkeleton />
        </div>
        <div className="rounded-xl border bg-card">
          <ChartSkeleton />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2 rounded-xl border bg-card">
          <ChartSkeleton />
        </div>
        <div className="rounded-xl border bg-card">
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
