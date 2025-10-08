'use client';

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from 'recharts';
import { ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import type { RegionDistribution } from '@/lib/types';

export function RegionPieChart({ data }: { data: RegionDistribution[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={110}
          innerRadius={70}
          dataKey="amount"
          nameKey="region"
          paddingAngle={5}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return (
              <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
                {`${data[index].region} (${(percent * 100).toFixed(0)}%)`}
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`var(--color-${entry.region})`} />
          ))}
        </Pie>
        <Legend content={<ChartLegendContent />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
