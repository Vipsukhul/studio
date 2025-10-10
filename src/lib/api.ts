
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
import { Firestore, collection, getDocs, doc, updateDoc, setDoc, writeBatch } from 'firebase/firestore';

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
  const customerList: Customer[] = [];

  for (const customerDoc of customerSnapshot.docs) {
    const customerData = { id: customerDoc.id, ...customerDoc.data() } as Customer;
    if (customerData.department === department) {
        const invoicesCol = collection(firestore, 'customers', customerDoc.id, 'invoices');
        const invoicesSnapshot = await getDocs(invoicesCol);
        customerData.invoices = invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
        customerList.push(customerData);
    }
  }
  return customerList;
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
export async function updateCustomerNotes(firestore: Firestore, customerId: string, newNotes: string): Promise<{ success: boolean }> {
  console.log(`Updating notes for customer ${customerId} to "${newNotes}"`);
  const customerRef = doc(firestore, 'customers', customerId);
  await updateDoc(customerRef, { notes: newNotes });
  
  createNotification({
      from: { name: 'User', role: localStorage.getItem('userRole') || 'User' },
      to: 'Manager',
      message: `Notes updated for customer ${customerId}.`
  });

  return { success: true };
}


/**
 * Processes an uploaded Excel file, groups by customer, and saves the aggregated data to Firestore.
 * @param file - The Excel file to process.
 */
export async function processAndUploadFile(firestore: Firestore, file: File, month: string): Promise<{ count: number; data: any[] }> {
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
        
        // Group rows by customer code
        const customersDataMap = new Map<string, { customer: Partial<Customer>, invoices: Partial<Invoice>[] }>();

        jsonData.forEach(row => {
            const customerCode = row.customerCode || row['Customer Code'];
            if (!customerCode) return;

            const codeStr = customerCode.toString();
            if (!customersDataMap.has(codeStr)) {
                customersDataMap.set(codeStr, {
                    customer: {
                        customerCode: codeStr,
                        customerName: row.customerName || row['Customer Name'],
                        region: row.region || row['Region'],
                        department: row.department || row['Department'],
                        outstandingAmount: 0, // Will be calculated
                    },
                    invoices: []
                });
            }

            const current = customersDataMap.get(codeStr)!;
            const outstandingAmount = parseFloat(row.outstandingAmount || row['Outstanding Amount'] || 0);
            
            // Add to total outstanding
            current.customer.outstandingAmount! += outstandingAmount;

            // Add invoice if invoiceNumber is present
            const invoiceNumber = row.invoiceNumber || row['Invoice Number'];
            if (invoiceNumber) {
                current.invoices.push({
                    invoiceNumber: invoiceNumber.toString(),
                    invoiceAmount: outstandingAmount,
                    invoiceDate: row.invoiceDate ? new Date(row.invoiceDate).toISOString() : new Date().toISOString(),
                    status: row.status || 'unpaid',
                });
            }
        });

        const batch = writeBatch(firestore);

        for (const [code, data] of customersDataMap.entries()) {
            const customerRef = doc(firestore, 'customers', code);
            batch.set(customerRef, data.customer, { merge: true });

            data.invoices.forEach(invoice => {
                if (invoice.invoiceNumber) {
                    const invoiceRef = doc(firestore, 'customers', code, 'invoices', invoice.invoiceNumber);
                    batch.set(invoiceRef, invoice, { merge: true });
                }
            });
        }
        
        await batch.commit();

        createNotification({
            from: { name: 'System', role: 'System' },
            to: 'all',
            message: `The data sheet for ${month} has been updated with ${customersDataMap.size} customer records.`
        });
        
        resolve({ count: customersDataMap.size, data: Array.from(customersDataMap.values()) });
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
export async function updateAssignedEngineer(firestore: Firestore, customerId: string, engineerName: string): Promise<{ success: boolean }> {
    console.log(`Assigning engineer ${engineerName} to customer ${customerId}`);
    const customerRef = doc(firestore, 'customers', customerId);
    await updateDoc(customerRef, { assignedEngineer: engineerName });
    
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
export async function updateInvoiceDisputeStatus(firestore: Firestore, customerId: string, invoiceNumber: string, newStatus: 'dispute' | 'paid' | 'unpaid'): Promise<{ success: boolean }> {
  console.log(`Updating invoice ${invoiceNumber} for customer ${customerId} to status "${newStatus}"`);
  
  const invoiceRef = doc(firestore, 'customers', customerId, 'invoices', invoiceNumber);
  await setDoc(invoiceRef, { status: newStatus }, { merge: true });
  
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
