export interface Invoice {
  invoiceNumber: string;
  invoiceAmount: number;
  invoiceDate: string; // ISO date string
  status: 'paid' | 'unpaid' | 'dispute';
}

export interface Customer {
  id?: string; // Document ID from Firestore, optional on creation
  customerCode: string;
  customerName: string;
  region: string;
  agePeriod: '0-30' | '31-90' | '91-180' | '181-365' | '>365';
  outstandingAmount: number;
  invoices: Invoice[];
  remarks: 'payment received' | 'partial payment' | 'under follow-up' | 'dispute' | 'write-off' | 'none';
  notes: string;
  assignedEngineer: string;
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
