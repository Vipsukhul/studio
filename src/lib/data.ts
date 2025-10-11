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
    { month: 'Jan-24', ahmedabad: 400, banglore: 240, chennai: 240, delhi: 180, pune: 300, kolkata: 200, mumbai: 500, jaipur: 150 },
    { month: 'Feb-24', ahmedabad: 300, banglore: 139, chennai: 221, delhi: 200, pune: 280, kolkata: 180, mumbai: 450, jaipur: 130 },
    { month: 'Mar-24', ahmedabad: 200, banglore: 980, chennai: 229, delhi: 210, pune: 320, kolkata: 210, mumbai: 520, jaipur: 160 },
    { month: 'Apr-24', ahmedabad: 278, banglore: 390, chennai: 200, delhi: 230, pune: 310, kolkata: 220, mumbai: 480, jaipur: 140 },
    { month: 'May-24', ahmedabad: 189, banglore: 480, chennai: 218, delhi: 250, pune: 290, kolkata: 230, mumbai: 490, jaipur: 170 },
    { month: 'Jun-24', ahmedabad: 239, banglore: 380, chennai: 250, delhi: 260, pune: 350, kolkata: 240, mumbai: 510, jaipur: 180 },
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

const regions = ['ahmedabad','banglore','chennai','delhi','export','goa','hyderabad','indore','jaipur','kolkata','mumbai','nagpur','odisha','pune','punjab','raipur','vizag','wie'] as const;
const agePeriods = ['0-30', '31-90', '91-180', '181-365', '>365'] as const;
const remarksOptions = ['none', 'under follow-up', 'dispute', 'partial payment', 'payment received'] as const;

const engineersByRegion: { [key: string]: string[] } = {
    ahmedabad: ['A. Patel', 'B. Shah'],
    banglore: ['C. Reddy', 'D. Kumar'],
    chennai: ['E. Pillai', 'F. Subramanian'],
    delhi: ['G. Singh', 'H. Sharma'],
    export: ['I. Khan', 'J. Mehta'],
    goa: ['K. Fernandes', 'L. DSouza'],
    hyderabad: ['M. Rao', 'N. Reddy'],
    indore: ['O. Verma', 'P. Jain'],
    jaipur: ['Q. Agarwal', 'R. Meena'],
    kolkata: ['S. Banerjee', 'T. Das'],
    mumbai: ['U. Joshi', 'V. Kulkarni'],
    nagpur: ['W. Deshpande', 'X. Gawande'],
    odisha: ['Y. Mohanty', 'Z. Sahu'],
    pune: ['A. Patil', 'B. Chavan'],
    punjab: ['C. Gill', 'D. Kaur'],
    raipur: ['E. Sahu', 'F. Tiwari'],
    vizag: ['G. Raju', 'H. Kumar'],
    wie: ['I. Ali', 'J. Singh']
};


export const customers: Customer[] = Array.from({ length: 100 }, (_, i) => {
    const region = regions[i % regions.length];
    const assignedEngineers = engineersByRegion[region];
    const assignedEngineer = assignedEngineers[i % assignedEngineers.length];
    
    return {
        customerCode: `CUST${(i + 1).toString().padStart(4, '0')}`,
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
    { value: 'ahmedabad', label: 'Ahmedabad' },
    { value: 'banglore', label: 'Bangalore' },
    { value: 'chennai', label: 'Chennai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'export', label: 'Export' },
    { value: 'goa', label: 'Goa' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'indore', label: 'Indore' },
    { value: 'jaipur', label: 'Jaipur' },
    { value: 'kolkata', label: 'Kolkata' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'nagpur', label: 'Nagpur' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'pune', label: 'Pune' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'raipur', label: 'Raipur' },
    { value: 'vizag', label: 'Vizag' },
    { value: 'wie', label: 'WIE' }
];

export const engineers: Engineer[] = Object.entries(engineersByRegion).flatMap(([region, names]) => 
    names.map((name, index) => ({
        id: `${region.slice(0,3).toUpperCase()}${index+1}`,
        name: name,
        region: region as typeof regions[number]
    }))
);


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
    { name: 'R. Sharma', region: 'delhi', outstandingCollected: 450000, newOutstandingAssigned: 320000, netChange: 130000 },
    { name: 'S. Gupta', region: 'delhi', outstandingCollected: 380000, newOutstandingAssigned: 410000, netChange: -30000 },
    { name: 'S. Iyer', region: 'chennai', outstandingCollected: 520000, newOutstandingAssigned: 280000, netChange: 240000 },
    { name: 'K. Rao', region: 'hyderabad', outstandingCollected: 410000, newOutstandingAssigned: 390000, netChange: 20000 },
    { name: 'A. Das', region: 'kolkata', outstandingCollected: 290000, newOutstandingAssigned: 310000, netChange: -20000 },
    { name: 'B. Chatterjee', region: 'kolkata', outstandingCollected: 330000, newOutstandingAssigned: 290000, netChange: 40000 },
    { name: 'P. Patel', region: 'ahmedabad', outstandingCollected: 610000, newOutstandingAssigned: 450000, netChange: 160000 },
    { name: 'V. Mehta', region: 'mumbai', outstandingCollected: 580000, newOutstandingAssigned: 510000, netChange: 70000 },
];

export const users: User[] = [
    ...Object.entries(engineersByRegion).flatMap(([region, names]) => 
        names.map((name, index) => ({
            id: `ENG-${region.slice(0,3).toUpperCase()}-${index+1}`,
            name: name,
            email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
            role: 'Engineer',
            region: region as typeof regions[number],
            contact: `987654${Math.floor(1000 + Math.random() * 9000)}`
        }))
    ),
    { id: 'MGR01', name: 'Anjali Verma', email: 'anjali.verma@example.com', role: 'Manager', region: 'delhi', contact: '9876543210' },
    { id: 'MGR02', name: 'Baskar Sundaram', email: 'baskar.s@example.com', role: 'Manager', region: 'chennai', contact: '9876543213' },
    { id: 'MGR03', name: 'Priya Das', email: 'priya.das@example.com', role: 'Manager', region: 'kolkata', contact: '9876543216' },
    { id: 'MGR04', name: 'Rajesh Patil', email: 'rajesh.patil@example.com', role: 'Manager', region: 'mumbai', contact: '9876543219' },
    { id: 'CM01', name: 'Vipul Sukhul', email: 'vipsukhul@gmail.com', role: 'Country Manager', region: 'mumbai', contact: '9999999999' }
];
