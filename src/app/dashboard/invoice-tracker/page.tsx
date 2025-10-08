'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getInvoiceTrackerData } from '@/lib/api';
import type { InvoiceTrackerData } from '@/lib/types';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { regionOptions } from '@/lib/data';

export default function InvoiceTrackerPage() {
  const [data, setData] = useState<InvoiceTrackerData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('All');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getInvoiceTrackerData(region) as InvoiceTrackerData[];
      setData(result);
      setLoading(false);
    }
    fetchData();
  }, [region]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Invoice Tracker</h1>
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
      <Card>
        <CardHeader>
          <CardTitle>Region-wise Invoice Summary</CardTitle>
          <CardDescription>
            Comparing previous and current month invoice data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
             </div>
          ) : (
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month-Year</TableHead>
                <TableHead>Prev. Month Invoices (#)</TableHead>
                <TableHead className='text-right'>Prev. Month Amount</TableHead>
                <TableHead>Curr. Month Invoices (#)</TableHead>
                <TableHead className='text-right'>Curr. Month Amount</TableHead>
                <TableHead>Invoice Count Change</TableHead>
                <TableHead>Disputed Invoices (#)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row.monthYear}>
                  <TableCell className="font-medium">{row.monthYear}</TableCell>
                  <TableCell>{row.previousMonthInvoices}</TableCell>
                  <TableCell className='text-right'>{`₹${row.previousMonthAmount.toLocaleString('en-IN')}`}</TableCell>
                  <TableCell>{row.currentMonthInvoices}</TableCell>
                  <TableCell className='text-right'>{`₹${row.currentMonthAmount.toLocaleString('en-IN')}`}</TableCell>
                  <TableCell>
                    <div className={`flex items-center ${row.invoiceCountChange >= 0 ? 'text-destructive' : 'text-green-600'}`}>
                      {row.invoiceCountChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                      {Math.abs(row.invoiceCountChange)}
                    </div>
                  </TableCell>
                  <TableCell>{row.disputedInvoices}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
