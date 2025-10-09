'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, CircleX } from 'lucide-react';
import { AgeBarChart } from '@/components/charts/age-bar-chart';
import { RegionPieChart } from '@/components/charts/region-pie-chart';
import { MonthlyLineChart } from '@/components/charts/monthly-line-chart';
import { OutstandingRecoveryChart } from '@/components/charts/outstanding-recovery-chart';
import { monthOptions } from '@/lib/data';
import { ChartContainer } from '@/components/ui/chart';
import type { Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution, OutstandingRecoveryTrend } from '@/lib/types';
import { getDashboardData, getOutstandingRecoveryTrend } from '@/lib/api';
import { ResponsiveContainer } from 'recharts';

function KpiCard({ kpi }: { kpi: Kpi }) {
  const isErrorKpi = kpi.label === 'System Errors';
  const isIncrease = kpi.changeType === 'increase';
  const badgeVariant = isErrorKpi ? (isIncrease ? 'destructive' : 'default') : (isIncrease ? 'destructive' : 'default');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
        {isErrorKpi && <CircleX className="h-4 w-4 text-destructive" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{kpi.value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {kpi.change && (
            <Badge
              variant={badgeVariant}
              className="flex items-center gap-1 rounded-full"
            >
              {isIncrease ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {kpi.change}
            </Badge>
          )}
          <span className="ml-2">{kpi.description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<{
    kpis: Kpi[];
    outstandingByAge: OutstandingByAge[];
    regionDistribution: RegionDistribution[];
    monthlyTrends: MonthlyTrend[];
  } | null>(null);
  const [recoveryData, setRecoveryData] = useState<OutstandingRecoveryTrend[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState('Apr-25');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [mainData, recoveryTrendData] = await Promise.all([
        getDashboardData(month),
        getOutstandingRecoveryTrend()
      ]);
      setDashboardData(mainData);
      setRecoveryData(recoveryTrendData);
      setLoading(false);
    }
    fetchData();
  }, [month]);

  if (loading || !dashboardData || !recoveryData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  const { kpis, outstandingByAge, regionDistribution, monthlyTrends } = dashboardData;

  const ageChartConfig = {
    '0-30': { label: '0-30 Days', color: 'hsl(var(--chart-1))' },
    '31-90': { label: '31-90 Days', color: 'hsl(var(--chart-2))' },
    '91-180': { label: '91-180 Days', color: 'hsl(var(--chart-3))' },
    '181-365': { label: '181-365 Days', color: 'hsl(var(--chart-4))' },
    '>365': { label: '>1 Year', color: 'hsl(var(--chart-5))' },
  } as const;

  const regionChartConfig = {
    amount: { label: 'Amount' },
    North: { label: 'North', color: 'hsl(var(--chart-1))' },
    South: { label: 'South', color: 'hsl(var(--chart-2))' },
    East: { label: 'East', color: 'hsl(var(--chart-3))' },
    West: { label: 'West', color: 'hsl(var(--chart-4))' },
  } as const;
  
  const monthlyChartConfig = {
    North: { label: 'North', color: 'hsl(var(--chart-1))' },
    West: { label: 'West', color: 'hsl(var(--chart-2))' },
    South: { label: 'South', color: 'hsl(var(--chart-3))' },
    East: { label: 'East', color: 'hsl(var(--chart-4))' },
  } as const;

  const recoveryChartConfig = {
    new: { label: 'New', color: 'hsl(var(--chart-2))' },
    recovered: { label: 'Recovered', color: 'hsl(var(--chart-1))' },
  } as const;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <div className="w-[180px]">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Region vs. Ageing</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={ageChartConfig} className="min-h-[350px] w-full">
              <AgeBarChart data={outstandingByAge} />
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Region-wise Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={regionChartConfig} className="min-h-[350px] w-full">
                <RegionPieChart data={regionDistribution} />
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Month-wise Outstanding Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={monthlyChartConfig} className="min-h-[350px] w-full">
                    <MonthlyLineChart data={monthlyTrends} />
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>New vs. Recovered Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={recoveryChartConfig} className="min-h-[350px] w-full">
                    <OutstandingRecoveryChart data={recoveryData} />
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ageing Summary by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">0-30 Days</TableHead>
                <TableHead className="text-right">30-90 Days</TableHead>
                <TableHead className="text-right">90-180 Days</TableHead>
                <TableHead className="text-right">180-365 Days</TableHead>
                <TableHead className="text-right">>1 Year</TableHead>
                <TableHead className="text-right font-bold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outstandingByAge.map((row) => (
                <TableRow key={row.region}>
                  <TableCell className="font-medium">{row.region}</TableCell>
                  <TableCell className="text-right">{row['0-30'].toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">{row['31-90'].toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">{row['91-180'].toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">{row['181-365'].toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">{row['>365'].toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right font-bold">{row.total.toLocaleString('en-IN')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
