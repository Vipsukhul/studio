'use client';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, CalendarDays, Users, FileText, IndianRupee, MapPin } from 'lucide-react';
import { AgeBarChart } from '@/components/charts/age-bar-chart';
import { RegionBarChart } from '@/components/charts/region-bar-chart';
import { MonthlyLineChart } from '@/components/charts/monthly-line-chart';
import { OutstandingRecoveryChart } from '@/components/charts/outstanding-recovery-chart';
import { generateMonthOptions, regionOptions, financialYearOptions } from '@/lib/data';
import { ChartContainer } from '@/components/ui/chart';
import type { Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution, OutstandingRecoveryTrend } from '@/lib/types';
import { getDashboardData, getOutstandingRecoveryTrend } from '@/lib/api';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const kpiIcons = {
    'Total Outstanding': IndianRupee,
    'Recovered Amount': IndianRupee,
    'New Outstanding': IndianRupee,
    'Total Invoices': FileText,
    'Disputed Invoices': FileText,
    'Total Customers': Users,
};


function KpiCard({ kpi }: { kpi: Kpi }) {
  const isIncrease = kpi.changeType === 'increase';
  
  let badgeVariant: 'destructive' | 'default' = 'default';
  if (kpi.label === 'Recovered Amount') {
    badgeVariant = isIncrease ? 'default' : 'destructive';
  } else {
    badgeVariant = isIncrease ? 'destructive' : 'default';
  }
  
  // @ts-ignore
  const Icon = kpiIcons[kpi.label] || IndianRupee;

  const numericValue = useMemo(() => {
    if (typeof kpi.value === 'string') {
        return parseFloat(kpi.value.replace(/[^0-9.]/g, '')) || 0;
    }
    return 0;
  }, [kpi.value]);

  const formatter = (value: number) => {
    if (kpi.value.startsWith('₹')) {
        return `₹${Math.floor(value).toLocaleString('en-IN')}`;
    }
    return Math.floor(value).toLocaleString('en-IN');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
            <AnimatedCounter value={numericValue} formatter={formatter} />
        </div>
        { kpi.description &&
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
        }
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
  
  const [financialYear, setFinancialYear] = useState('2024-2025');
  const monthOptions = useMemo(() => generateMonthOptions(financialYear), [financialYear]);
  const [month, setMonth] = useState(monthOptions[0].value);

  const [region, setRegion] = useState('All');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedFinancialYear = localStorage.getItem('financialYear');
    
    if (storedFinancialYear) {
      setFinancialYear(storedFinancialYear);
      const newMonthOptions = generateMonthOptions(storedFinancialYear);
      setMonth(newMonthOptions[0].value);
    } else {
       setMonth(monthOptions[0].value);
    }

     const handleStorageChange = () => {
        const storedFY = localStorage.getItem('financialYear');
        if (storedFY) {
            setFinancialYear(storedFY);
            const newMonthOptions = generateMonthOptions(storedFY);
            setMonth(newMonthOptions[0].value);
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [mainData, recoveryTrendData] = await Promise.all([
        getDashboardData(month, financialYear, region),
        getOutstandingRecoveryTrend(financialYear)
      ]);
      setDashboardData(mainData);
      setRecoveryData(recoveryTrendData);
      setLoading(false);
    }
    if (financialYear) {
        fetchData();
    }
  }, [month, financialYear, region]);

  const handleFinancialYearChange = (newFinancialYear: string) => {
    setFinancialYear(newFinancialYear);
    localStorage.setItem('financialYear', newFinancialYear);
    const newMonthOptions = generateMonthOptions(newFinancialYear);
    setMonth(newMonthOptions[0].value); // Reset month to the first month of the new FY
    window.dispatchEvent(new Event('storage'));
  };

  if (loading || !dashboardData || !recoveryData || !isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  const { kpis, outstandingByAge, regionDistribution, monthlyTrends } = dashboardData;
    
  const grandTotal = outstandingByAge.reduce((acc, curr) => {
    acc['0-30'] += curr['0-30'];
    acc['31-90'] += curr['31-90'];
    acc['91-180'] += curr['91-180'];
    acc['181-365'] += curr['181-365'];
    acc['>365'] += curr['>365'];
    acc.total += curr.total;
    return acc;
  }, { '0-30': 0, '31-90': 0, '91-180': 0, '181-365': 0, '>365': 0, total: 0 });

  const ageChartConfig = {
    '0-30': { label: '0-30 Days', color: 'hsl(var(--chart-1))' },
    '31-90': { label: '31-90 Days', color: 'hsl(var(--chart-2))' },
    '91-180': { label: '91-180 Days', color: 'hsl(var(--chart-3))' },
    '181-365': { label: '181-365 Days', color: 'hsl(var(--chart-4))' },
    '>365': { label: '>1 Year', color: 'hsl(var(--chart-5))' },
  } as const;

  const regionChartConfig = {
    amount: { label: 'Amount' },
    ...regionOptions.reduce((acc, option) => {
        if (option.value !== 'All') {
            acc[option.value] = { label: option.label, color: `hsl(var(--chart-${(Object.keys(acc).length % 5) + 1}))` };
        }
        return acc;
    }, {} as any)
  } as const;
  
  const monthlyChartConfig = {
    ...regionOptions.reduce((acc, option) => {
        if (option.value !== 'All') {
            acc[option.value] = { label: option.label, color: `hsl(var(--chart-${(Object.keys(acc).length % 5) + 1}))` };
        }
        return acc;
    }, {} as any)
  } as const;

  const recoveryChartConfig = {
    new: { label: 'New', color: 'hsl(var(--chart-2))' },
    recovered: { label: 'Recovered', color: 'hsl(var(--chart-1))' },
  } as const;

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-4">
             <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <Select value={financialYear} onValueChange={handleFinancialYearChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select FY" />
                    </SelectTrigger>
                    <SelectContent>
                    {financialYearOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
        </div>
      </div>
      
      <div className="space-y-6 mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Region vs. Ageing</CardTitle>
               <CardDescription>
                Outstanding amounts across different ageing buckets for each region.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {isClient && <ChartContainer config={ageChartConfig} className="min-h-[350px] w-full">
                    <AgeBarChart data={outstandingByAge} />
                  </ChartContainer>}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Region-wise Distribution</CardTitle>
                <CardDescription>
                Outstanding amounts contributed by each region.
                </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="overflow-x-auto">
                <div className="min-w-[400px]">
                  {isClient && <ChartContainer config={regionChartConfig} className="min-h-[350px] w-full">
                      <RegionBarChart data={regionDistribution} />
                  </ChartContainer>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle>Month-wise Outstanding Trend</CardTitle>
                   <CardDescription>
                    Tracking the outstanding balance for each region over time.
                   </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                      {isClient && <ChartContainer config={monthlyChartConfig} className="min-h-[350px] w-full">
                          <MonthlyLineChart data={monthlyTrends} />
                      </ChartContainer>}
                    </div>
                  </div>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle>New vs. Recovered Outstanding</CardTitle>
                  <CardDescription>
                    Comparing newly assigned amounts vs. recovered amounts.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    {isClient && <ChartContainer config={recoveryChartConfig} className="min-h-[350px] w-full">
                        <OutstandingRecoveryChart data={recoveryData} />
                    </ChartContainer>}
                  </div>
                </div>
              </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
              <CardTitle>Ageing Summary by Region</CardTitle>
              <CardDescription>
                A detailed breakdown of outstanding amounts across different ageing buckets.
              </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Region</TableHead>
                      <TableHead className="text-right">0-30 Days</TableHead>
                      <TableHead className="text-right">31-90 Days</TableHead>
                      <TableHead className="text-right">91-180 Days</TableHead>
                      <TableHead className="text-right">181-365 Days</TableHead>
                      <TableHead className="text-right">>1 Year</TableHead>
                      <TableHead className="text-right font-bold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outstandingByAge.map((row) => (
                      <TableRow key={row.region}>
                        <TableCell className="font-medium capitalize">{row.region}</TableCell>
                        <TableCell className="text-right">{row['0-30'].toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">{row['31-90'].toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">{row['91-180'].toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">{row['181-365'].toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">{row['>365'].toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right font-bold">{row.total.toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {region === 'All' && (
                    <TableFooter>
                        <TableRow className="font-bold bg-muted/50">
                            <TableCell>Grand Total</TableCell>
                            <TableCell className="text-right">{grandTotal['0-30'].toLocaleString('en-IN')}</TableCell>
                            <TableCell className="text-right">{grandTotal['31-90'].toLocaleString('en-IN')}</TableCell>
                            <TableCell className="text-right">{grandTotal['91-180'].toLocaleString('en-IN')}</TableCell>
                            <TableCell className="text-right">{grandTotal['181-365'].toLocaleString('en-IN')}</TableCell>
                            <TableCell className="text-right">{grandTotal['>365'].toLocaleString('en-IN')}</TableCell>
                            <TableCell className="text-right">{grandTotal.total.toLocaleString('en-IN')}</TableCell>
                        </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
