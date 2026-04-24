"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BarChartProps {
  data: { name: string; value: number; color?: string }[];
  color?: string;
  height?: number;
  mobileHeight?: number;
}

/**
 * 柱状图
 * 支持自定义每柱颜色，移动端自适应
 */
export function SimpleBarChart({
  data,
  color = "#8b5cf6",
  height = 240,
  mobileHeight = 180,
}: BarChartProps) {
  const hasCustomColors = data.some((d) => d.color);

  return (
    <ResponsiveContainer width="100%" height={height} className="hidden sm:block">
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 260)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "oklch(0.55 0.02 260)" }}
          stroke="oklch(0.85 0.01 260)"
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
          formatter={(value) => [value, "得分"]}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
