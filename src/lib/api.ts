import * as xlsx from 'xlsx';
import {
  customers as mockCustomers,
  kpis as mockKpis,
  regionDistribution as mockRegionDistribution,
  monthlyTrends as mockMonthlyTrends,
  invoiceTrackerData as mockInvoiceTrackerData,
  engineers as mockEngineers,
  outstandingRecoveryTrend as mockOutstandingRecoveryTrend,
  outstandingByAge as mockOutstandingByAge,
  users as mockUsers
} from './data';
import type { Customer, Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution, InvoiceTrackerData, Engineer, Invoice, OutstandingRecoveryTrend, LogEntry, EngineerPerformance, User } from './types';
import { createNotification } from './notifications';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Fetches dashboard data.
 * In a real app, this would make a network request to a backend API.
 * Here, we simulate it with mock data.
 * @param month - The selected month (for simulation purposes).
 * @param financialYear - The selected financial year.
 * @param region - The selected region to filter data.
 */
export async function getDashboardData(month: string, financialYear: string, region: string) {
  await delay(500);
  console.log(`Fetching data for month: ${month}, FY: ${financialYear}, Region: ${region}`);

  // Simulate filtering based on region
  const filteredCustomers = region === 'All' ? mockCustomers : mockCustomers.filter(c => c.region === region);
  const totalCustomers = filteredCustomers.length;

  const customersKpi: Kpi = {
    label: 'Total Customers',
    value: totalCustomers.toString(),
    description: `in ${region === 'All' ? 'All Regions' : region}`,
  };

  // Simulate KPI calculation for the selected region
  const totalOutstanding = filteredCustomers.reduce((acc, c) => acc + (c.outstandingAmount || 0), 0);
  
  const outstandingKpi: Kpi = {
    label: 'Total Outstanding',
    value: `₹${Math.floor(totalOutstanding).toLocaleString('en-IN')}`,
    description: `for ${month}`,
  };

  const existingKpis = mockKpis.filter(k => !['Total Customers', 'Total Outstanding'].includes(k.label));
  
  const finalKpis = [outstandingKpi, ...existingKpis, customersKpi];
  
  const filteredRegionDistribution = region === 'All' 
    ? mockRegionDistribution 
    : mockRegionDistribution.filter(d => d.region === region);

  return {
    kpis: finalKpis,
    outstandingByAge: mockOutstandingByAge, // This data is already structured by region
    regionDistribution: filteredRegionDistribution,
    monthlyTrends: mockMonthlyTrends, // Monthly trends are usually shown for all regions for comparison
  };
}


/**
 * Fetches invoice tracker data.
 * @param region - The region to filter by.
 * @param financialYear - The selected financial year.
 */
export async function getInvoiceTrackerData(region: string, financialYear: string): Promise<InvoiceTrackerData[]> {
  await delay(500);
  console.log(`Fetching invoice tracker data for region: ${region} and FY: ${financialYear}`);
  if (region === 'All') {
    return mockInvoiceTrackerData;
  }
  // Simulate filtering by returning a subset
  return mockInvoiceTrackerData.slice(0, 1);
}

/**
 * Fetches the list of all customers from mock data.
 * @param financialYear - The selected financial year (used for logging).
 */
export async function getCustomers(financialYear: string): Promise<Customer[]> {
  await delay(300);
  console.log(`Fetching customers for FY: ${financialYear} from mock data`);
  return JSON.parse(JSON.stringify(mockCustomers));
}

/**
 * Updates a customer's remark in the mock data.
 * @param customerId - The ID of the customer to update.
 * @param newRemark - The new remark to set.
 */
export async function updateCustomerRemark(customerId: string, newRemark: Customer['remarks']) {
  await delay(200);
  console.log(`Updating remark for customer ${customerId} to "${newRemark}" in mock data`);
  const customer = mockCustomers.find(c => c.customerCode === customerId);
  if (customer) {
    customer.remarks = newRemark;
  }
  
  createNotification({
      from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
      to: 'Manager',
      message: `Remark for customer ${customerId} updated to "${newRemark}".`
  });
}

/**
 * Updates a customer's notes in the mock data.
 * @param customerId - The ID of the customer to update.
 * @param newNotes - The new notes to set.
 */
export async function updateCustomerNotes(customerId: string, newNotes: string) {
  await delay(200);
  console.log(`Updating notes for customer ${customerId} in mock data`);
  const customer = mockCustomers.find(c => c.customerCode === customerId);
  if (customer) {
    customer.notes = newNotes;
  }

  createNotification({
      from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
      to: 'Manager',
      message: `Notes updated for customer ${customerId}.`
  });
}

/**
 * Processes an uploaded Excel file.
 * @param file - The Excel file to process.
 * @param month - The month for which data is being uploaded.
 */
export function processAndUploadFile(file: File, month: string): Promise<{ count: number; data: Customer[] }> {
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

        if (jsonData.length === 0) {
            return reject(new Error("Excel file is empty or could not be parsed."));
        }
        
        const customersData = jsonData as Customer[]; // Type assertion
        
        console.log(`Successfully processed ${customersData.length} customer records.`);
        
        createNotification({
            from: { name: 'System', role: 'System' },
            to: 'all',
            message: `The data sheet for ${month} has been updated with ${customersData.length} customer records.`
        });
        
        resolve({ count: customersData.length, data: customersData });
      } catch (error) {
        console.error("Error processing file:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file.'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Fetches engineers by region from mock data.
 * @param region - The region to filter engineers by.
 */
export async function getEngineersByRegion(region: string): Promise<Engineer[]> {
    await delay(100);
    return mockEngineers.filter(e => e.region === region);
}

/**
 * Updates the assigned engineer for a customer in the mock data.
 * @param customerId - The document ID of the customer to update.
 * @param engineerName - The name of the engineer to assign.
 */
export async function updateAssignedEngineer(customerId: string, engineerName: string) {
    await delay(200);
    console.log(`Assigning engineer ${engineerName} to customer ${customerId} in mock data`);
    const customer = mockCustomers.find(c => c.customerCode === customerId);
    if (customer) {
        customer.assignedEngineer = engineerName;
    }

    createNotification({
        from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
        to: 'Manager',
        message: `Assigned ${engineerName} to customer ${customerId}.`
    });
}

/**
 * Updates an invoice's dispute status in the mock data.
 * @param customerId - The document ID of the customer.
 * @param invoiceNumber - The ID of the invoice document.
 * @param newStatus - The new dispute status.
 */
export async function updateInvoiceDisputeStatus(customerId: string, invoiceId: string, newStatus: 'dispute' | 'paid' | 'unpaid') {
  await delay(200);
  console.log(`Updating invoice ${invoiceId} for customer ${customerId} to status "${newStatus}" in mock data`);
  const customer = mockCustomers.find(c => c.customerCode === customerId);
  if(customer && customer.invoices) {
      const invoice = customer.invoices.find(i => i.invoiceNumber === invoiceId);
      if(invoice) {
          invoice.status = newStatus;
      }
  }

  createNotification({
      from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
      to: 'Manager',
      message: `Status for invoice ${invoiceId} updated to ${newStatus}.`
  });
}

/**
 * Fetches the outstanding vs. recovery trend data from mock data.
 * @param financialYear - The selected financial year.
 */
export async function getOutstandingRecoveryTrend(financialYear: string): Promise<OutstandingRecoveryTrend[]> {
  await delay(500);
  console.log(`Fetching recovery trend for FY: ${financialYear}`);
  return mockOutstandingRecoveryTrend;
}


/**
 * Fetches engineer performance data from mock data.
 * @param financialYear - The selected financial year.
 */
export async function getEngineerPerformanceData(financialYear: string): Promise<EngineerPerformance[]> {
  await delay(500);
  console.log(`Fetching engineer performance for FY: ${financialYear}`);
  const { engineerPerformance } = await import('./data');
  return engineerPerformance;
}

/**
 * Uploads an image to a cloud service and returns the URL.
 * This is a placeholder and should be replaced with a real cloud storage service like Firebase Storage.
 * @param file The image file to upload.
 * @returns The URL of the uploaded image.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  await delay(1500); // Simulate network delay
  const localImageUrl = URL.createObjectURL(file);
  console.log('Simulated upload complete. Image URL:', localImageUrl);
  return localImageUrl;
}

/**
 * Fetches all users (managers and engineers) from mock data.
 */
export async function getUsers(): Promise<User[]> {
    await delay(300);
    console.log(`Fetching users from mock data`);
    return mockUsers;
}

/**
 * Fetches a single user profile from mock data by UID.
 * @param uid The user's UID.
 */
export async function getUserProfile(uid: string): Promise<User | null> {
  await delay(100);
  const user = mockUsers.find(u => u.id === uid);
  return user || null;
}
