'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getEngineerPerformanceData } from '@/lib/api';
import type { EngineerPerformance } from '@/lib/types';
import { EngineerPerformanceChart } from '@/components/charts/engineer-performance-chart';
import { ChartContainer } from '@/components/ui/chart';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { departmentOptions } from '@/lib/data';


const ITEMS_PER_PAGE = 5;

export default function EngineerPerformancePage() {
  const [performanceData, setPerformanceData] = React.useState<EngineerPerformance[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [department, setDepartment] = React.useState('Batching Plant');

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getEngineerPerformanceData(department);
      setPerformanceData(data);
      setLoading(false);
    }
    loadData();
  }, [department]);

  const chartConfig = {
    collected: { label: 'Collected', color: 'hsl(var(--chart-1))' },
    new: { label: 'New Assigned', color: 'hsl(var(--chart-2))' },
  } as const;

  const totalPages = Math.ceil(performanceData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = performanceData.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Engineer Performance</h1>
          <p className="text-muted-foreground">Track and compare outstanding balance metrics for each engineer.</p>
        </div>
        <div className="w-[220px]">
            <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                    {departmentOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

       <Card className="mt-6">
          <CardHeader>
            <CardTitle>Performance Comparison Chart</CardTitle>
            <CardDescription>
              A visual overview of outstanding amounts collected vs. newly assigned amounts for each engineer in the <span className="font-semibold">{department}</span> department.
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
              {currentData.length > 0 ? (
                currentData.map((engineer) => (
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
                    No performance data found for this department.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
           <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
