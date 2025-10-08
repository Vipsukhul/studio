'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { OutstandingByAge } from '@/lib/types';
import { ChartTooltipContent } from '@/components/ui/chart';

export function AgeBarChart({ data }: { data: OutstandingByAge[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="region"
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
          tickFormatter={(value) => `₹${Number(value) / 1000}k`}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend wrapperStyle={{fontSize: "0.8rem"}} />
        <Bar dataKey="0-30" stackId="a" fill="var(--color-chart-1)" name="0-30 Days" radius={[4, 4, 0, 0]} />
        <Bar dataKey="31-90" stackId="a" fill="var(--color-chart-2)" name="31-90 Days" />
        <Bar dataKey="91-180" stackId="a" fill="var(--color-chart-3)" name="91-180 Days" />
        <Bar dataKey="181-365" stackId="a" fill="var(--color-chart-4)" name="181-365 Days" />
        <Bar dataKey=">365" stackId="a" fill="var(--color-chart-5)" name=">1 Year" radius={[4, 4, 0, 0]}/>
      </BarChart>
    </ResponsiveContainer>
  );
}
