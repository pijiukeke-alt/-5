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
}

export function SimpleRadarChart({ subjects, series, height = 300 }: RadarChartProps) {
  const chartData = subjects.map((subject, i) => {
    const row: Record<string, string | number> = { subject };
    series.forEach((s) => {
      row[s.name] = s.data[i] ?? 0;
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
        {series.map((s) => (
          <Radar
            key={s.name}
            name={s.name}
            dataKey={s.name}
            stroke={s.color}
            fill={s.color}
            fillOpacity={s.fillOpacity ?? 0.25}
          />
        ))}
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
