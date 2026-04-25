"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { createConnector } from "@/lib/connectors/factory";

/**
 * 全局数据提供者
 * 挂载时触发首次数据加载，并建立实时数据订阅
 */
export function DataProvider({ children }: { children: React.ReactNode }) {
  const loadData = useAppStore((s) => s.loadData);
  const refreshData = useAppStore((s) => s.refreshData);
  const setTargets = useAppStore((s) => s.setTargets);

  useEffect(() => {
    // 首次加载
    loadData();

    // 建立订阅（mock 模式下为轮询，REST 模式下为长轮询）
    const connector = createConnector();
    const unsubscribe = connector.subscribe?.({}, (data) => {
      // 订阅推送的数据静默更新
      if (Array.isArray(data) && data.length > 0) {
        setTargets(data);
      } else {
        // 兜底：触发一次刷新
        refreshData();
      }
    });

    // 页面可见性变化时刷新
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshData();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      unsubscribe?.();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [loadData, refreshData, setTargets]);

  return <>{children}</>;
}
