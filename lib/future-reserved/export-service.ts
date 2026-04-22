/**
 * 【预留模块】导出服务 (Export Service)
 * ============================================================
 * 未来用途：
 *   将分析结果、图表、报告导出为多种格式，支持一键下载与定时推送。
 *
 * 导出格式（预留）：
 *   - PDF：带品牌水印的专业报告（支持单页/整本模式）
 *   - Excel：结构化数据表格，含数据透视与图表
 *   - PPT：可编辑的演示文稿，自动适配模板
 *   - CSV/JSON：原始数据导出，供 BI 工具二次分析
 *   - 图片：指定图表导出为 PNG/SVG，支持自定义分辨率
 *
 * 导出内容模板：
 *   - Dashboard 快照：当前看板所有 KPI 与图表
 *   - IP 评估报告：单个 IP 的完整画像与历史表现
 *   - 舆情周报：指定时间窗口内的舆情汇总与分析
 *   - 合作复盘报告：某次合作的完整效果评估
 *
 * 与现有系统集成点：
 *   - 在各页面右上角增加「导出」按钮，调用本服务
 *   - 读取当前 Zustand store 中的筛选条件作为导出范围
 *   - 被 lib/future-reserved/alert-engine.ts 调用以生成定时推送报告
 */

export type ExportFormat = "pdf" | "excel" | "ppt" | "csv" | "json" | "png";

export interface ExportRequest {
  format: ExportFormat;
  scope: "dashboard" | "ip" | "opinion" | "cooperation" | "compare";
  targetIds?: string[];
  dateRange?: { start: string; end: string };
  templateId?: string;
  includeCharts: boolean;
  watermark?: string;
}

export interface ExportResult {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  expiresAt: string;
}
