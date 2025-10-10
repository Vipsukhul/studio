'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { InvoiceTrackerData, Customer } from '@/lib/types';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { regionOptions } from '@/lib/data';
import { getInvoiceTrackerData, getCustomers } from '@/lib/api';
import { useFirestore } from '@/firebase';

type DetailedInvoice = {
  invoiceNumber: string;
  customerCode: string;
  customerName: string;
  invoiceAmount: number;
}

export default function InvoiceTrackerPage() {
  const firestore = useFirestore();
  const [data, setData] = useState<InvoiceTrackerData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('All');
  const [department, setDepartment] = useState('Batching Plant');
  const [financialYear, setFinancialYear] = useState('2024-2025');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [detailedInvoices, setDetailedInvoices] = useState<DetailedInvoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

   useEffect(() => {
    const storedDepartment = localStorage.getItem('department');
    const storedFinancialYear = localStorage.getItem('financialYear');
    if (storedDepartment) setDepartment(storedDepartment);
    if (storedFinancialYear) setFinancialYear(storedFinancialYear);

     const handleStorageChange = () => {
        const storedDept = localStorage.getItem('department');
        const storedFY = localStorage.getItem('financialYear');
        if (storedDept) setDepartment(storedDept);
        if (storedFY) setFinancialYear(storedFY);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    async function loadInitialData() {
        if (!department || !financialYear || !firestore) return;
      const customerData = await getCustomers(department, financialYear, firestore);
      setCustomers(customerData);
    }
    loadInitialData();
  }, [department, financialYear, firestore]);

  useEffect(() => {
    async function fetchData() {
        if (!department || !financialYear) return;
      setLoading(true);
      const result = await getInvoiceTrackerData(region, department, financialYear);
      setData(result);
      setLoading(false);
    }
    fetchData();
  }, [region, department, financialYear]);

  const handleRowClick = (monthYear: string) => {
    setSelectedMonth(monthYear);
    
    const allInvoices: DetailedInvoice[] = [];
    customers.forEach(customer => {
      customer.invoices?.forEach(invoice => {
        allInvoices.push({
          invoiceNumber: invoice.invoiceNumber,
          customerCode: customer.customerCode,
          customerName: customer.customerName,
          invoiceAmount: invoice.invoiceAmount
        });
      });
    });
    
    setDetailedInvoices(allInvoices.slice(0, 10));
    setIsDialogOpen(true);
  };


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
            Comparing previous and current month invoice data for the <span className='font-semibold'>{department}</span> department. Click a row for details.
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
                <TableRow key={row.monthYear} onClick={() => handleRowClick(row.monthYear)} className="cursor-pointer">
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoice Details for {selectedMonth}</DialogTitle>
            <DialogDescription>
              Detailed list of invoices for the selected period.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer Code</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead className="text-right">Invoice Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {detailedInvoices.length > 0 ? (
                        detailedInvoices.map((invoice) => (
                            <TableRow key={invoice.invoiceNumber}>
                                <TableCell>{invoice.invoiceNumber}</TableCell>
                                <TableCell>{invoice.customerCode}</TableCell>
                                <TableCell>{invoice.customerName}</TableCell>
                                <TableCell className="text-right">₹{invoice.invoiceAmount.toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24">No detailed invoice data to display.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
