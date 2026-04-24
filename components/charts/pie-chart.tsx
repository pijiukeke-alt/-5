"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PieChartProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  mobileHeight?: number;
}

const DEFAULT_COLORS = ["#22c55e", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4"];

/**
 * 环形饼图
 * 支持自定义每块颜色
 */
export function SimplePieChart({
  data,
  height = 240,
  mobileHeight = 180,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius="45%"
          outerRadius="72%"
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: "10px",
            border: "1px solid oklch(0.9 0.01 260)",
            boxShadow: "0 8px 16px -4px oklch(0 0 0 / 0.08)",
            fontSize: 12,
          }}
          formatter={(value, name) => [`${value}`, name]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
