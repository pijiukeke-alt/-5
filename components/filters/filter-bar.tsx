"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string | null;
  label: string;
}

interface FilterBarProps {
  options: FilterOption[];
  value: string | null;
  onChange: (v: string | null) => void;
  title: string;
}

/**
 * 筛选栏组件
 * 支持分类、行业、等级等多种筛选场景
 */
export function FilterBar({ options, value, onChange, title }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground shrink-0 font-medium">{title}</span>
      {options.map((opt) => (
        <Button
          key={opt.label}
          variant={value === opt.value ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-7 text-xs px-2.5 font-normal transition-all",
            value === opt.value && "shadow-sm"
          )}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
