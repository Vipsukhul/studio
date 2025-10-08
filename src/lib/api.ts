'use server';

import { invoiceTrackerData, kpis, monthlyTrends, outstandingByAge, regionDistribution } from './data';

const API_DELAY = 100;

// Mock API functions - auth functions are no longer used.
// These dashboard functions can be replaced with Firestore queries later.

export async function getDashboardData(month?: string) {
  console.log('Fetching dashboard data for month:', month);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        kpis,
        outstandingByAge,
        regionDistribution,
        monthlyTrends
      });
    }, API_DELAY);
  });
};

export async function getInvoiceTrackerData(region?: string) {
    console.log('Fetching invoice tracker data for region:', region);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!region || region === 'All') {
            resolve(invoiceTrackerData)
        } else {
            // In a real app, you'd filter data on the backend.
            // Here's a mock filter.
            const filteredData = invoiceTrackerData.map(d => ({
                ...d,
                previousMonthAmount: d.previousMonthAmount / 4,
                currentMonthAmount: d.currentMonthAmount / 4,
            }))
            resolve(filteredData);
        }
      }, API_DELAY);
    });
  };

// This function is no longer the primary source for the data sheet,
// but can be kept for other purposes or removed.
// The data sheet now fetches directly from Firestore.
export async function getDataSheetData(filters?: { region?: string; customer?: string }) {
    console.log('Fetching data sheet data with filters (from mock):', filters);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([]); // Return empty array as Firestore is the source of truth now
        }, API_DELAY)
    });
};

export async function updateInvoiceStatus(customerId: string, status: any) {
    console.log(`Updating status for customer ${customerId} to ${status}`);
    // This is now handled on the client-side directly with Firestore
    // This function can be removed or adapted if a server-side action is needed.
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'Status updated' });
        }, API_DELAY);
    });
};
