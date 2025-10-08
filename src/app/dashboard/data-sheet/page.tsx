'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSheetTable } from "@/components/tables/data-sheet-table";
import { customers } from "@/lib/data";
import type { Customer } from "@/lib/types";

export default function DataSheetPage() {

  const customersData: Customer[] = customers;

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
          <DataSheetTable data={customersData || []} />
        </CardContent>
      </Card>
    </>
  );
}
