# Urban Furniture Accounting System — Team 653

An enterprise-grade Accounting and ERP Management System for commercial furniture manufacturing and retail: purchase and sales workflows with automatic double-entry general ledger posting where **total debit = total credit**, strictly enforced at the database service layer by `postJournalEntry()`.

---

## Technology Stack

| Layer | Technology | Key Capabilities |
|---|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4 | High-performance responsive ERP dashboard, Lucide React icons, Recharts financial visualizations |
| **State & Client** | React Context API, Fetch Service | Role-based permission switcher, optimistic updates, and resilient PostgreSQL synchronization |
| **Backend API** | Node.js (v20+), Express.js (ESM) | Layered REST API (Controllers, Services, Routes, Centralized Error Handling) |
| **Database & ORM** | PostgreSQL 16, Prisma ORM 6 | Atomic transactions, relational constraints, foreign keys, and double-entry invariants |
| **Data Integrity** | Prisma Migrations | Safe, version-controlled forward migrations with idempotent realistic demo seeders |

---

## Project Structure

```
odoo-hackathon-2026-team-653/
├── backend/
│   ├── prisma/
│   │   ├── migrations/          # Version-controlled database migrations
│   │   ├── schema.prisma        # Prisma schema definitions (PostgreSQL single source of truth)
│   │   └── seed.js              # Idempotent demo data seeder (Contacts, Products, Transactions, Ledger)
│   ├── src/
│   │   ├── config/              # Shared Prisma client singleton
│   │   ├── controllers/         # HTTP request/response handlers and status codes
│   │   ├── middleware/          # Centralized error handler and cross-cutting concerns
│   │   ├── routes/              # Modular Express API route declarations
│   │   ├── services/            # Business logic & double-entry accounting engine (postJournalEntry)
│   │   ├── app.js               # Express application configuration, CORS, and health probe
│   │   └── server.js            # Server entry point with EADDRINUSE conflict handling
│   ├── .env.example             # Safe template for local environment variables
│   └── package.json
│
├── frontend/
│   ├── public/                  # Static assets and favicons
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Global search palette (Ctrl+K)
│   │   │   ├── layout/          # Layout wrapper, sticky Navbar, and responsive Sidebar
│   │   │   ├── modals/          # Quick action modals (Invoices, Bills, Payments, Contacts, Products)
│   │   │   └── ui/              # Design system primitives (Button, Card, Table, Badge, Modal, Input)
│   │   ├── context/             # AppContext (global state, auth personas, live API synchronization)
│   │   ├── data/                # Initial master fixtures and business mock data
│   │   ├── lib/                 # Utility helpers (cn, Tailwind merge)
│   │   ├── pages/
│   │   │   ├── auth/            # Login, Signup, and Demo Persona Switcher
│   │   │   ├── portal/          # Restricted Client/Vendor Portal (My Invoices, My Bills, My Payments, Profile)
│   │   │   ├── public/          # Marketing Landing Page
│   │   │   ├── reports/         # Financial Reports (Profit & Loss, Balance Sheet, Ledger, Stock, Budget)
│   │   │   ├── Dashboard.jsx    # Real-time Executive KPI Dashboard
│   │   │   ├── Contacts.jsx     # Customer and Supplier Master
│   │   │   ├── Products.jsx     # Furniture Inventory Catalog
│   │   │   ├── Invoices.jsx     # Customer Invoicing and Receivables
│   │   │   ├── VendorBills.jsx  # Supplier Bills and Payables
│   │   │   ├── Payments.jsx     # Treasury, Cash Inflows, and Disbursements
│   │   │   ├── Journals.jsx     # Accounting Journal Master
│   │   │   └── JournalEntries.jsx # Double-Entry Voucher Audit Trail
│   │   ├── services/            # Frontend API client (/api reverse-proxy integration)
│   │   ├── App.jsx              # Application routing and role-guarded routes
│   │   └── main.jsx             # React DOM entry point
│   ├── vite.config.js           # Vite configuration with /api reverse proxy to port 4000
│   └── package.json
│
├── .gitignore                   # Git exclusion rules
└── README.md
```

---

## Quick Start & Run Commands (Linux / macOS / Windows)

### 1. Database (PostgreSQL 16)
Ensure your PostgreSQL Docker container is running:
```bash
docker ps
```
Connection string in `backend/.env`:
```bash
DATABASE_URL="postgresql://recoverai:recoverai@localhost:5432/urban_furniture"
```

### 2. Backend API Setup & Startup
In a terminal tab:
```bash
cd backend
npm install

# Verify schema and generate Prisma client
npx prisma generate

# Apply migrations safely
npm run prisma:migrate -- --name init_accounting_demo

# Populate realistic demo contacts, products, transactions, and balanced ledger vouchers
npm run seed

# Start API server in development mode (http://localhost:4000)
npm run dev
```

### 3. Frontend Setup & Startup
In a second terminal tab:
```bash
cd frontend
npm install

# Start Vite development server (http://localhost:5173)
npm run dev
```

### 4. Visual Database Inspection (Optional)
To inspect or edit live database rows in a visual web UI:
```bash
cd backend
npx prisma studio
```
Opens Prisma Studio at **`http://localhost:5555`**.

---

## System URLs

- **Frontend ERP Portal:** [http://localhost:5173](http://localhost:5173)
- **Backend REST API:** [http://localhost:4000](http://localhost:4000)
- **API Health Check:** [http://localhost:4000/api/health](http://localhost:4000/api/health)
- **Prisma Database Studio:** [http://localhost:5555](http://localhost:5555)
- **Reverse Proxy:** All frontend requests to `/api/*` automatically proxy through Vite to `http://localhost:4000/api/*`.

---

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health probe verification (`{"status":"ok", ...}`) |
| `GET` | `/api/dashboard/summary` | Live aggregate totals: `totalSales`, `totalPurchases`, `receivable`, `payable`, `netProfit`, `recentTransactions` |
| `GET` | `/api/contacts` | List contacts with type (`CUSTOMER` / `VENDOR`) and transaction counts |
| `POST` | `/api/contacts` | Register a new customer or vendor party |
| `GET` | `/api/products` | Furniture inventory catalog with SKU, price, and current stock |
| `POST` | `/api/products` | Add a new product or service item to catalog |
| `GET` | `/api/transactions` | Full audit log of sales and purchases with linked journal entries |
| `POST` | `/api/transactions` | Create transaction — **automatically generates balanced double-entry ledger items** |
| `GET` | `/api/journal-entries` | General journal entries with split lines, debit/credit audit, and balanced validation |
| `POST` | `/api/journal-entries` | Post balanced manual journal entry (rejects if `totalDebit !== totalCredit`) |

---

## Double-Entry Accounting Core Invariant

The fundamental principle governing all financial records in the system is:
$$\sum \text{Debit} = \sum \text{Credit}$$

Every financial transaction posted via `/api/transactions` executes an atomic database transaction generating:
- **Sales Transaction:**
  - *Paid:* `Debit: Cash` / `Credit: Sales Revenue`
  - *Pending:* `Debit: Accounts Receivable` / `Credit: Sales Revenue`
- **Purchase Transaction:**
  - *Paid:* `Debit: Inventory` / `Credit: Cash`
  - *Pending:* `Debit: Inventory` / `Credit: Accounts Payable`

Any attempt to commit an unbalanced journal entry is rejected at the service layer before reaching PostgreSQL with HTTP 400:
```json
{
  "error": "Unbalanced entry rejected: debit 5000 != credit 4000"
}
```

---

## Multi-Role Architecture

The system supports distinct operational perspectives via role-based access control:

1. **Admin:** Full administrative control over ERP configuration, system settings, master data, and executive dashboards.
2. **Accountant:** Specialized accounting access focused on Chart of Accounts, Journal Vouchers, Financial Reporting (P&L, Balance Sheet), and General Ledger auditing.
3. **Contact User (Client / Vendor Portal):** Restricted external access enabling customers and suppliers to view their own invoices, vendor bills, payment receipts, and profile details without exposure to confidential corporate metrics.

---

## Project Roadmap

- **Milestone 1 (Complete):** Core vertical slice, PostgreSQL 16 Docker container, Prisma schema, Express REST API, balanced seed dataset, and basic accounting views.
- **Milestone 2 (Complete):** Complete ERP redesign, multi-role client portal, live double-entry journal vouchers, comprehensive financial statements (P&L, Balance Sheet, Stock Valuation, General Ledger), and robust error handling.
- **Milestone 3 (Upcoming):** Multi-currency support, automated bank statement reconciliation, and GST e-invoicing export.
