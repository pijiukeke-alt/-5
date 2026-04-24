"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DemoSwitcherProps {
  options: { id: string; label: string; badge?: string }[];
  activeId: string | null;
  onChange: (id: string | null) => void;
  label?: string;
}

/**
 * 示例对象快捷切换器
 * 用于舆情页、评估页等快速切换监控对象
 */
export function DemoSwitcher({
  options,
  activeId,
  onChange,
  label = "监控对象",
}: DemoSwitcherProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <Badge
        variant={activeId === null ? "default" : "outline"}
        className="cursor-pointer text-xs font-normal h-7 px-2.5"
        onClick={() => onChange(null)}
      >
        全部
      </Badge>
      {options.map((opt) => (
        <Badge
          key={opt.id}
          variant={activeId === opt.id ? "default" : "outline"}
          className={cn(
            "cursor-pointer text-xs font-normal h-7 px-2.5 transition-colors",
            activeId === opt.id && "shadow-sm"
          )}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
          {opt.badge && (
            <span className="ml-1 opacity-70">{opt.badge}</span>
          )}
        </Badge>
      ))}
    </div>
  );
}
