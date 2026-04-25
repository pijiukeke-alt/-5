/**
 * REST API 数据连接器
 * 标准 fetch 封装，支持超时、错误处理、单次重试
 */

import { MonitoringTarget } from "@/types";
import { API_CONFIG } from "@/config";
import { DataConnector } from "../future-reserved/data-connectors";

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetchWithTimeout(url, options || {}, API_CONFIG.timeout);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function createRestConnector(): DataConnector<MonitoringTarget[]> {
  const base = API_CONFIG.baseUrl.replace(/\/$/, "");

  return {
    config: {
      id: "rest",
      type: "rest",
      endpoint: base,
      authType: "none",
      timeout: API_CONFIG.timeout,
    },
    fetch: async (query = {}) => {
      const qs = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null) qs.append(k, String(v));
      });
      const url = `${base}/targets${qs.toString() ? `?${qs.toString()}` : ""}`;

      try {
        return await fetchJson<MonitoringTarget[]>(url);
      } catch (err) {
        // 一次重试
        await new Promise((r) => setTimeout(r, 800));
        return fetchJson<MonitoringTarget[]>(url);
      }
    },
    subscribe: (query, onData) => {
      // 无 SSE/WebSocket 时回退到长轮询
      const pollInterval = 30000;
      let active = true;

      const poll = async () => {
        if (!active) return;
        try {
          const qs = new URLSearchParams();
          Object.entries(query).forEach(([k, v]) => {
            if (v !== undefined && v !== null) qs.append(k, String(v));
          });
          const url = `${base}/targets${qs.toString() ? `?${qs.toString()}` : ""}`;
          const data = await fetchJson<MonitoringTarget[]>(url);
          if (active) onData(data);
        } catch {
          // 静默忽略轮询错误，由页面层统一处理
        }
        if (active) setTimeout(poll, pollInterval);
      };

      poll();
      return () => {
        active = false;
      };
    },
  };
}
