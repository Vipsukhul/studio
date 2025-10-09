import * as xlsx from 'xlsx';
import {
  kpis,
  outstandingByAge,
  regionDistribution,
  monthlyTrends,
  invoiceTrackerData,
  customers,
  engineers,
  outstandingRecoveryTrend,
  engineerPerformance,
} from './data';
import type { Customer, Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution, InvoiceTrackerData, Engineer, Invoice, OutstandingRecoveryTrend, EngineerPerformance } from './types';
import { createNotification } from './notifications';

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Simulates fetching all dashboard data.
 * @param month - The selected month (for simulation purposes).
 */
export async function getDashboardData(month: string) {
  await delay(500);
  console.log(`Fetching data for month: ${month}`);
  
  const totalCustomers = customers.length;
  const customersKpi: Kpi = {
    label: 'Total Customers',
    value: totalCustomers.toString(),
    description: 'active accounts',
  };

  // Avoid duplicating the KPI if it already exists
  const existingKpis = kpis.filter(k => k.label !== 'Total Customers');
  
  return {
    kpis: [...existingKpis, customersKpi],
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
    
    // Notification logic
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'Manager') {
        const customer = customers[customerIndex];
        createNotification({
            from: { name: 'Manager', role: 'Manager' },
            to: 'Country Manager',
            message: `Manager updated remark for ${customer.customerName} to "${newRemark}".`
        });
    }

    return { success: true };
  }
  throw new Error('Customer not found');
}

/**
 * Simulates updating a customer's notes.
 * @param customerId - The ID of the customer to update.
 * @param newNotes - The new notes to set.
 */
export async function updateCustomerNotes(customerId: string, newNotes: string): Promise<{ success: boolean }> {
  await delay(300);
  console.log(`Updating notes for customer ${customerId} to "${newNotes}"`);
  const customerIndex = customers.findIndex(c => c.customerCode === customerId);
  if (customerIndex !== -1) {
    customers[customerIndex].notes = newNotes;
    
    // Notification logic
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'Engineer') {
        const customer = customers[customerIndex];
        createNotification({
            from: { name: 'Engineer', role: 'Engineer' },
            to: 'Manager',
            message: `Engineer added new notes for ${customer.customerName} in the ${customer.region} region.`
        });
    }

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
export async function processAndUploadFile(file: File, month: string): Promise<{ count: number; data: any[] }> {
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
        
        createNotification({
            from: { name: 'Country Manager', role: 'Country Manager' },
            to: 'all',
            message: `The data sheet for ${month} has been updated with ${jsonData.length} records.`
        });
        
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

/**
 * Simulates fetching engineers by region.
 * @param region - The region to filter engineers by.
 */
export async function getEngineersByRegion(region: string): Promise<Engineer[]> {
    await delay(100);
    return engineers.filter(e => e.region === region);
}

/**
 * Simulates updating the assigned engineer for a customer.
 * @param customerId - The ID of the customer to update.
 * @param engineerName - The name of the engineer to assign.
 */
export async function updateAssignedEngineer(customerId: string, engineerName: string): Promise<{ success: boolean }> {
    await delay(300);
    console.log(`Assigning engineer ${engineerName} to customer ${customerId}`);
    const customerIndex = customers.findIndex(c => c.customerCode === customerId);
    if (customerIndex !== -1) {
        customers[customerIndex].assignedEngineer = engineerName;
        
        // Notification logic
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'Manager') {
            const customer = customers[customerIndex];
            createNotification({
                from: { name: 'Manager', role: 'Manager' },
                to: 'Country Manager',
                message: `Manager assigned ${engineerName} to ${customer.customerName}.`
            });
        }
        
        return { success: true };
    }
    throw new Error('Customer not found');
}

/**
 * Simulates updating an invoice's dispute status.
 * @param customerId The customer's code
 * @param invoiceNumber The invoice number
 * @param newStatus The new dispute status
 */
export async function updateInvoiceDisputeStatus(customerId: string, invoiceNumber: string, newStatus: 'dispute' | 'paid' | 'unpaid'): Promise<{ success: boolean }> {
  await delay(300);
  console.log(`Updating invoice ${invoiceNumber} for customer ${customerId} to status "${newStatus}"`);
  
  const customerIndex = customers.findIndex(c => c.customerCode === customerId);
  if (customerIndex === -1) throw new Error('Customer not found');
  
  const customer = customers[customerIndex];
  if (!customer.invoices) throw new Error('Customer has no invoices');

  const invoiceIndex = customer.invoices.findIndex(i => i.invoiceNumber === invoiceNumber);
  if (invoiceIndex === -1) throw new Error('Invoice not found');

  customers[customerIndex].invoices![invoiceIndex].status = newStatus;
  
  return { success: true };
}

/**
 * Simulates fetching the outstanding vs. recovery trend data.
 */
export async function getOutstandingRecoveryTrend(): Promise<OutstandingRecoveryTrend[]> {
  await delay(500);
  return outstandingRecoveryTrend;
}

/**
 * Simulates fetching engineer performance data.
 */
export async function getEngineerPerformanceData(): Promise<EngineerPerformance[]> {
  await delay(500);
  return engineerPerformance;
}

/**
 * Simulates uploading an image to Cloudinary.
 * In a real app, you would use your Cloudinary credentials here.
 * @param file The image file to upload.
 * @returns The URL of the uploaded image.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  // IMPORTANT: Replace with your Cloudinary details.
  // You can get these from your Cloudinary dashboard.
  // It's recommended to use "unsigned" uploads for client-side operations
  // for better security.
  const CLOUDINARY_CLOUD_NAME = 'demo'; // <-- REPLACE with your cloud name
  const CLOUDINARY_UPLOAD_PRESET = 'docs_upload_example'; // <-- REPLACE with your upload preset

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  console.log('Simulating upload to Cloudinary...');
  // Since we are using a demo cloud, we will simulate the upload to avoid actual uploads.
  // In your real application, you would perform the fetch request below.
  
  /*
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return data.secure_url;
  */

  // --- SIMULATION ---
  await delay(1500); // Simulate network delay
  // Create a temporary local URL for the uploaded image for demonstration.
  const localImageUrl = URL.createObjectURL(file);
  console.log('Simulated upload complete. Image URL:', localImageUrl);
  return localImageUrl;
  // --- END SIMULATION ---
}
