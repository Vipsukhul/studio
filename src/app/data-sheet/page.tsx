'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSheetTable } from "@/components/tables/data-sheet-table";
import type { Customer } from "@/lib/types";
import { getCustomers } from '@/lib/api';

export default function DataSheetPage() {
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [financialYear, setFinancialYear] = useState('2024-2025');

   useEffect(() => {
    const storedFinancialYear = localStorage.getItem('financialYear');
    if (storedFinancialYear) setFinancialYear(storedFinancialYear);
    
     const handleStorageChange = () => {
        const storedFY = localStorage.getItem('financialYear');
        if (storedFY) setFinancialYear(storedFY);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!financialYear) return;
      setLoading(true);
      const data = await getCustomers(financialYear);
      setCustomersData(data);
      setLoading(false);
    }
    loadData();
  }, [financialYear]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div className="constrained-container">
      <h1 className="text-3xl font-headline font-bold">Data Sheet</h1>
      <Card>
        <CardHeader>
          <CardTitle>Customer Data</CardTitle>
          <CardDescription>
            Detailed view of all customer outstanding data for FY <span className="font-semibold">{financialYear}</span>. Click a row to see invoice details.
          </CardDescription>
        </CardHeader>
        <CardContent className="data-sheet-table">
          <DataSheetTable data={customersData} />
        </CardContent>
      </Card>
    </div>
  );
}
