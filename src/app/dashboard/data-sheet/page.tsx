'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSheetTable } from "@/components/tables/data-sheet-table";
import type { Customer } from "@/lib/types";
import { getCustomers } from '@/lib/api';

export default function DataSheetPage() {
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('Batching Plant');
  const [financialYear, setFinancialYear] = useState('2024-2025');

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
    async function loadData() {
      if (!department || !financialYear) return;
      setLoading(true);
      const data = await getCustomers(department, financialYear);
      setCustomersData(data);
      setLoading(false);
    }
    loadData();
  }, [department, financialYear]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-headline font-bold">Data Sheet</h1>
      <Card>
        <CardHeader>
          <CardTitle>Customer Data</CardTitle>
          <CardDescription>
            Detailed view of all customer outstanding data for the <span className="font-semibold">{department}</span> department for FY <span className="font-semibold">{financialYear}</span>. Click a row to see invoice details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataSheetTable data={customersData} />
        </CardContent>
      </Card>
    </>
  );
}
