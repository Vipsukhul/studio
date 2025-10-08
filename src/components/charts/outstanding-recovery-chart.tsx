'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { OutstandingRecoveryTrend } from '@/lib/types';
import { ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';

export function OutstandingRecoveryChart({ data }: { data: OutstandingRecoveryTrend[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
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
          tickFormatter={(value) => `₹${Number(value) / 100000}L`}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Legend content={<ChartLegendContent />} />
        <Bar dataKey="new" fill="var(--color-new)" name="New Outstanding" radius={[4, 4, 0, 0]} />
        <Bar dataKey="recovered" fill="var(--color-recovered)" name="Recovered" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
