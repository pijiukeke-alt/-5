"use client";

import { useState } from "react";
import { TargetCard } from "@/components/cards/target-card";
import { SearchBar } from "@/components/filters/search-bar";
import { FilterBar } from "@/components/filters/filter-bar";
import { SortBar } from "@/components/filters/sort-bar";
import { TargetDetailDialog } from "@/components/detail/target-detail-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader, EmptyState } from "@/components/shared";
import { PageSkeleton } from "@/components/loading/page-skeleton";
import { useAppStore } from "@/store/app-store";
import { MonitoringTarget } from "@/types";
import { SlidersHorizontal } from "lucide-react";

const categoryOptions = [
  { value: null, label: "全部" },
  { value: "ip", label: "IP" },
  { value: "celebrity", label: "艺人" },
  { value: "cooperation", label: "合作" },
];

const industryOptions = [
  { value: null, label: "全部" },
  { value: "beauty", label: "美妆" },
  { value: "food", label: "食品饮料" },
  { value: "3c", label: "3C数码" },
  { value: "toy", label: "潮玩" },
  { value: "fashion", label: "服饰" },
  { value: "travel", label: "文旅" },
];

const sortOptions = [
  { value: "total", label: "综合评分" },
  { value: "heat", label: "热度" },
  { value: "risk", label: "风险度" },
  { value: "name", label: "名称" },
];

export default function IPManagementPage() {
  const initialized = useAppStore((s) => s.initialized);
  const loading = useAppStore((s) => s.loading);
  const error = useAppStore((s) => s.error);
  const filters = useAppStore((s) => s.filters);
  const setCategoryFilter = useAppStore((s) => s.setCategoryFilter);
  const setIndustryFilter = useAppStore((s) => s.setIndustryFilter);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setSortBy = useAppStore((s) => s.setSortBy);
  const toggleSortOrder = useAppStore((s) => s.toggleSortOrder);
  const resetFilters = useAppStore((s) => s.resetFilters);
  const getFilteredTargets = useAppStore((s) => s.getFilteredTargets);

  const [detailTarget, setDetailTarget] = useState<MonitoringTarget | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  if (!initialized || loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        icon="alert"
        title="数据加载失败"
        description={error}
        action={
          <Button variant="outline" onClick={() => window.location.reload()}>
            刷新页面
          </Button>
        }
      />
    );
  }

  const filtered = getFilteredTargets();

  return (
    <div className="space-y-4 animate-fade-in">
      <SectionHeader
        title="IP 库管理"
        description={`监控对象总览：IP、艺人、合作案例的统一管理与评估（共 ${filtered.length} 个）`}
        helpText="支持按分类、行业筛选，按综合评分、热度、风险度排序。点击卡片查看详情。"
      />

      {/* 筛选栏 */}
      <div className="space-y-3">
        <SearchBar value={filters.searchQuery} onChange={setSearchQuery} />
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-y-2 gap-x-1">
            <FilterBar
              title="分类"
              options={categoryOptions}
              value={filters.categoryFilter}
              onChange={setCategoryFilter}
            />
            <FilterBar
              title="行业"
              options={industryOptions}
              value={filters.industryFilter}
              onChange={setIndustryFilter}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <SortBar
              options={sortOptions}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSortByChange={(v) => setSortBy(v as typeof filters.sortBy)}
              onToggleOrder={toggleSortOrder}
            />
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs h-8">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
              重置
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {filtered.map((target) => (
          <TargetCard
            key={target.id}
            target={target}
            onClick={() => {
              setDetailTarget(target);
              setDetailOpen(true);
            }}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="bg-muted/40 border-dashed">
          <CardContent>
            <EmptyState
              icon="search"
              title="未找到匹配的监控对象"
              description="请尝试调整筛选条件或搜索关键词"
              action={
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  重置筛选
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}

      <TargetDetailDialog
        target={detailTarget}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
