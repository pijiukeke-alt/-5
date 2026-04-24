"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: { name: string; value: number }[];
  color?: string;
  height?: number;
  mobileHeight?: number;
  showDots?: boolean;
}

function formatXAxisLabel(value: string, index: number, dataLength: number) {
  // 数据点多时智能抽稀标签
  if (dataLength > 14) {
    const step = Math.ceil(dataLength / 7);
    return index % step === 0 ? value.slice(5) : "";
  }
  return value.slice(5);
}

/**
 * 趋势折线图
 * 支持移动端自适应高度和标签抽稀
 */
export function TrendLineChart({
  data,
  color = "#2563eb",
  height = 240,
  mobileHeight = 180,
  showDots = true,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height} className="hidden sm:block">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 260)" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "oklch(0.55 0.02 260)" }}
          stroke="oklch(0.85 0.01 260)"
          tickFormatter={(v, i) => formatXAxisLabel(v, i, data.length)}
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "oklch(0.55 0.02 260)" }}
          stroke="oklch(0.85 0.01 260)"
          width={45}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "10px",
            border: "1px solid oklch(0.9 0.01 260)",
            boxShadow: "0 8px 16px -4px oklch(0 0 0 / 0.08)",
            fontSize: 12,
          }}
          formatter={(value) => [value, "数值"]}
          labelFormatter={(label) => label as string}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          dot={showDots ? { r: 3, fill: color, strokeWidth: 2, stroke: "#fff" } : false}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
