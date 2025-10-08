import { Customer, InvoiceTrackerData, Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution } from './types';

export const kpis: Kpi[] = [
  {
    label: 'Total Outstanding',
    value: '₹1,23,45,678',
    change: '+5.2%',
    changeType: 'increase',
    description: 'vs. last month',
  },
  {
    label: 'New Outstanding',
    value: '₹18,90,123',
    change: '-1.8%',
    changeType: 'decrease',
    description: 'in this period',
  },
  {
    label: 'Recovered Amount',
    value: '₹25,40,500',
    change: '+12.1%',
    changeType: 'increase',
    description: 'cleared this month',
  },
  {
    label: 'Cleared Invoices',
    value: '142',
    change: '+8',
    changeType: 'increase',
    description: 'vs. new disputed',
  },
];

export const outstandingByAge: OutstandingByAge[] = [
  { region: 'North', '0-30': 350000, '31-90': 220000, '91-180': 150000, '181-365': 80000, '>365': 45000, total: 845000 },
  { region: 'South', '0-30': 420000, '31-90': 280000, '91-180': 180000, '181-365': 100000, '>365': 60000, total: 1040000 },
  { region: 'East', '0-30': 280000, '31-90': 180000, '91-180': 120000, '181-365': 60000, '>365': 30000, total: 670000 },
  { region: 'West', '0-30': 510000, '31-90': 320000, '91-180': 210000, '181-365': 120000, '>365': 70000, total: 1230000 },
];

export const regionDistribution: RegionDistribution[] = outstandingByAge.map(d => ({ region: d.region, amount: d.total }));

export const monthlyTrends: MonthlyTrend[] = [
    { month: 'Jan-24', North: 4000, West: 2400, South: 2400, East: 1800 },
    { month: 'Feb-24', North: 3000, West: 1398, South: 2210, East: 2000 },
    { month: 'Mar-24', North: 2000, West: 9800, South: 2290, East: 2100 },
    { month: 'Apr-24', North: 2780, West: 3908, South: 2000, East: 2300 },
    { month: 'May-24', North: 1890, West: 4800, South: 2181, East: 2500 },
    { month: 'Jun-24', North: 2390, West: 3800, South: 2500, East: 2600 },
];

export const invoiceTrackerData: InvoiceTrackerData[] = [
    { monthYear: 'Apr-25', previousMonthInvoices: 520, previousMonthAmount: 9800000, currentMonthInvoices: 540, currentMonthAmount: 10200000, invoiceCountChange: 20, disputedInvoices: 15 },
    { monthYear: 'Mar-25', previousMonthInvoices: 510, previousMonthAmount: 9500000, currentMonthInvoices: 520, currentMonthAmount: 9800000, invoiceCountChange: 10, disputedInvoices: 12 },
    { monthYear: 'Feb-25', previousMonthInvoices: 500, previousMonthAmount: 9200000, currentMonthInvoices: 510, currentMonthAmount: 9500000, invoiceCountChange: 10, disputedInvoices: 10 },
];

const generateInvoices = (count: number, status: 'paid' | 'unpaid' | 'dispute'): Invoice[] => {
    return Array.from({ length: count }, (_, i) => ({
        invoiceNumber: `INV-${Math.floor(Math.random() * 90000) + 10000}`,
        invoiceAmount: Math.floor(Math.random() * 50000) + 5000,
        invoiceDate: new Date(new Date().getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: status,
    }));
};

export const customers: Customer[] = [
    { customerCode: 'CUST001', customerName: 'Apex Innovations', region: 'North', agePeriod: '31-90', outstandingAmount: 125000, invoices: generateInvoices(3, 'unpaid'), remarks: 'none', notes: '', assignedEngineer: 'R. Sharma' },
    { customerCode: 'CUST002', customerName: 'Zenith Solutions', region: 'West', agePeriod: '0-30', outstandingAmount: 78000, invoices: generateInvoices(2, 'unpaid'), remarks: 'under follow-up', notes: 'Call next week', assignedEngineer: 'P. Patel' },
    { customerCode: 'CUST003', customerName: 'Pinnacle Corp', region: 'South', agePeriod: '91-180', outstandingAmount: 240000, invoices: generateInvoices(5, 'unpaid'), remarks: 'dispute', notes: 'Quality issue on item #45', assignedEngineer: 'S. Iyer' },
    { customerCode: 'CUST004', customerName: 'Quantum Industries', region: 'East', agePeriod: '>365', outstandingAmount: 35000, invoices: generateInvoices(1, 'dispute'), remarks: 'none', notes: '', assignedEngineer: 'A. Das' },
    { customerCode: 'CUST005', customerName: 'Stellar Tech', region: 'West', agePeriod: '31-90', outstandingAmount: 150000, invoices: generateInvoices(4, 'unpaid'), remarks: 'partial payment', notes: 'Paid 50k on 15th', assignedEngineer: 'P. Patel' },
    { customerCode: 'CUST006', customerName: 'Fusion Dynamics', region: 'North', agePeriod: '0-30', outstandingAmount: 45000, invoices: generateInvoices(1, 'unpaid'), remarks: 'payment received', notes: 'Full payment received', assignedEngineer: 'R. Sharma' },
    { customerCode: 'CUST007', customerName: 'Nexus Enterprises', region: 'South', agePeriod: '181-365', outstandingAmount: 95000, invoices: generateInvoices(2, 'unpaid'), remarks: 'under follow-up', notes: '', assignedEngineer: 'S. Iyer' },
];

export const monthOptions = [
    { value: 'Apr-25', label: 'April 2025' },
    { value: 'May-25', label: 'May 2025' },
    { value: 'Jun-25', label: 'June 2025' },
    { value: 'Jul-25', label: 'July 2025' },
];

export const regionOptions = [
    { value: 'All', label: 'All Regions' },
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' },
];
