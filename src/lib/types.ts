export interface Outstanding {
  id?: string;
  invoiceId?: string;
  month: string;
  amount: number;
  agePeriod: string;
}

export interface Invoice {
  id?: string;
  customerId?: string;
  invoiceNumber: string;
  invoiceAmount: number;
  invoiceDate: string; // ISO date string
  status: 'paid' | 'unpaid' | 'dispute';
  outstandings?: Outstanding[]; // Optional, might not be loaded initially
}

export interface Customer {
  id?: string; // Document ID from Firestore
  customerCode: string;
  customerName: string;
  region: string;
  agePeriod?: '0-30' | '31-90' | '91-180' | '181-365' | '>365';
  outstandingAmount?: number;
  invoices?: Invoice[]; // Optional, as they are a subcollection
  remarks?: 'payment received' | 'partial payment' | 'under follow-up' | 'dispute' | 'write-off' | 'none';
  notes?: string;
  assignedEngineer?: string;
}

export interface Kpi {
  label: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  description: string;
}

export interface OutstandingByAge {
  region: string;
  '0-30': number;
  '31-90': number;
  '91-180': number;
  '181-365': number;
  '>365': number;
  total: number;
}

export interface RegionDistribution {
  region: string;
  amount: number;
}

export interface MonthlyTrend {
  month: string;
  [region: string]: number | string;
}

export interface InvoiceTrackerData {
  monthYear: string;
  previousMonthInvoices: number;
  previousMonthAmount: number;
  currentMonthInvoices: number;
  currentMonthAmount: number;
  invoiceCountChange: number;
  disputedInvoices: number;
}

export interface Engineer {
  id: string;
  name: string;
  region: 'North' | 'South' | 'East' | 'West';
}

export interface OutstandingRecoveryTrend {
  month: string;
  new: number;
  recovered: number;
}

export interface LogEntry {
  id: number;
  level: 'INFO' | 'WARN' | 'ERROR';
  timestamp: string;
  message: string;
  source: string;
}

export interface EngineerPerformance {
  name: string;
  region: string;
  outstandingCollected: number;
  newOutstandingAssigned: number;
  netChange: number;
}

export interface Notification {
  id?: string;
  from: {
    name: string;
    role: string;
  };
  to: string; // "all", "Manager", "Country Manager"
  message: string;
  timestamp: string; // ISO string
  isRead: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Manager' | 'Engineer' | 'Country Manager' | 'Admin';
  region: 'North' | 'South' | 'East' | 'West';
  contact: string;
  photoURL?: string;
}
