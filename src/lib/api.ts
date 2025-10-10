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
import { collection, doc, getDocs, updateDoc, writeBatch, Firestore, getDoc } from 'firebase/firestore';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Fetches dashboard data.
 * In a real app, this would make a network request to a backend API.
 * Here, we simulate it with mock data.
 * @param month - The selected month (for simulation purposes).
 * @param financialYear - The selected financial year.
 */
export async function getDashboardData(month: string, financialYear: string) {
  await delay(500);
  console.log(`Fetching data for month: ${month} and FY: ${financialYear}`);
  
  const totalCustomers = mockCustomers.length;
  
  const customersKpi: Kpi = {
    label: 'Total Customers',
    value: totalCustomers.toString(),
    description: `in Batching Plant`,
  };

  const existingKpis = mockKpis.filter(k => k.label !== 'Total Customers');

  return {
    kpis: [...existingKpis, customersKpi],
    outstandingByAge: mockOutstandingByAge,
    regionDistribution: mockRegionDistribution,
    monthlyTrends: mockMonthlyTrends,
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
 * Fetches the list of all customers from Firestore.
 * @param firestore - The Firestore instance.
 * @param financialYear - The selected financial year (used for logging).
 */
export async function getCustomers(firestore: Firestore, financialYear: string): Promise<Customer[]> {
  console.log(`Fetching customers for FY: ${financialYear} from Firestore`);
  const customersCol = collection(firestore, 'customers');
  const customerSnapshot = await getDocs(customersCol);
  const customerList = customerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
  
  // In a real app, you might fetch subcollections here or on-demand
  return customerList;
}

/**
 * Updates a customer's remark in Firestore.
 * @param firestore - The Firestore instance.
 * @param customerId - The document ID of the customer to update.
 * @param newRemark - The new remark to set.
 */
export async function updateCustomerRemark(firestore: Firestore, customerId: string, newRemark: Customer['remarks']) {
  console.log(`Updating remark for customer ${customerId} to "${newRemark}" in Firestore`);
  const customerDoc = doc(firestore, 'customers', customerId);
  await updateDoc(customerDoc, { remarks: newRemark });
  
  createNotification({
      from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
      to: 'Manager',
      message: `Remark for customer ${customerId} updated to "${newRemark}".`
  });
}

/**
 * Updates a customer's notes in Firestore.
 * @param firestore - The Firestore instance.
 * @param customerId - The document ID of the customer to update.
 * @param newNotes - The new notes to set.
 */
export async function updateCustomerNotes(firestore: Firestore, customerId: string, newNotes: string) {
  console.log(`Updating notes for customer ${customerId} in Firestore`);
  const customerDoc = doc(firestore, 'customers', customerId);
  await updateDoc(customerDoc, { notes: newNotes });

  createNotification({
      from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
      to: 'Manager',
      message: `Notes updated for customer ${customerId}.`
  });
}

/**
 * Processes an uploaded Excel file and uploads the data to Firestore.
 * @param firestore - The Firestore instance.
 * @param file - The Excel file to process.
 * @param month - The month for which data is being uploaded.
 */
export function processAndUploadFile(firestore: Firestore, file: File, month: string): Promise<{ count: number; data: Customer[] }> {
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
        
        const customersData = jsonData as Customer[]; // Type assertion

        // Use a batch write to upload all customers at once
        const batch = writeBatch(firestore);
        customersData.forEach((customer) => {
          const docRef = doc(collection(firestore, 'customers')); // Creates a new doc with auto-ID
          batch.set(docRef, customer);
        });
        
        await batch.commit();
        
        console.log(`Successfully uploaded ${customersData.length} customer records to Firestore.`);
        
        createNotification({
            from: { name: 'System', role: 'System' },
            to: 'all',
            message: `The data sheet for ${month} has been updated with ${customersData.length} customer records.`
        });
        
        resolve({ count: customersData.length, data: customersData });
      } catch (error) {
        console.error("Error processing and uploading file:", error);
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
 * Updates the assigned engineer for a customer in Firestore.
 * @param firestore - The Firestore instance.
 * @param customerId - The document ID of the customer to update.
 * @param engineerName - The name of the engineer to assign.
 */
export async function updateAssignedEngineer(firestore: Firestore, customerId: string, engineerName: string) {
    console.log(`Assigning engineer ${engineerName} to customer ${customerId} in Firestore`);
    const customerDoc = doc(firestore, 'customers', customerId);
    await updateDoc(customerDoc, { assignedEngineer: engineerName });

    createNotification({
        from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
        to: 'Manager',
        message: `Assigned ${engineerName} to customer ${customerId}.`
    });
}

/**
 * Updates an invoice's dispute status in a subcollection in Firestore.
 * @param firestore - The Firestore instance.
 * @param customerId - The document ID of the customer.
 * @param invoiceNumber - The ID of the invoice document.
 * @param newStatus - The new dispute status.
 */
export async function updateInvoiceDisputeStatus(firestore: Firestore, customerId: string, invoiceId: string, newStatus: 'dispute' | 'paid' | 'unpaid') {
  console.log(`Updating invoice ${invoiceId} for customer ${customerId} to status "${newStatus}" in Firestore`);
  const invoiceDocRef = doc(firestore, 'customers', customerId, 'invoices', invoiceId);
  await updateDoc(invoiceDocRef, { status: newStatus });

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
export async function getEngineerPerformanceData(financialYear: string = '2024-2025'): Promise<EngineerPerformance[]> {
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
 * Fetches all users (managers and engineers) from Firestore.
 * @param firestore The Firestore instance.
 */
export async function getUsers(firestore: Firestore): Promise<User[]> {
    console.log(`Fetching users from Firestore`);
    const usersCol = collection(firestore, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    return userList;
}

/**
 * Fetches a single user profile from Firestore by UID.
 * @param firestore The Firestore instance.
 * @param uid The user's UID.
 */
export async function getUserProfile(firestore: Firestore, uid: string): Promise<User | null> {
  const userDocRef = doc(firestore, 'users', uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as User;
  }
  return null;
}
