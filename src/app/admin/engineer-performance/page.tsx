'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getEngineerPerformanceData } from '@/lib/api';
import type { EngineerPerformance } from '@/lib/types';
import { EngineerPerformanceChart } from '@/components/charts/engineer-performance-chart';
import { ChartContainer } from '@/components/ui/chart';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function EngineerPerformancePage() {
  const [performanceData, setPerformanceData] = React.useState<EngineerPerformance[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getEngineerPerformanceData();
      setPerformanceData(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const chartConfig = {
    collected: { label: 'Collected', color: 'hsl(var(--chart-1))' },
    new: { label: 'New Assigned', color: 'hsl(var(--chart-2))' },
  } as const;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-headline font-bold">Engineer Performance</h1>
      <p className="text-muted-foreground">Track and compare outstanding balance metrics for each engineer.</p>

       <Card className="mt-6">
          <CardHeader>
            <CardTitle>Performance Comparison Chart</CardTitle>
            <CardDescription>
              A visual overview of outstanding amounts collected vs. newly assigned amounts for each engineer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                <EngineerPerformanceChart data={performanceData} />
            </ChartContainer>
          </CardContent>
        </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Detailed Engineer Metrics</CardTitle>
          <CardDescription>
            A detailed breakdown of performance metrics for each engineer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Engineer</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Outstanding Collected</TableHead>
                <TableHead className="text-right">New Assigned</TableHead>
                <TableHead className="text-right">Net Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData.length > 0 ? (
                performanceData.map((engineer) => (
                  <TableRow key={engineer.name}>
                    <TableCell className="font-medium">{engineer.name}</TableCell>
                    <TableCell>{engineer.region}</TableCell>
                    <TableCell className="text-right text-green-600">
                      ₹{engineer.outstandingCollected.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      ₹{engineer.newOutstandingAssigned.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className={`flex items-center justify-end font-medium ${engineer.netChange >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                            {engineer.netChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                            ₹{Math.abs(engineer.netChange).toLocaleString('en-IN')}
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No performance data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
