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

export default function AdminPage() {
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
    </>
  );
}
