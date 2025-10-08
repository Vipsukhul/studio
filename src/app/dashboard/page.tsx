'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDashboardData } from '@/lib/api';
import type { Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { AgeBarChart } from '@/components/charts/age-bar-chart';
import { RegionPieChart } from '@/components/charts/region-pie-chart';
import { MonthlyLineChart } from '@/components/charts/monthly-line-chart';
import { monthOptions } from '@/lib/data';

function KpiCard({ kpi }: { kpi: Kpi }) {
  const isIncrease = kpi.changeType === 'increase';
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{kpi.value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {kpi.change && (
            <Badge
              variant={isIncrease ? 'default' : 'destructive'}
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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState('Apr-25');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const dashboardData = await getDashboardData(month);
      setData(dashboardData);
      setLoading(false);
    }
    fetchData();
  }, [month]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  const { kpis, outstandingByAge, regionDistribution, monthlyTrends } = data as {
    kpis: Kpi[];
    outstandingByAge: OutstandingByAge[];
    regionDistribution: RegionDistribution[];
    monthlyTrends: MonthlyTrend[];
  };

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
            <AgeBarChart data={outstandingByAge} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Region-wise Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RegionPieChart data={regionDistribution} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Month-wise Outstanding Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyLineChart data={monthlyTrends} />
        </CardContent>
      </Card>
      
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
                <TableHead className="text-right">&gt;1 Year</TableHead>
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
