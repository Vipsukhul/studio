import * as xlsx from 'xlsx';
import {
  kpis,
  outstandingByAge,
  regionDistribution,
  monthlyTrends,
  invoiceTrackerData,
  customers as mockCustomers,
  engineers,
  outstandingRecoveryTrend,
  engineerPerformance,
  users as mockUsers,
} from './data';
import type { Customer, Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution, InvoiceTrackerData, Engineer, Invoice, OutstandingRecoveryTrend, EngineerPerformance, User } from './types';
import { createNotification } from './notifications';
import { Firestore, collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Simulates fetching all dashboard data.
 * @param month - The selected month (for simulation purposes).
 * @param department - The selected department.
 */
export async function getDashboardData(month: string, department: string, financialYear: string, firestore: Firestore) {
  await delay(500);
  console.log(`Fetching data for month: ${month}, department: ${department}, and FY: ${financialYear}`);
  
  const customers = await getCustomers(department, financialYear, firestore);
  const totalCustomers = customers.length;
  
  const customersKpi: Kpi = {
    label: 'Total Customers',
    value: totalCustomers.toString(),
    description: `in ${department}`,
  };

  const existingKpis = kpis.filter(k => k.label !== 'Total Customers');
  
  // Simple filtering for demonstration. In a real app, this would be more complex.
  const filteredOutstandingByAge = outstandingByAge.filter(item => item.department === department);
  const filteredRegionDistribution = regionDistribution; // Not department-specific in mock data
  const filteredMonthlyTrends = monthlyTrends; // Not department-specific in mock data

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
  // This is a simple simulation. In a real app, you'd filter by region on the backend.
  // For now, we'll return a subset if a region is selected.
  return filteredData.slice(0, 1);
}

/**
 * Fetches the list of all customers from Firestore, filtered by department.
 * @param department - The department to filter by.
 */
export async function getCustomers(department: string, financialYear: string, firestore: Firestore): Promise<Customer[]> {
  console.log(`Fetching customers for department: ${department} and FY: ${financialYear}`);
  const customersCol = collection(firestore, 'customers');
  const customerSnapshot = await getDocs(customersCol);
  const customerList = customerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
  return customerList.filter(c => c.department === department);
}

/**
 * Simulates updating a customer's remark.
 * In a real app, this would be a POST/PUT request to your backend.
 * @param customerId - The ID of the customer to update.
 * @param newRemark - The new remark to set.
 */
export async function updateCustomerRemark(firestore: Firestore, customerId: string, newRemark: Customer['remarks']): Promise<{ success: boolean }> {
  console.log(`Updating remark for customer ${customerId} to "${newRemark}"`);
  const customerRef = doc(firestore, 'customers', customerId);
  await updateDoc(customerRef, { remarks: newRemark });

  const userRole = localStorage.getItem('userRole');
  if (userRole === 'Manager') {
      const customerName = 'Customer ' + customerId; // Simplified for now
      createNotification(firestore, {
          from: { name: 'Manager', role: 'Manager' },
          to: 'Country Manager',
          message: `Manager updated remark for ${customerName} to "${newRemark}".`
      });
  }

  return { success: true };
}

/**
 * Simulates updating a customer's notes.
 * @param customerId - The ID of the customer to update.
 * @param newNotes - The new notes to set.
 */
export async function updateCustomerNotes(firestore: Firestore, customerId: string, newNotes: string): Promise<{ success: boolean }> {
  console.log(`Updating notes for customer ${customerId} to "${newNotes}"`);
  const customerRef = doc(firestore, 'customers', customerId);
  await updateDoc(customerRef, { notes: newNotes });
  
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'Engineer') {
      const customerName = 'Customer ' + customerId; // Simplified for now
      createNotification(firestore, {
          from: { name: 'Engineer', role: 'Engineer' },
          to: 'Manager',
          message: `Engineer added new notes for ${customerName}.`
      });
  }

  return { success: true };
}


/**
 * Processes an uploaded Excel file.
 * In a real app, you might send the file to a backend for processing.
 * Here, we'll process it on the client-side.
 * @param file - The Excel file to process.
 */
export async function processAndUploadFile(firestore: Firestore, file: File, month: string): Promise<{ count: number; data: any[] }> {
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
        
        createNotification(firestore, {
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
export async function updateAssignedEngineer(firestore: Firestore, customerId: string, engineerName: string): Promise<{ success: boolean }> {
    console.log(`Assigning engineer ${engineerName} to customer ${customerId}`);
    const customerRef = doc(firestore, 'customers', customerId);
    await updateDoc(customerRef, { assignedEngineer: engineerName });
    
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'Manager') {
        const customerName = 'Customer ' + customerId;
        createNotification(firestore, {
            from: { name: 'Manager', role: 'Manager' },
            to: 'Country Manager',
            message: `Manager assigned ${engineerName} to ${customerName}.`
        });
    }
    
    return { success: true };
}

/**
 * Simulates updating an invoice's dispute status.
 * @param customerId The customer's code
 * @param invoiceNumber The invoice number
 * @param newStatus The new dispute status
 */
export async function updateInvoiceDisputeStatus(firestore: Firestore, customerId: string, invoiceNumber: string, newStatus: 'dispute' | 'paid' | 'unpaid'): Promise<{ success: boolean }> {
  console.log(`Updating invoice ${invoiceNumber} for customer ${customerId} to status "${newStatus}"`);
  
  const invoiceRef = doc(firestore, 'customers', customerId, 'invoices', invoiceNumber);
  await setDoc(invoiceRef, { status: newStatus }, { merge: true });
  
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
export async function getEngineerPerformanceData(department: string, financialYear: string): Promise<EngineerPerformance[]> {
  await delay(500);
  console.log(`Fetching engineer performance for department: ${department} and FY: ${financialYear}`);
  return engineerPerformance.filter(item => item.department === department);
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

  await delay(1500); // Simulate network delay
  const localImageUrl = URL.createObjectURL(file);
  console.log('Simulated upload complete. Image URL:', localImageUrl);
  return localImageUrl;
}

/**
 * Simulates fetching all users (managers and engineers).
 */
export async function getUsers(firestore: Firestore): Promise<User[]> {
  const usersCol = collection(firestore, 'users');
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  return userList;
}
