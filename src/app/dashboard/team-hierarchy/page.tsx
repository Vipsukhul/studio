'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getUsers } from '@/lib/api';
import type { User } from '@/lib/types';
import { Building, Mail, MapPin, Phone } from 'lucide-react';
import { useFirestore } from '@/firebase';

interface RegionHierarchy {
  [region: string]: {
    manager: User | null;
    engineers: User[];
  };
}

export default function TeamHierarchyPage() {
  const firestore = useFirestore();
  const [hierarchy, setHierarchy] = React.useState<RegionHierarchy>({});
  const [loading, setLoading] = React.useState(true);
  const [department, setDepartment] = React.useState('Batching Plant');

  React.useEffect(() => {
    const storedDepartment = localStorage.getItem('department');
    if (storedDepartment) setDepartment(storedDepartment);

    const handleStorageChange = () => {
      const storedDept = localStorage.getItem('department');
      if (storedDept) setDepartment(storedDept);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  React.useEffect(() => {
    async function loadData() {
      if (!firestore) return;
      setLoading(true);
      const users = await getUsers(firestore);
      const filteredUsers = users.filter(user => user.department === department);
      
      const groupedData: RegionHierarchy = filteredUsers.reduce((acc, user) => {
        const region = user.region || 'Unassigned';
        if (!acc[region]) {
          acc[region] = { manager: null, engineers: [] };
        }
        if (user.role === 'Manager') {
          acc[region].manager = user;
        } else if (user.role === 'Engineer') {
          acc[region].engineers.push(user);
        }
        return acc;
      }, {} as RegionHierarchy);
      
      setHierarchy(groupedData);
      setLoading(false);
    }
    loadData();
  }, [department, firestore]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-headline font-bold">Team Hierarchy</h1>
      <p className="text-muted-foreground">
        Organizational structure for the <span className="font-semibold">{department}</span> department, grouped by region.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Regional Teams</CardTitle>
          <CardDescription>
            Click on a region to expand and see the team members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(hierarchy).map(([region, { manager, engineers }]) => (
              <AccordionItem value={region} key={region}>
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                     <MapPin className="h-5 w-5 text-primary"/> 
                     {region} Region
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-4 border-l-2 border-primary ml-4">
                  {manager && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-3 text-primary">Manager</h3>
                      <UserCard user={manager} />
                    </div>
                  )}
                  
                  <div>
                     <h3 className="text-lg font-bold mb-3 text-primary/90">Engineers</h3>
                     {engineers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {engineers.map((engineer) => (
                              <UserCard key={engineer.id} user={engineer} />
                          ))}
                        </div>
                     ) : (
                        <p className="text-muted-foreground">No engineers assigned to this region for this department.</p>
                     )}
                  </div>

                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}

function UserCard({ user }: { user: User }) {
    const initials = user.name.split(' ').map(n => n[0]).join('');
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-4 bg-muted/30">
                <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary">
                        <AvatarImage src={`https://picsum.photos/seed/${user.name}/128/128`} />
                        <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-lg font-bold">{user.name}</CardTitle>
                        <Badge variant={user.role === 'Manager' ? 'default' : 'secondary'} className="mt-1">{user.role}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${user.email}`} className="hover:underline">{user.email}</a>
                </div>
                 <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{user.contact || 'Not available'}</span>
                </div>
                 <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{user.department}</span>
                </div>
            </CardContent>
        </Card>
    );
}
