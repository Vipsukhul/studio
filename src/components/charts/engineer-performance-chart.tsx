'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { EngineerPerformance } from '@/lib/types';
import { ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';

export function EngineerPerformanceChart({ data }: { data: EngineerPerformance[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
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
        <Bar dataKey="outstandingCollected" fill="var(--color-collected)" name="Outstanding Collected" radius={[4, 4, 0, 0]} />
        <Bar dataKey="newOutstandingAssigned" fill="var(--color-new)" name="New Outstanding Assigned" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
