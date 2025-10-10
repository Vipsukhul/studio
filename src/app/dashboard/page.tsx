'use client';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, Building, CalendarDays, Users, FileText, IndianRupee } from 'lucide-react';
import { AgeBarChart } from '@/components/charts/age-bar-chart';
import { RegionPieChart } from '@/components/charts/region-pie-chart';
import { MonthlyLineChart } from '@/components/charts/monthly-line-chart';
import { OutstandingRecoveryChart } from '@/components/charts/outstanding-recovery-chart';
import { generateMonthOptions, regionOptions, departmentOptions, financialYearOptions } from '@/lib/data';
import { ChartContainer } from '@/components/ui/chart';
import type { Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution, OutstandingRecoveryTrend } from '@/lib/types';
import { getDashboardData, getOutstandingRecoveryTrend } from '@/lib/api';
import { useFirestore } from '@/firebase';

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{kpi.value}</div>
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
  const firestore = useFirestore();
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
  const [department, setDepartment] = useState('Batching Plant');
  const [isClient, setIsClient] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const storedDepartment = localStorage.getItem('department');
    const storedFinancialYear = localStorage.getItem('financialYear');
    const storedRole = localStorage.getItem('userRole');

    if (storedDepartment) setDepartment(storedDepartment);
    if (storedRole) setUserRole(storedRole);
    
    if (storedFinancialYear) {
      setFinancialYear(storedFinancialYear);
      const newMonthOptions = generateMonthOptions(storedFinancialYear);
      setMonth(newMonthOptions[0].value);
    } else {
       setMonth(monthOptions[0].value);
    }


     const handleStorageChange = () => {
        const storedDept = localStorage.getItem('department');
        const storedFY = localStorage.getItem('financialYear');
        if (storedDept) setDepartment(storedDept);
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
      if (!firestore) return;
      setLoading(true);
      const [mainData, recoveryTrendData] = await Promise.all([
        getDashboardData(month, department, financialYear, firestore),
        getOutstandingRecoveryTrend(department, financialYear)
      ]);
      setDashboardData(mainData);
      setRecoveryData(recoveryTrendData);
      setLoading(false);
    }
    if (department && financialYear) {
        fetchData();
    }
  }, [month, department, financialYear, firestore]);

  const handleDepartmentChange = (newDepartment: string) => {
    setDepartment(newDepartment);
    localStorage.setItem('department', newDepartment);
    window.dispatchEvent(new Event('storage'));
  };

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

  const filteredAgeData = region === 'All'
    ? outstandingByAge
    : outstandingByAge.filter(item => item.region === region);
    
  const grandTotal = filteredAgeData.reduce((acc, curr) => {
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
    '>365': { label: '>1 Year', color: 'hsl(var(--chart-3))' },
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-4">
            {userRole === 'Country Manager' && (
                <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <Select value={department} onValueChange={handleDepartmentChange}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                        {departmentOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
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
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
            {isClient && <ChartContainer config={ageChartConfig} className="min-h-[350px] w-full">
              <AgeBarChart data={filteredAgeData} />
            </ChartContainer>}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Region-wise Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isClient && <ChartContainer config={regionChartConfig} className="min-h-[350px] w-full">
                <RegionPieChart data={regionDistribution} />
            </ChartContainer>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Month-wise Outstanding Trend</CardTitle>
            </CardHeader>
            <CardContent>
                {isClient && <ChartContainer config={monthlyChartConfig} className="min-h-[350px] w-full">
                    <MonthlyLineChart data={monthlyTrends} />
                </ChartContainer>}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>New vs. Recovered Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
                {isClient && <ChartContainer config={recoveryChartConfig} className="min-h-[350px] w-full">
                    <OutstandingRecoveryChart data={recoveryData} />
                </ChartContainer>}
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ageing Summary by Region</CardTitle>
            <div className="w-[180px]">
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
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
        </CardHeader>
        <CardContent className="overflow-x-auto">
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
              {filteredAgeData.map((row) => (
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
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
