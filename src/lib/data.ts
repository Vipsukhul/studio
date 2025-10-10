import { Customer, InvoiceTrackerData, Kpi, MonthlyTrend, OutstandingByAge, RegionDistribution, Engineer, Invoice, OutstandingRecoveryTrend, LogEntry, EngineerPerformance, User } from './types';

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
    value: '50',
    description: 'active accounts',
  },
];

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

export const outstandingRecoveryTrend: OutstandingRecoveryTrend[] = [
  { month: 'Jan-24', new: 1800000, recovered: 1500000 },
  { month: 'Feb-24', new: 1650000, recovered: 1700000 },
  { month: 'Mar-24', new: 2100000, recovered: 1800000 },
  { month: 'Apr-24', new: 1900000, recovered: 2000000 },
  { month: 'May-24', new: 2200000, recovered: 1950000 },
  { month: 'Jun-24', new: 2050000, recovered: 2150000 },
];


const generateInvoices = (count: number, status: 'paid' | 'unpaid' | 'dispute'): Invoice[] => {
    return Array.from({ length: count }, (_, i) => ({
        invoiceNumber: `INV-${Math.floor(Math.random() * 90000) + 10000}`,
        invoiceAmount: Math.floor(Math.random() * 50000) + 5000,
        invoiceDate: new Date(new Date().getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: status,
    }));
};

const customerNames = [
    "Apex Innovations", "Zenith Solutions", "Pinnacle Corp", "Quantum Industries", "Stellar Tech",
    "Fusion Dynamics", "Nexus Enterprises", "Momentum Inc", "Catalyst Co", "Synergy Group",
    "Vertex Ventures", "Matrix Systems", "Orion Services", "Helios Ltd", "Aegis Corp",
    "Nova Solutions", "Echo Enterprises", "Trident Tech", "Polaris Inc", "Equinox Corp",
    "Atlas Industries", "Crestwood Group", "Meridian Systems", "Omega Solutions", "Vanguard Ltd",
    "Horizon Corp", "Alpha Tech", "Summit Systems", "Cascade Inc", "Spire Solutions",
    "Core Dynamics", "Blue-sky Corp", "Axiom Enterprises", "Elevate Ltd", "Frontier Tech",
    "Global Reach", "Keystone Corp", "Landmark Ltd", "Milestone Inc", "New-age Solutions",
    "Next-level Corp", "Open-sky Inc", "Peak Performance", "Prime Time Ltd", "Progressive Inc",
    "Red-wood Corp", "River-stone Inc", "Silver-lining Ltd", "Sky-high Inc", "Solid-state Solutions"
];

const regions = ['North', 'South', 'East', 'West'] as const;
const agePeriods = ['0-30', '31-90', '91-180', '181-365', '>365'] as const;
const remarksOptions = ['none', 'under follow-up', 'dispute', 'partial payment', 'payment received'] as const;
const engineersByRegion = {
    North: ['R. Sharma', 'S. Gupta'],
    South: ['S. Iyer', 'K. Rao'],
    East: ['A. Das', 'B. Chatterjee'],
    West: ['P. Patel', 'V. Mehta']
};

export const customers: Customer[] = Array.from({ length: 50 }, (_, i) => {
    const region = regions[i % regions.length];
    const assignedEngineers = engineersByRegion[region];
    const assignedEngineer = assignedEngineers[i % assignedEngineers.length];
    
    return {
        customerCode: `CUST${(i + 1).toString().padStart(3, '0')}`,
        customerName: customerNames[i % customerNames.length],
        region: region,
        agePeriod: agePeriods[i % agePeriods.length],
        outstandingAmount: Math.floor(Math.random() * 400000) + 20000,
        invoices: generateInvoices(Math.floor(Math.random() * 4) + 1, 'unpaid'),
        remarks: remarksOptions[i % remarksOptions.length],
        notes: i % 5 === 0 ? `Follow up on invoice #${Math.floor(Math.random() * 1000)}` : '',
        assignedEngineer: assignedEngineer,
    };
});

const generateOutstandingByAge = (customers: Customer[]): OutstandingByAge[] => {
    const result: { [key: string]: OutstandingByAge } = {};

    customers.forEach(customer => {
        const key = `${customer.region}`;
        if (!result[key]) {
            result[key] = {
                region: customer.region,
                '0-30': 0,
                '31-90': 0,
                '91-180': 0,
                '181-365': 0,
                '>365': 0,
                total: 0
            };
        }

        const agePeriod = customer.agePeriod || '0-30';
        const amount = customer.outstandingAmount || 0;

        if (agePeriods.includes(agePeriod)) {
            result[key][agePeriod] += amount;
            result[key].total += amount;
        }
    });

    return Object.values(result);
};

export const outstandingByAge: OutstandingByAge[] = generateOutstandingByAge(customers);

export const regionDistribution: RegionDistribution[] = outstandingByAge.reduce((acc, curr) => {
    const existing = acc.find(item => item.region === curr.region);
    if (existing) {
        existing.amount += curr.total;
    } else {
        acc.push({ region: curr.region, amount: curr.total });
    }
    return acc;
}, [] as RegionDistribution[]);


export const financialYearOptions = [
    { value: '2025-2026', label: 'FY 2025-26' },
    { value: '2024-2025', label: 'FY 2024-25' },
    { value: '2023-2024', label: 'FY 2023-24' },
    { value: '2022-2023', label: 'FY 2022-23' },
];

export function generateMonthOptions(financialYear: string) {
  const [startYear, endYear] = financialYear.split('-').map(Number);
  const shortEndYear = endYear % 100;
  const shortStartYear = startYear % 100;

  const months = [
    { value: `Apr-${shortStartYear}`, label: `Apr-${shortStartYear}` },
    { value: `May-${shortStartYear}`, label: `May-${shortStartYear}` },
    { value: `Jun-${shortStartYear}`, label: `Jun-${shortStartYear}` },
    { value: `Jul-${shortStartYear}`, label: `Jul-${shortStartYear}` },
    { value: `Aug-${shortStartYear}`, label: `Aug-${shortStartYear}` },
    { value: `Sep-${shortStartYear}`, label: `Sep-${shortStartYear}` },
    { value: `Oct-${shortStartYear}`, label: `Oct-${shortStartYear}` },
    { value: `Nov-${shortStartYear}`, label: `Nov-${shortStartYear}` },
    { value: `Dec-${shortStartYear}`, label: `Dec-${shortStartYear}` },
    { value: `Jan-${shortEndYear}`, label: `Jan-${shortEndYear}` },
    { value: `Feb-${shortEndYear}`, label: `Feb-${shortEndYear}` },
    { value: `Mar-${shortEndYear}`, label: `Mar-${shortEndYear}` },
  ];
  return months;
};


export const regionOptions = [
    { value: 'All', label: 'All Regions' },
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' },
];

export const engineers: Engineer[] = [
    { id: 'ENG01', name: 'R. Sharma', region: 'North' },
    { id: 'ENG02', name: 'S. Gupta', region: 'North' },
    { id: 'ENG03', name: 'S. Iyer', region: 'South' },
    { id: 'ENG04', name: 'K. Rao', region: 'South' },
    { id: 'ENG05', name: 'A. Das', region: 'East' },
    { id: 'ENG06', name: 'B. Chatterjee', region: 'East' },
    { id: 'ENG07', name: 'P. Patel', region: 'West' },
    { id: 'ENG08', name: 'V. Mehta', region: 'West' },
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
    { name: 'R. Sharma', region: 'North', outstandingCollected: 450000, newOutstandingAssigned: 320000, netChange: 130000 },
    { name: 'S. Gupta', region: 'North', outstandingCollected: 380000, newOutstandingAssigned: 410000, netChange: -30000 },
    { name: 'S. Iyer', region: 'South', outstandingCollected: 520000, newOutstandingAssigned: 280000, netChange: 240000 },
    { name: 'K. Rao', region: 'South', outstandingCollected: 410000, newOutstandingAssigned: 390000, netChange: 20000 },
    { name: 'A. Das', region: 'East', outstandingCollected: 290000, newOutstandingAssigned: 310000, netChange: -20000 },
    { name: 'B. Chatterjee', region: 'East', outstandingCollected: 330000, newOutstandingAssigned: 290000, netChange: 40000 },
    { name: 'P. Patel', region: 'West', outstandingCollected: 610000, newOutstandingAssigned: 450000, netChange: 160000 },
    { name: 'V. Mehta', region: 'West', outstandingCollected: 580000, newOutstandingAssigned: 510000, netChange: 70000 },
];

export const users: User[] = [
    // North Region
    { id: 'MGR01', name: 'Anjali Verma', email: 'anjali.verma@example.com', role: 'Manager', region: 'North', contact: '9876543210' },
    { id: 'ENG01', name: 'R. Sharma', email: 'r.sharma@example.com', role: 'Engineer', region: 'North', contact: '9876543211' },
    { id: 'ENG02', name: 'S. Gupta', email: 's.gupta@example.com', role: 'Engineer', region: 'North', contact: '9876543212' },
    // South Region
    { id: 'MGR02', name: 'Baskar Sundaram', email: 'baskar.s@example.com', role: 'Manager', region: 'South', contact: '9876543213' },
    { id: 'ENG03', name: 'S. Iyer', email: 's.iyer@example.com', role: 'Engineer', region: 'South', contact: '9876543214' },
    { id: 'ENG04', name: 'K. Rao', email: 'k.rao@example.com', role: 'Engineer', region: 'South', contact: '9876543215' },
    // East Region
    { id: 'MGR03', name: 'Priya Das', email: 'priya.das@example.com', role: 'Manager', region: 'East', contact: '9876543216' },
    { id: 'ENG05', name: 'A. Das', email: 'a.das@example.com', role: 'Engineer', region: 'East', contact: '9876543217' },
    { id: 'ENG06', name: 'B. Chatterjee', email: 'b.chatterjee@example.com', role: 'Engineer', region: 'East', contact: '9876543218' },
    // West Region
    { id: 'MGR04', name: 'Rajesh Patil', email: 'rajesh.patil@example.com', role: 'Manager', region: 'West', contact: '9876543219' },
    { id: 'ENG07', name: 'P. Patel', email: 'p.patel@example.com', role: 'Engineer', region: 'West', contact: '9876543220' },
    { id: 'ENG08', name: 'V. Mehta', email: 'v.mehta@example.com', role: 'Engineer', region: 'West', contact: '9876543221' },
];
