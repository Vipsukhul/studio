'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import type { MonthlyTrend } from '@/lib/types';

export function MonthlyLineChart({ data }: { data: MonthlyTrend[] }) {
  const regions = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'month') : [];

  return (
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis
        dataKey="month"
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <YAxis
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `₹${value / 1000}k`}
      />
      <Tooltip
        cursor={false}
        content={<ChartTooltipContent indicator="dot" />}
      />
      <Legend content={<ChartLegendContent />} />
      {regions.map((region) => (
          <Line 
              key={region}
              type="monotone" 
              dataKey={region} 
              stroke={`var(--color-${region})`}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
          />
      ))}
    </LineChart>
  );
}
