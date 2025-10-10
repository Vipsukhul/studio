import * as xlsx from 'xlsx';
import {
  kpis,
  outstandingByAge as outstandingByage,
  regionDistribution,
  monthlyTrends,
  invoiceTrackerData,
  customers as mockCustomers,
  engineers,
  outstandingRecoveryTrend,
  users as mockUsers,
} from './data';
import type { Customer, Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution, InvoiceTrackerData, Engineer, Invoice, OutstandingRecoveryTrend, User } from './types';
import { createNotification } from './notifications';
import jwt from 'jsonwebtoken';

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const mockUsersCredentials = {
  'vipsukhul@gmail.com': { password: 'password', role: 'Country Manager', department: 'Batching Plant' },
  'manager@example.com': { password: 'password', role: 'Manager', department: 'Pump' },
  'engineer@example.com': { password: 'password', role: 'Engineer', department: 'Batching Plant' },
};


export async function login(email: string, password: string, department: string) {
  await delay(1000);
  // @ts-ignore
  const userCredentials = mockUsersCredentials[email];

  if (userCredentials && userCredentials.password === password) {
    const user = {
      id: email,
      name: email.split('@')[0],
      role: userCredentials.role,
      department: department,
    };
    
    // In a real backend, you'd use a secret from an env variable
    const token = jwt.sign(user, 'your-super-secret-key', { expiresIn: '1h' });
    
    return { token, user };
  } else {
    throw new Error('Invalid email or password.');
  }
}


/**
 * Simulates fetching all dashboard data.
 * @param month - The selected month (for simulation purposes).
 * @param department - The selected department.
 */
export async function getDashboardData(month: string, department: string, financialYear: string) {
  await delay(500);
  console.log(`Fetching data for month: ${month}, department: ${department}, and FY: ${financialYear}`);
  
  const customers = await getCustomers(department, financialYear);
  const totalCustomers = customers.length;
  
  const customersKpi: Kpi = {
    label: 'Total Customers',
    value: totalCustomers.toString(),
    description: `in ${department}`,
  };

  const existingKpis = kpis.filter(k => k.label !== 'Total Customers');
  
  const filteredOutstandingByAge = outstandingByage.filter(item => item.department === department);
  const filteredRegionDistribution = regionDistribution; 
  const filteredMonthlyTrends = monthlyTrends;

  return {
    kpis: [...existingKpis, customersKpi],
    outstandingByAge: filteredOutstandingByAge,
    regionDistribution: filteredRegionDistribution,
    monthlyTrends: filteredMonthlyTrends,
  };
}

/**
 * Simulates fetching invoice tracker data, with region and department filtering.
 * @param region - The region to filter by.
 * @param department - The department to filter by.
 */
export async function getInvoiceTrackerData(region: string, department: string, financialYear: string): Promise<InvoiceTrackerData[]> {
  await delay(500);
  console.log(`Fetching invoice tracker data for region: ${region}, department: ${department}, and FY: ${financialYear}`);
  let filteredData = invoiceTrackerData.filter(d => d.department === department);
  if (region === 'All') {
    return filteredData;
  }
  return filteredData.slice(0, 1);
}

/**
 * Fetches the list of all customers from mock data, filtered by department.
 * @param department - The department to filter by.
 */
export async function getCustomers(department: string, financialYear: string): Promise<Customer[]> {
  await delay(200);
  console.log(`Fetching customers for department: ${department} and FY: ${financialYear}`);
  return mockCustomers.filter(c => c.department === department).map(c => ({...c, id: c.customerCode}));
}

/**
 * Simulates updating a customer's remark.
 * In a real app, this would be a POST/PUT request to your backend.
 * @param customerId - The ID of the customer to update.
 * @param newRemark - The new remark to set.
 */
export async function updateCustomerRemark(customerId: string, newRemark: Customer['remarks']): Promise<{ success: boolean }> {
  console.log(`Updating remark for customer ${customerId} to "${newRemark}"`);
  const customerIndex = mockCustomers.findIndex(c => c.customerCode === customerId);
  if(customerIndex !== -1) {
    mockCustomers[customerIndex].remarks = newRemark;
  }
  
  createNotification({
      from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
      to: 'Manager',
      message: `Remark for customer ${customerId} updated to "${newRemark}".`
  });

  return { success: true };
}

/**
 * Simulates updating a customer's notes.
 * @param customerId - The ID of the customer to update.
 * @param newNotes - The new notes to set.
 */
export async function updateCustomerNotes(customerId: string, newNotes: string): Promise<{ success: boolean }> {
  console.log(`Updating notes for customer ${customerId} to "${newNotes}"`);
  const customerIndex = mockCustomers.findIndex(c => c.customerCode === customerId);
  if(customerIndex !== -1) {
    mockCustomers[customerIndex].notes = newNotes;
  }
  
  createNotification({
      from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
      to: 'Manager',
      message: `Notes updated for customer ${customerId}.`
  });

  return { success: true };
}


/**
 * Processes an uploaded Excel file, groups by customer, and simulates an upload.
 * @param file - The Excel file to process.
 */
export function processAndUploadFile(file: File, month: string): Promise<{ count: number; data: any[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
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
        
        console.log("Simulating upload of parsed data:", jsonData);
        
        createNotification({
            from: { name: 'System', role: 'System' },
            to: 'all',
            message: `The data sheet for ${month} has been updated with ${jsonData.length} customer records.`
        });
        
        resolve({ count: jsonData.length, data: jsonData });
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
 * Simulates fetching engineers by region and department.
 * @param region - The region to filter engineers by.
 * @param department - The department to filter by.
 */
export async function getEngineersByRegionAndDepartment(region: string, department: string): Promise<Engineer[]> {
    await delay(100);
    return engineers.filter(e => e.region === region && e.department === department);
}

/**
 * Simulates updating the assigned engineer for a customer.
 * @param customerId - The ID of the customer to update.
 * @param engineerName - The name of the engineer to assign.
 */
export async function updateAssignedEngineer(customerId: string, engineerName: string): Promise<{ success: boolean }> {
    console.log(`Assigning engineer ${engineerName} to customer ${customerId}`);
    const customerIndex = mockCustomers.findIndex(c => c.customerCode === customerId);
    if(customerIndex !== -1) {
      mockCustomers[customerIndex].assignedEngineer = engineerName;
    }
    
    createNotification({
        from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
        to: 'Manager',
        message: `Assigned ${engineerName} to customer ${customerId}.`
    });
    
    return { success: true };
}

/**
 * Simulates updating an invoice's dispute status.
 * @param customerId The customer's code
 * @param invoiceNumber The invoice number
 * @param newStatus The new dispute status
 */
export async function updateInvoiceDisputeStatus(customerId: string, invoiceNumber: string, newStatus: 'dispute' | 'paid' | 'unpaid'): Promise<{ success: boolean }> {
  console.log(`Updating invoice ${invoiceNumber} for customer ${customerId} to status "${newStatus}"`);
  
  const customerIndex = mockCustomers.findIndex(c => c.customerCode === customerId);
  if(customerIndex !== -1) {
    const customer = mockCustomers[customerIndex];
    const invoiceIndex = customer.invoices?.findIndex(i => i.invoiceNumber === invoiceNumber);
    if(customer.invoices && invoiceIndex !== undefined && invoiceIndex !== -1) {
      customer.invoices[invoiceIndex].status = newStatus;
    }
  }
  
  createNotification({
      from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
      to: 'Manager',
      message: `Status for invoice ${invoiceNumber} updated to ${newStatus}.`
  });
  
  return { success: true };
}

/**
 * Simulates fetching the outstanding vs. recovery trend data.
 * @param department - The department to filter by.
 */
export async function getOutstandingRecoveryTrend(department: string, financialYear: string): Promise<OutstandingRecoveryTrend[]> {
  await delay(500);
  console.log(`Fetching recovery trend for department: ${department} and FY: ${financialYear}`);
  return outstandingRecoveryTrend.filter(item => item.department === department);
}

/**
 * Simulates fetching engineer performance data.
 * @param department - The department to filter by.
 */
export async function getEngineerPerformanceData(department: string = 'Batching Plant', financialYear: string = '2024-2025'): Promise<EngineerPerformance[]> {
  await delay(500);
  // @ts-ignore
  const { engineerPerformance } = await import('./data');
  console.log(`Fetching engineer performance for department: ${department} and FY: ${financialYear}`);
  return engineerPerformance.filter((item: any) => item.department === department);
}

/**
 * Simulates uploading an image to Cloudinary.
 * In a real app, you would use your Cloudinary credentials here.
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
 * Simulates fetching all users (managers and engineers).
 */
export async function getUsers(): Promise<User[]> {
  await delay(300);
  return mockUsers;
}
