"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, APP_NAME } from "@/config";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Eye,
  Handshake,
  GitCompare,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  BarChart3: <BarChart3 className="h-5 w-5" />,
  Eye: <Eye className="h-5 w-5" />,
  Handshake: <Handshake className="h-5 w-5" />,
  GitCompare: <GitCompare className="h-5 w-5" />,
};

/**
 * 响应式导航组件
 * PC: 左侧固定侧边栏
 * Mobile: 顶部标题栏 + 底部 Tab 栏
 */
export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navContent = (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.path || pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {iconMap[item.icon]}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* PC Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-card/50 backdrop-blur-sm px-4 py-6">
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
            IP
          </div>
          <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
        </div>
        {navContent}
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur-sm px-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            IP
          </div>
          <span className="font-bold text-sm">{APP_NAME}</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-4 pb-2 border-b">
              <span className="text-lg font-bold">{APP_NAME}</span>
            </div>
            <div className="p-3">{navContent}</div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Mobile Bottom Tab */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t bg-background/95 backdrop-blur-sm">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1.5 px-2 min-w-[48px]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {iconMap[item.icon]}
              <span className="text-[10px] font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
