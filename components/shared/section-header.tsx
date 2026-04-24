"use client";

import { ReactNode } from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SectionHeaderProps {
  title: string;
  description?: string;
  helpText?: string;
  action?: ReactNode;
  children?: ReactNode;
}

/**
 * 统一的页面/区块标题组件
 * 支持标题、描述、帮助提示和右上角操作区
 */
export function SectionHeader({
  title,
  description,
  helpText,
  action,
  children,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {helpText && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="max-w-xs text-xs leading-relaxed"
                >
                  {helpText}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {description && (
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
