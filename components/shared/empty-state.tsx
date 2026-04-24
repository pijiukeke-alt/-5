"use client";

import { ReactNode } from "react";
import { Inbox, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: "inbox" | "search" | ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * 通用空状态组件
 */
export function EmptyState({
  icon = "inbox",
  title = "暂无数据",
  description = "当前条件下没有可展示的内容",
  action,
  className,
}: EmptyStateProps) {
  const IconComponent =
    icon === "inbox" ? Inbox : icon === "search" ? SearchX : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-10 sm:py-14 text-center",
        className
      )}
    >
      {IconComponent ? (
        <div className="rounded-full bg-muted p-3 mb-3">
          <IconComponent className="h-6 w-6 text-muted-foreground" />
        </div>
      ) : (
        <div className="mb-3">{icon}</div>
      )}
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
