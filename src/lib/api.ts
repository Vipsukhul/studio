
'use server';

import { customers, invoiceTrackerData, kpis, monthlyTrends, outstandingByAge, regionDistribution } from './data';
import type { Customer } from './types';

const API_DELAY = 500;

// Mock API functions
export const login = async (credentials: { email: string; password: string }) => {
  console.log('Logging in with:', credentials.email);
  return new Promise<{ token: string }>((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        resolve({ token: 'mock-jwt-token-for-demo' });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, API_DELAY);
  });
};

export const signup = async (userData: { name: string; email: string; password: string }) => {
  console.log('Signing up with:', userData.email);
  return new Promise<{ token: string }>((resolve, reject) => {
    setTimeout(() => {
      if (userData.email && userData.password && userData.name) {
        resolve({ token: 'mock-jwt-token-for-new-user' });
      } else {
        reject(new Error('Failed to create account'));
      }
    }, API_DELAY);
  });
};

export const getDashboardData = async (month?: string) => {
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

export const getInvoiceTrackerData = async (region?: string) => {
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

export const getDataSheetData = async (filters?: { region?: string; customer?: string }) => {
    console.log('Fetching data sheet data with filters:', filters);
    return new Promise<Customer[]>((resolve) => {
        setTimeout(() => {
            resolve(customers);
        }, API_DELAY);
    });
};

export const uploadExcel = async (formData: FormData) => {
    console.log('Uploading file for month:', formData.get('month'));
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'Data uploaded successfully' });
        }, API_DELAY + 1000);
    });
};

export const updateInvoiceStatus = async (customerId: string, status: Customer['remarks']) => {
    console.log(`Updating status for customer ${customerId} to ${status}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'Status updated' });
        }, API_DELAY);
    });
};
