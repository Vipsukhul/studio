'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RegionDistribution } from '@/lib/types';
import { ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';

export function RegionBarChart({ data }: { data: RegionDistribution[] }) {
  return (
    <ResponsiveContainer width="100%" height={data.length * 40}>
      <BarChart 
        data={data}
        layout="vertical"
        margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
        }}
    >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <YAxis
          dataKey="region"
          type="category"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={80}
          tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
        />
        <XAxis
          type="number"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${Number(value) / 1000}k`}
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          content={<ChartTooltipContent />}
        />
        <Legend content={<ChartLegendContent />} />
        <Bar dataKey="amount" layout="vertical" fill="var(--color-amount)" name="Amount" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
