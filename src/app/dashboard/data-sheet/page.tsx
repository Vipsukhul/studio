'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSheetTable } from "@/components/tables/data-sheet-table";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from "firebase/firestore";
import type { Customer } from "@/lib/types";

export default function DataSheetPage() {
  const firestore = useFirestore();
  const customersCollection = useMemoFirebase(() => collection(firestore, 'customers'), [firestore]);
  const { data: customersData, isLoading } = useCollection<Customer>(customersCollection);

  return (
    <>
      <h1 className="text-3xl font-headline font-bold">Data Sheet</h1>
      <Card>
        <CardHeader>
          <CardTitle>Customer Data</CardTitle>
          <CardDescription>
            Detailed view of all customer outstanding data. Click a row to see invoice details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
            </div>
          ) : (
            <DataSheetTable data={customersData || []} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
