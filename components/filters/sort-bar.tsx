"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface SortOption {
  value: string;
  label: string;
}

interface SortBarProps {
  options: SortOption[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortByChange: (v: string) => void;
  onToggleOrder: () => void;
}

/**
 * 排序栏组件
 * 支持多字段排序与升降序切换
 */
export function SortBar({
  options,
  sortBy,
  sortOrder,
  onSortByChange,
  onToggleOrder,
}: SortBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground shrink-0 font-medium">排序</span>
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={sortBy === opt.value ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs px-2.5 font-normal transition-all"
          onClick={() => onSortByChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={onToggleOrder}
        title={sortOrder === "desc" ? "降序" : "升序"}
      >
        {sortOrder === "desc" ? (
          <ArrowDown className="h-3.5 w-3.5" />
        ) : (
          <ArrowUp className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}
