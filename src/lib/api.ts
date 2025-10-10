
import * as xlsx from 'xlsx';
import {
  kpis,
  regionDistribution,
  monthlyTrends,
  invoiceTrackerData,
  engineers,
  outstandingRecoveryTrend,
  users as mockUsers,
} from './data';
import type { Customer, Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution, InvoiceTrackerData, Engineer, Invoice, OutstandingRecoveryTrend, User } from './types';
import { createNotification } from './notifications';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { initializeFirebase, updateDocumentNonBlocking } from '@/firebase';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


/**
 * Simulates fetching all dashboard data.
 * @param month - The selected month (for simulation purposes).
 * @param department - The selected department.
 */
export async function getDashboardData(month: string, department: string, financialYear: string) {
  await delay(500);
  console.log(`Fetching data for month: ${month}, department: ${department}, and FY: ${financialYear} from ${API_URL}/dashboard`);
  
  const customers = await getCustomers(department, financialYear);
  const totalCustomers = customers.length;
  
  const customersKpi: Kpi = {
    label: 'Total Customers',
    value: totalCustomers.toString(),
    description: `in ${department}`,
  };

  const existingKpis = kpis.filter(k => k.label !== 'Total Customers');
  
  // TODO: This data should be calculated from Firestore as well
  const mockDb = await import('./data');
  const filteredOutstandingByAge = mockDb.outstandingByAge.filter(item => item.department === department);
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
  console.log(`Fetching invoice tracker data for region: ${region}, department: ${department}, and FY: ${financialYear} from ${API_URL}/invoice-tracker`);
  let filteredData = invoiceTrackerData.filter(d => d.department === department);
  if (region === 'All') {
    return filteredData;
  }
  return filteredData.slice(0, 1);
}

/**
 * Fetches the list of all customers from Firestore, filtered by department.
 * @param department - The department to filter by.
 */
export async function getCustomers(department: string, financialYear: string): Promise<Customer[]> {
  console.log(`Fetching customers for department: ${department} and FY: ${financialYear} from Firestore`);
  const { firestore } = initializeFirebase();
  const customersCol = collection(firestore, 'customers');
  const q = query(customersCol, where("department", "==", department));
  
  const customerSnapshot = await getDocs(q);
  const customerList = customerSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Customer));

  // In a real app, you might fetch subcollections concurrently
  for (const customer of customerList) {
    const invoicesCol = collection(firestore, 'customers', customer.id!, 'invoices');
    const invoiceSnapshot = await getDocs(invoicesCol);
    customer.invoices = invoiceSnapshot.docs.map(doc => ({...doc.data(), id: doc.id} as Invoice));
  }

  return customerList;
}

/**
 * Simulates updating a customer's remark.
 * In a real app, this would be a POST/PUT request to your backend.
 * @param customerId - The ID of the customer to update.
 * @param newRemark - The new remark to set.
 */
export function updateCustomerRemark(customerId: string, newRemark: Customer['remarks']) {
  console.log(`Updating remark for customer ${customerId} to "${newRemark}" in Firestore`);
  const { firestore } = initializeFirebase();
  const customerDoc = doc(firestore, 'customers', customerId);
  updateDocumentNonBlocking(customerDoc, { remarks: newRemark });
  
  createNotification({
      from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
      to: 'Manager',
      message: `Remark for customer ${customerId} updated to "${newRemark}".`
  });
}

/**
 * Simulates updating a customer's notes.
 * @param customerId - The ID of the customer to update.
 * @param newNotes - The new notes to set.
 */
export function updateCustomerNotes(customerId: string, newNotes: string) {
  console.log(`Updating notes for customer ${customerId} to "${newNotes}" in Firestore`);
  const { firestore } = initializeFirebase();
  const customerDoc = doc(firestore, 'customers', customerId);
  updateDocumentNonBlocking(customerDoc, { notes: newNotes });
  
  createNotification({
      from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
      to: 'Manager',
      message: `Notes updated for customer ${customerId}.`
  });
}


/**
 * Processes an uploaded Excel file, groups by customer, and simulates an upload.
 * @param file - The Excel file to process.
 */
export function processAndUploadFile(file: File, month: string): Promise<{ count: number; data: any[] }> {
  console.log(`Uploading file to ${API_URL}/upload`);
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
    console.log(`Fetching engineers from ${API_URL}/users`);
    return engineers.filter(e => e.region === region && e.department === department);
}

/**
 * Simulates updating the assigned engineer for a customer.
 * @param customerId - The ID of the customer to update.
 * @param engineerName - The name of the engineer to assign.
 */
export function updateAssignedEngineer(customerId: string, engineerName: string) {
    console.log(`Assigning engineer ${engineerName} to customer ${customerId} in Firestore`);
    const { firestore } = initializeFirebase();
    const customerDoc = doc(firestore, 'customers', customerId);
    updateDocumentNonBlocking(customerDoc, { assignedEngineer: engineerName });
    
    createNotification({
        from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
        to: 'Manager',
        message: `Assigned ${engineerName} to customer ${customerId}.`
    });
}

/**
 * Simulates updating an invoice's dispute status.
 * @param customerId The customer's code
 * @param invoiceNumber The invoice number
 * @param newStatus The new dispute status
 */
export function updateInvoiceDisputeStatus(customerId: string, invoiceNumber: string, newStatus: 'dispute' | 'paid' | 'unpaid') {
  console.log(`Updating invoice ${invoiceNumber} for customer ${customerId} to status "${newStatus}" in Firestore`);
  const { firestore } = initializeFirebase();
  // Note: This requires knowing the invoice ID, which is not ideal.
  // In a real app, you might query for the invoice by invoiceNumber within the customer's subcollection.
  // For this mock, we'll assume we can't directly update it without the ID.
  // A better implementation would be a Cloud Function to handle this update.
  console.warn("Direct invoice subcollection updates from the client are not fully implemented in this mock API.");
  
  createNotification({
      from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
      to: 'Manager',
      message: `Status for invoice ${invoiceNumber} updated to ${newStatus}.`
  });
}

/**
 * Simulates fetching the outstanding vs. recovery trend data.
 * @param department - The department to filter by.
 */
export async function getOutstandingRecoveryTrend(department: string, financialYear: string): Promise<OutstandingRecoveryTrend[]> {
  await delay(500);
  console.log(`Fetching recovery trend for department: ${department} and FY: ${financialYear} from ${API_URL}/dashboard`);
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
  console.log(`Fetching engineer performance for department: ${department} and FY: ${financialYear} from ${API_URL}/dashboard`);
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
    console.log(`Fetching users from Firestore`);
    const { firestore } = initializeFirebase();
    const usersCol = collection(firestore, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
    return userList;
}

