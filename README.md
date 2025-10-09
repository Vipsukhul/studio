# Outstanding Tracker

The Outstanding Tracker is a comprehensive web application designed to help businesses monitor, manage, and analyze outstanding invoices and customer payments. It provides a role-based system with a detailed user dashboard for day-to-day operations and a powerful admin panel for system management and oversight.

The application is built with a modern tech stack, ensuring a responsive, performant, and scalable user experience.

## Key Features

The application is divided into two main areas: the User Dashboard and the Admin Panel.

### User Dashboard

- **KPI Overview:** A central dashboard displaying key performance indicators like Total Outstanding Amount, Recovered Amount, Disputed Invoices, and Total Customers.
- **Advanced Charting:**
    - **Region vs. Ageing:** A stacked bar chart to visualize outstanding amounts across different ageing buckets (0-30, 31-90 days, etc.) for each region.
    - **Region-wise Distribution:** A pie chart showing the percentage of outstanding amounts contributed by each region.
    - **Monthly Trends:** A line chart tracking the outstanding balance for each region over time.
    - **New vs. Recovered:** A bar chart comparing newly assigned outstanding amounts versus recovered amounts each month.
- **Data Filtering:** Filter dashboard and data pages by month and department (Batching Plant or Pump).
- **Detailed Data Sheet:** A searchable and sortable table of all customers, allowing users to view invoice details, update remarks, add notes, and manage invoice dispute statuses.
- **Invoice Tracker:** A summary table to track invoice counts and amounts for the current vs. previous month.
- **Role-Based Access:**
    - **Country Managers/Admins:** Can access the data upload functionality.
    - **Engineers:** Have read-only access to certain data fields but can add their own notes.
- **Notifications System:** A real-time notification system alerts users to important events:
    - Data uploads by the Country Manager.
    - Notes added by Engineers (notifies Managers).
    - Changes made by Managers (notifies the Country Manager).
- **User Profile Settings:** Users can update their personal information (name, contact, address) and upload a profile picture.

### Admin Panel

- **Central Admin Dashboard:** A quick-access hub for all administrative functions and an overview of engineer performance.
- **User Management:** View, add, and delete application users.
- **Admin Management:** Manage administrator accounts, assign permissions (Full Control, Read-Only, etc.), and add or remove admins.
- **System Logs:** A dedicated page to view, search, and filter application logs by level (INFO, WARN, ERROR).
- **Engineer Performance:** A detailed view with charts and tables to track and compare performance metrics for each engineer, such as outstanding amounts collected vs. new amounts assigned.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN/UI](https://ui.shadcn.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **File Handling:** [xlsx](https://www.npmjs.com/package/xlsx) for Excel processing, [react-dropzone](https://react-dropzone.js.org/) for file uploads.

## Getting Started

Follow these steps to get the development environment running.

### 1. Install Dependencies

First, install the required NPM packages:

```bash
npm install
```

### 2. Run the Development Server

Next, start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## Login Credentials

You can use the following mock credentials to test the application with different user roles. The default password for all user accounts is `password`.

- **Country Manager:** `vipsukhul@gmail.com`
- **Manager:** `manager@example.com`
- **Engineer:** `engineer@example.com`

For the admin panel, use one of the following:

- **Admin:** `vipsukhul@gmail.com` (password: `Password`)
- **Admin:** `supriysukhadeve12@gmail.com` (password: `Supriy@0310`)

## Project Structure

The project follows a standard Next.js App Router structure.

```
/
├── src/
│   ├── app/                # Application routes
│   │   ├── admin/          # Admin panel routes
│   │   ├── dashboard/      # User dashboard routes
│   │   ├── globals.css     # Global styles and ShadCN theme
│   │   └── page.tsx        # Main login page
│   │
│   ├── components/         # Reusable React components
│   │   ├── charts/         # Chart components
│   │   ├── tables/         # TanStack Table components
│   │   └── ui/             # Core ShadCN UI components
│   │
│   ├── hooks/              # Custom React hooks (e.g., use-toast)
│   │
│   └── lib/                # Shared utilities, data, and types
│       ├── api.ts          # Simulated API functions
│       ├── data.ts         # Mock data for the application
│       ├── notifications.ts# Notification handling logic
│       └── types.ts        # TypeScript type definitions
│
├── public/                 # Static assets
│
└── tailwind.config.ts      # Tailwind CSS configuration
```
