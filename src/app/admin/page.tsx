'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShieldCheck, Webhook, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getEngineerPerformanceData } from '@/lib/api';
import type { EngineerPerformance } from '@/lib/types';
import { ChartContainer } from '@/components/ui/chart';
import { EngineerPerformanceChart } from '@/components/charts/engineer-performance-chart';

const adminSections = [
  {
    title: 'User Management',
    description: 'View, edit, and manage application users.',
    icon: Users,
    href: '/admin/users',
  },
  {
    title: 'Admin Management',
    description: 'Configure settings for the admin portal.',
    icon: ShieldCheck,
    href: '/admin/management',
  },
  {
    title: 'API Management',
    description: 'Control and monitor internal and external APIs.',
    icon: Webhook,
    href: '/admin/api',
  },
  {
    title: 'System Logs',
    description: 'View and monitor system logs.',
    icon: FileText,
    href: '/admin/logs',
  },
];

export default function AdminPage() {
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

  return (
    <>
      <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome to the central control panel for the application.</p>
      
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Link key={section.title} href={section.href} className="group">
            <Card className="h-full transition-all group-hover:border-primary group-hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                   <section.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{section.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
       <Card className="mt-6">
          <CardHeader>
             <Link href="/admin/engineer-performance" className="group">
                <CardTitle className="group-hover:text-primary transition-colors">Engineer Performance</CardTitle>
                <CardDescription className="group-hover:text-primary transition-colors">
                  Overview of outstanding amounts collected vs. newly assigned. Click to see details.
                </CardDescription>
             </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="flex items-center justify-center h-[400px]">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
                </div>
            ) : (
                <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                    <EngineerPerformanceChart data={performanceData} />
                </ChartContainer>
            )}
          </CardContent>
        </Card>
    </>
  );
}
