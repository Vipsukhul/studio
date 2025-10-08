import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSheetTable } from "@/components/tables/data-sheet-table";
import { getDataSheetData } from "@/lib/api";

export default async function DataSheetPage() {
  // In a real app, you'd pass filters from URL search params
  const data = await getDataSheetData();

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
          <DataSheetTable data={data} />
        </CardContent>
      </Card>
    </>
  );
}
