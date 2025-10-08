import * as xlsx from 'xlsx';
import {
  kpis,
  outstandingByAge,
  regionDistribution,
  monthlyTrends,
  invoiceTrackerData,
  customers,
} from './data';
import type { Customer, Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution, InvoiceTrackerData } from './types';

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Simulates fetching all dashboard data.
 * @param month - The selected month (for simulation purposes).
 */
export async function getDashboardData(month: string) {
  await delay(500);
  console.log(`Fetching data for month: ${month}`);
  return {
    kpis,
    outstandingByAge,
    regionDistribution,
    monthlyTrends,
  };
}

/**
 * Simulates fetching invoice tracker data, with region filtering.
 * @param region - The region to filter by.
 */
export async function getInvoiceTrackerData(region: string): Promise<InvoiceTrackerData[]> {
  await delay(500);
  if (region === 'All') {
    return invoiceTrackerData;
  }
  // This is a simple simulation. In a real app, you'd filter the data.
  // For now, we'll just return a subset to show the filtering is happening.
  return invoiceTrackerData.slice(0, 1);
}

/**
 * Simulates fetching the list of all customers.
 */
export async function getCustomers(): Promise<Customer[]> {
  await delay(500);
  return customers;
}

/**
 * Simulates updating a customer's remark.
 * In a real app, this would be a POST/PUT request to your backend.
 * @param customerId - The ID of the customer to update.
 * @param newRemark - The new remark to set.
 */
export async function updateCustomerRemark(customerId: string, newRemark: Customer['remarks']): Promise<{ success: boolean }> {
  await delay(300);
  console.log(`Updating remark for customer ${customerId} to "${newRemark}"`);
  // Find the customer and update the mock data.
  const customerIndex = customers.findIndex(c => c.customerCode === customerId);
  if (customerIndex !== -1) {
    customers[customerIndex].remarks = newRemark;
    return { success: true };
  }
  throw new Error('Customer not found');
}

/**
 * Processes an uploaded Excel file.
 * In a real app, you might send the file to a backend for processing.
 * Here, we'll process it on the client-side.
 * @param file - The Excel file to process.
 */
export async function processAndUploadFile(file: File): Promise<{ count: number; data: any[] }> {
  await delay(1000); // Simulate upload and processing time

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) {
        return reject(new Error('Could not read file.'));
      }
      try {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = xlsx.utils.sheet_to_json(worksheet, { defval: null });
        
        console.log('Simulating data processing and saving:', jsonData);
        // Here you would typically send jsonData to your backend API.
        
        resolve({ count: jsonData.length, data: jsonData });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file.'));
    };

    reader.readAsArrayBuffer(file);
  });
}
