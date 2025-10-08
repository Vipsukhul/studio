
'use server';

import { customers, invoiceTrackerData, kpis, monthlyTrends, outstandingByAge, regionDistribution } from './data';
import type { Customer } from './types';
import * as xlsx from 'xlsx';

const API_DELAY = 100;

// Mock API functions
export async function login(credentials: { email: string; password: string }) {
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

export async function signup(userData: { name: string; email: string; password: string }) {
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

export async function getDataSheetData(filters?: { region?: string; customer?: string }) {
    console.log('Fetching data sheet data with filters:', filters);
    // This now reads from the in-memory store which is updated by the upload endpoint
    try {
        const response = await fetch('http://localhost:9002/api/upload', { cache: 'no-store' });
        if (!response.ok) {
          console.error("Failed to fetch data from in-memory store, returning empty array");
          return [];
        }
        const { data } = await response.json();
        return data || [];
    } catch (error) {
        console.error("Error fetching data sheet data:", error);
        return [];
    }
};

export async function updateInvoiceStatus(customerId: string, status: Customer['remarks']) {
    console.log(`Updating status for customer ${customerId} to ${status}`);
    // This is a mock. In a real DB, you'd perform an update.
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'Status updated' });
        }, API_DELAY);
    });
};
