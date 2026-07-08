import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export function SentimentPie({ data }: { data: { positive: number; neutral: number; negative: number } }) {
  const chartData = [
    { name: "Positive", value: data.positive, color: "rgb(46, 204, 113)" },
    { name: "Neutral",  value: data.neutral,  color: "rgb(245, 176, 65)" },
    { name: "Negative", value: data.negative, color: "rgb(231, 76, 60)" },
  ];
  const positive = chartData[0];

  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%" cy="50%"
              innerRadius={"75%"} outerRadius={"90%"}
              paddingAngle={4}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry, idx) => <Cell key={idx} fill={entry.color} stroke="none" />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, padding: "6px 10px" }}
              itemStyle={{ color: "var(--foreground)" }}
              formatter={(val: number, name: string) => [`${val}%`, name]}
              cursor={false}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-foreground leading-none">{positive.value}%</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{positive.name}</span>
        </div>
      </div>
    </div>
  );
}
