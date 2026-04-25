/**
 * Mock 数据连接器
 * 包装现有 mockTargets，提供与 REST 连接器一致的异步接口
 */

import { MonitoringTarget } from "@/types";
import { mockTargets } from "@/data/mock/targets";
import { DataConnector } from "../future-reserved/data-connectors";

export interface MockConnectorOptions {
  /** 模拟订阅轮询间隔(ms)，默认 30s */
  interval?: number;
}

export function createMockConnector(
  options: MockConnectorOptions = {}
): DataConnector<MonitoringTarget[]> {
  const { interval = 30000 } = options;

  return {
    config: {
      id: "mock",
      type: "rest",
      endpoint: "mock://local",
      authType: "none",
      timeout: 5000,
    },
    fetch: async () => {
      // 模拟网络延迟 200-600ms
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 400));
      return [...mockTargets];
    },
    subscribe: (query, onData) => {
      // 模拟实时更新：每 interval 推送一次带微扰动的数据
      const timer = setInterval(() => {
        const jittered = mockTargets.map((t) => ({
          ...t,
          social: {
            ...t.social,
            heatScore: Math.min(
              100,
              Math.max(0, Math.round(t.social.heatScore + (Math.random() - 0.5) * 2))
            ),
          },
          updatedAt: new Date().toISOString(),
        }));
        onData(jittered);
      }, interval);
      return () => clearInterval(timer);
    },
  };
}
