'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import type { MonthlyTrend } from '@/lib/types';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export function MonthlyLineChart({ data }: { data: MonthlyTrend[] }) {
  const regions = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'month') : [];

  return (
    <ResponsiveContainer width="100%" height={350}>
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
        <Tooltip content={<ChartTooltipContent />} />
        <Legend wrapperStyle={{fontSize: "0.8rem"}} />
        {regions.map((region, index) => (
            <Line 
                key={region}
                type="monotone" 
                dataKey={region} 
                stroke={COLORS[index % COLORS.length]} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
            />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
