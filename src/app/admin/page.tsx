'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShieldCheck, Webhook, FileText, Info, AlertTriangle, CircleX } from 'lucide-react';
import Link from 'next/link';

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

const logStats = [
    {
        level: 'Info',
        count: 125,
        icon: Info,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
    },
    {
        level: 'Warnings',
        count: 12,
        icon: AlertTriangle,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
    },
    {
        level: 'Errors',
        count: 3,
        icon: CircleX,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
    }
]

export default function AdminPage() {
  return (
    <>
      <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome to the central control panel for the application.</p>
      
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {logStats.map((stat) => (
            <Card key={stat.level}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{stat.level}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stat.count}</div>
                    <p className="text-xs text-muted-foreground">in the last 24 hours</p>
                </CardContent>
            </Card>
        ))}
      </div>

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
    </>
  );
}
