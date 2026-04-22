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

export function FilterBar({ options, value, onChange, title }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground shrink-0">{title}</span>
      {options.map((opt) => (
        <Button
          key={opt.label}
          variant={value === opt.value ? "default" : "outline"}
          size="sm"
          className={cn("h-7 text-xs px-2", value === opt.value && "bg-primary text-primary-foreground")}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
