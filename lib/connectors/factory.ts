/**
 * 连接器工厂
 * 根据环境配置自动选择数据源
 */

import { DataConnector } from "../future-reserved/data-connectors";
import { API_CONFIG } from "@/config";
import { createMockConnector } from "./mock-connector";
import { createRestConnector } from "./rest-connector";

export function createConnector<T = unknown>(): DataConnector<T> {
  if (API_CONFIG.mockMode) {
    return createMockConnector() as DataConnector<T>;
  }
  return createRestConnector() as DataConnector<T>;
}
