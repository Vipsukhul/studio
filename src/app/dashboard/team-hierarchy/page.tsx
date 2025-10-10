'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ban } from 'lucide-react';

export default function TeamHierarchyPage() {
  return (
    <>
      <h1 className="text-3xl font-headline font-bold">Team Hierarchy</h1>
       <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-6 w-6" />
            Feature Removed
          </CardTitle>
          <CardDescription>
            This feature has been temporarily removed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Team Hierarchy page is currently unavailable.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
