"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RadarChartProps {
  data: { subject: string; A: number; B?: number; fullMark: number }[];
  height?: number;
}

export function SimpleRadarChart({ data, height = 280 }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
        <Radar
          name="当前 IP"
          dataKey="A"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
        />
        {data[0]?.B !== undefined && (
          <Radar
            name="对比 IP"
            dataKey="B"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
          />
        )}
        <Legend />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
