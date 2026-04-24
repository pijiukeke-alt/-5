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

interface RadarSeries {
  name: string;
  data: number[];
  color: string;
  fillOpacity?: number;
}

interface RadarChartProps {
  subjects: string[];
  series: RadarSeries[];
  height?: number;
  mobileHeight?: number;
}

/**
 * 雷达图对比
 * 支持多系列叠加对比
 */
export function SimpleRadarChart({
  subjects,
  series,
  height = 300,
  mobileHeight = 220,
}: RadarChartProps) {
  const chartData = subjects.map((subject, i) => {
    const row: Record<string, string | number> = { subject };
    series.forEach((s) => {
      row[s.name] = s.data[i] ?? 0;
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
        <PolarGrid stroke="oklch(0.88 0.01 260)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 12, fill: "oklch(0.45 0.02 260)", fontWeight: 500 }}
        />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} />
        {series.map((s) => (
          <Radar
            key={s.name}
            name={s.name}
            dataKey={s.name}
            stroke={s.color}
            fill={s.color}
            fillOpacity={s.fillOpacity ?? 0.2}
            strokeWidth={2}
          />
        ))}
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Tooltip
          contentStyle={{
            borderRadius: "10px",
            border: "1px solid oklch(0.9 0.01 260)",
            boxShadow: "0 8px 16px -4px oklch(0 0 0 / 0.08)",
            fontSize: 12,
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
