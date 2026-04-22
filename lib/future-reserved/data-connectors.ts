/**
 * 【预留模块】数据接入层 (Data Connectors)
 * ============================================================
 * 未来用途：
 *   封装所有外部数据源的统一接入接口，包括 REST API、WebSocket、
 *   GraphQL、第三方平台 SDK（微博/小红书/抖音/知乎等）、内部 CRM/ERP。
 *
 * 设计目标：
 *   - 对上层业务屏蔽不同数据源的细节差异
 *   - 支持可插拔的数据源注册机制
 *   - 统一错误处理、重试、限流、缓存策略
 *
 * 预留接口设计（供后续实现参考）：
 *   - registerConnector(sourceId, connectorInstance)
 *   - fetch(sourceId, query, options): Promise<T>
 *   - subscribe(sourceId, query, callback): () => void  (WebSocket 实时流)
 *   - healthCheck(sourceId): Promise<boolean>
 *
 * 与现有系统集成点：
 *   - 被 lib/future-reserved/data-cleaning.ts 调用作为输入源
 *   - 被各页面组件在 useEffect 中调用以替换 mock 数据
 *   - 通过 Zustand store 的 async action 触发数据拉取
 *
 * 当前状态：占位预留，接口设计待真实后端 schema 确定后实现。
 */

export type ConnectorType = "rest" | "websocket" | "graphql" | "sdk";

export interface DataConnectorConfig {
  id: string;
  type: ConnectorType;
  endpoint: string;
  authType: "none" | "apiKey" | "oauth2" | "bearer";
  rateLimit?: number;
  timeout?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataConnector<T = any> {
  config: DataConnectorConfig;
  fetch: (query: Record<string, unknown>) => Promise<T>;
  subscribe?: (
    query: Record<string, unknown>,
    onData: (data: T) => void
  ) => () => void;
}
