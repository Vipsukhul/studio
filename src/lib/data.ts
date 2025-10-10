import { Customer, InvoiceTrackerData, Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution, Engineer, Invoice, OutstandingRecoveryTrend, LogEntry, EngineerPerformance } from './types';

export const kpis: Kpi[] = [
  {
    label: 'Total Outstanding',
    value: '₹1,23,45,678',
    change: '+5.2%',
    changeType: 'increase',
    description: 'vs. last month',
  },
  {
    label: 'Recovered Amount',
    value: '₹25,40,500',
    change: '+12.1%',
    changeType: 'increase',
    description: 'cleared this month',
  },
  {
    label: 'New Outstanding',
    value: '₹15,00,000',
    change: '+8.5%',
    changeType: 'increase',
    description: 'this month',
  },
  {
    label: 'Total Invoices',
    value: '540',
    change: '+20',
    changeType: 'increase',
    description: 'from last month',
  },
  {
    label: 'Disputed Invoices',
    value: '15',
    change: '+3',
    changeType: 'increase',
    description: 'currently active',
  },
  {
    label: 'Total Customers',
    value: '7',
    description: 'active accounts',
  },
];

export const outstandingByAge: OutstandingByAge[] = [
  { region: 'North', department: 'Batching Plant', '0-30': 350000, '31-90': 220000, '91-180': 150000, '181-365': 80000, '>365': 45000, total: 845000 },
  { region: 'South', department: 'Batching Plant', '0-30': 420000, '31-90': 280000, '91-180': 180000, '181-365': 100000, '>365': 60000, total: 1040000 },
  { region: 'East', department: 'Pump', '0-30': 280000, '31-90': 180000, '91-180': 120000, '181-365': 60000, '>365': 30000, total: 670000 },
  { region: 'West', department: 'Pump', '0-30': 510000, '31-90': 320000, '91-180': 210000, '181-365': 120000, '>365': 70000, total: 1230000 },
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
    { monthYear: 'Apr-25', department: 'Batching Plant', previousMonthInvoices: 520, previousMonthAmount: 9800000, currentMonthInvoices: 540, currentMonthAmount: 10200000, invoiceCountChange: 20, disputedInvoices: 15 },
    { monthYear: 'Mar-25', department: 'Batching Plant', previousMonthInvoices: 510, previousMonthAmount: 9500000, currentMonthInvoices: 520, currentMonthAmount: 9800000, invoiceCountChange: 10, disputedInvoices: 12 },
    { monthYear: 'Feb-25', department: 'Pump', previousMonthInvoices: 500, previousMonthAmount: 9200000, currentMonthInvoices: 510, currentMonthAmount: 9500000, invoiceCountChange: 10, disputedInvoices: 10 },
];

export const outstandingRecoveryTrend: OutstandingRecoveryTrend[] = [
  { month: 'Jan-24', department: 'Batching Plant', new: 1800000, recovered: 1500000 },
  { month: 'Feb-24', department: 'Batching Plant', new: 1650000, recovered: 1700000 },
  { month: 'Mar-24', department: 'Pump', new: 2100000, recovered: 1800000 },
  { month: 'Apr-24', department: 'Pump', new: 1900000, recovered: 2000000 },
  { month: 'May-24', department: 'Batching Plant', new: 2200000, recovered: 1950000 },
  { month: 'Jun-24', department: 'Pump', new: 2050000, recovered: 2150000 },
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
    { customerCode: 'CUST001', customerName: 'Apex Innovations', region: 'North', department: 'Batching Plant', agePeriod: '31-90', outstandingAmount: 125000, invoices: generateInvoices(3, 'unpaid'), remarks: 'none', notes: '', assignedEngineer: 'R. Sharma' },
    { customerCode: 'CUST002', customerName: 'Zenith Solutions', region: 'West', department: 'Pump', agePeriod: '0-30', outstandingAmount: 78000, invoices: generateInvoices(2, 'unpaid'), remarks: 'under follow-up', notes: 'Call next week', assignedEngineer: 'P. Patel' },
    { customerCode: 'CUST003', customerName: 'Pinnacle Corp', region: 'South', department: 'Batching Plant', agePeriod: '91-180', outstandingAmount: 240000, invoices: generateInvoices(5, 'unpaid'), remarks: 'dispute', notes: 'Quality issue on item #45', assignedEngineer: 'S. Iyer' },
    { customerCode: 'CUST004', customerName: 'Quantum Industries', region: 'East', department: 'Pump', agePeriod: '>365', outstandingAmount: 35000, invoices: generateInvoices(1, 'dispute'), remarks: 'none', notes: '', assignedEngineer: 'A. Das' },
    { customerCode: 'CUST005', customerName: 'Stellar Tech', region: 'West', department: 'Pump', agePeriod: '31-90', outstandingAmount: 150000, invoices: generateInvoices(4, 'unpaid'), remarks: 'partial payment', notes: 'Paid 50k on 15th', assignedEngineer: 'V. Mehta' },
    { customerCode: 'CUST006', customerName: 'Fusion Dynamics', region: 'North', department: 'Batching Plant', agePeriod: '0-30', outstandingAmount: 45000, invoices: generateInvoices(1, 'unpaid'), remarks: 'payment received', notes: 'Full payment received', assignedEngineer: 'S. Gupta' },
    { customerCode: 'CUST007', customerName: 'Nexus Enterprises', region: 'South', department: 'Batching Plant', agePeriod: '181-365', outstandingAmount: 95000, invoices: generateInvoices(2, 'unpaid'), remarks: 'under follow-up', notes: '', assignedEngineer: 'K. Rao' },
];

export const monthOptions = [
    { value: 'Apr-25', label: 'April 2025' },
    { value: 'May-25', label: 'May 2025' },
    { value: 'Jun-25', label: 'June 2025' },
    { value: 'Jul-25', label: 'July 2025' },
];

export const financialYearOptions = [
    { value: '2024-2025', label: 'FY 2024-25' },
    { value: '2023-2024', label: 'FY 2023-24' },
    { value: '2022-2023', label: 'FY 2022-23' },
];

export const regionOptions = [
    { value: 'All', label: 'All Regions' },
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' },
];

export const departmentOptions = [
    { value: 'Batching Plant', label: 'Batching Plant' },
    { value: 'Pump', label: 'Pump' },
];

export const engineers: Engineer[] = [
    { id: 'ENG01', name: 'R. Sharma', region: 'North', department: 'Batching Plant' },
    { id: 'ENG02', name: 'S. Gupta', region: 'North', department: 'Batching Plant' },
    { id: 'ENG03', name: 'S. Iyer', region: 'South', department: 'Pump' },
    { id: 'ENG04', name: 'K. Rao', region: 'South', department: 'Batching Plant' },
    { id: 'ENG05', name: 'A. Das', region: 'East', department: 'Pump' },
    { id: 'ENG06', name: 'B. Chatterjee', region: 'East', department: 'Pump' },
    { id: 'ENG07', name: 'P. Patel', region: 'West', department: 'Pump' },
    { id: 'ENG08', name: 'V. Mehta', region: 'West', department: 'Pump' },
];

export const logs: LogEntry[] = [
  { id: 1, level: 'ERROR', timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(), message: 'Failed to process payment for invoice INV-78901: Connection timed out', source: 'BillingService' },
  { id: 2, level: 'WARN', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), message: 'API response time from external vendor exceeded 500ms', source: 'APIMonitor' },
  { id: 3, level: 'INFO', timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(), message: 'User admin@example.com logged in successfully', source: 'AuthService' },
  { id: 4, level: 'INFO', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), message: 'Data export for "May-25" completed by user manager@example.com', source: 'DataExport' },
  { id: 5, level: 'ERROR', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), message: 'Database connection failed: Authentication error', source: 'DBConnector' },
  { id: 6, level: 'WARN', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), message: 'Disk space is nearing capacity (92% used)', source: 'SystemMonitor' },
  { id: 7, level: 'INFO', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), message: 'New user "test.user@example.com" was created', source: 'UserManagement' },
  { id: 8, level: 'ERROR', timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), message: 'Failed to send email notification for overdue invoices', source: 'NotificationService' },
  { id: 9, level: 'INFO', timestamp: new Date(Date.now() - 3600000 * 7).toISOString(), message: 'System backup started', source: 'BackupService' },
];

export const engineerPerformance: EngineerPerformance[] = [
    { name: 'R. Sharma', region: 'North', department: 'Batching Plant', outstandingCollected: 450000, newOutstandingAssigned: 320000, netChange: 130000 },
    { name: 'S. Gupta', region: 'North', department: 'Batching Plant', outstandingCollected: 380000, newOutstandingAssigned: 410000, netChange: -30000 },
    { name: 'S. Iyer', region: 'South', department: 'Pump', outstandingCollected: 520000, newOutstandingAssigned: 280000, netChange: 240000 },
    { name: 'K. Rao', region: 'South', department: 'Batching Plant', outstandingCollected: 410000, newOutstandingAssigned: 390000, netChange: 20000 },
    { name: 'A. Das', region: 'East', department: 'Pump', outstandingCollected: 290000, newOutstandingAssigned: 310000, netChange: -20000 },
    { name: 'B. Chatterjee', region: 'East', department: 'Pump', outstandingCollected: 330000, newOutstandingAssigned: 290000, netChange: 40000 },
    { name: 'P. Patel', region: 'West', department: 'Pump', outstandingCollected: 610000, newOutstandingAssigned: 450000, netChange: 160000 },
    { name: 'V. Mehta', region: 'West', department: 'Pump', outstandingCollected: 580000, newOutstandingAssigned: 510000, netChange: 70000 },
];
