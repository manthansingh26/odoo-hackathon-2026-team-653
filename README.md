# Urban Furniture Accounting System — Team 653

Accounting and ERP management system for an Urban Furniture enterprise: purchase and sales workflows with automatic double-entry ledger posting where **total debit = total credit**, enforced strictly by the centralized `postJournalEntry()` service engine.

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Plain Vanilla CSS Design System, Responsive Layout |
| **Backend** | Node.js (v20+), Express.js (ESM), REST API |
| **Database** | PostgreSQL 16 (Docker container: `recoverai-postgres`), Prisma ORM 6 |
| **Data Integrity** | Prisma Migrations (safe forward migrations only, no destructive resets) |

---

## Project Structure

```
odoo-hackathon-2026-team-653/
├── backend/
│   ├── prisma/
│   │   ├── migrations/          # Version-controlled database migrations
│   │   ├── schema.prisma        # Database schema definitions
│   │   └── seed.js              # Idempotent realistic demo data seeder
│   ├── src/
│   │   ├── config/              # Shared Prisma client instance
│   │   ├── controllers/         # HTTP request/response handlers
│   │   ├── middleware/          # Centralized error handler
│   │   ├── routes/              # Express API route declarations
│   │   ├── services/            # Business logic & double-entry accounting engine
│   │   ├── utils/               # Shared utility helpers
│   │   ├── app.js               # Express application configuration & CORS
│   │   └── server.js            # Server entry point with EADDRINUSE handling
│   ├── .env.example             # Safe template for local environment variables
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/                  # Static assets & SVG icons
│   ├── src/
│   │   ├── components/          # Reusable UI components (Sidebar, Header, MetricCard, Modal, StatusBadge)
│   │   ├── pages/               # Functional view pages (Dashboard, Contacts, Products, Transactions, Journal)
│   │   ├── services/            # Frontend API client (fetch-based with error handling)
│   │   ├── index.css            # Dark theme design system and layout rules
│   │   ├── App.jsx              # Main dashboard application layout & navigation
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   ├── vite.config.js           # Vite configuration with /api reverse proxy
│   ├── package.json
│   └── README.md
│
├── .gitignore                   # Ignores .env, node_modules, dist, and local tooling
└── README.md
```

---

## Exact Run Commands (Ubuntu)

### 1. Prerequisites
Ensure the existing PostgreSQL 16 Docker container is running:
```bash
docker ps
```
The database connection string:
```bash
DATABASE_URL="postgresql://recoverai:recoverai@localhost:5432/urban_furniture"
```

### 2. Backend Setup & Startup
In your first terminal:
```bash
git clone <repository-url>
cd odoo-hackathon-2026-team-653

cd backend
npm install

cp .env.example .env

# Apply Prisma migrations safely
npm run prisma:migrate -- --name init_accounting_demo

# Seed demo data (Contacts, Products, Transactions, Balanced Journal Entries)
npm run seed

# Start Express server (runs on http://localhost:4000)
npm run dev
```

### 3. Frontend Setup & Startup
In a second terminal:
```bash
cd odoo-hackathon-2026-team-653/frontend
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

---

## System URLs

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:4000](http://localhost:4000)
- **Vite Proxy:** All frontend calls to `/api/*` automatically proxy to `http://localhost:4000/api/*`

---

## Working REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health probe (`{"status":"ok","message":"Urban Furniture Accounting API is running"}`) |
| `GET` | `/api/dashboard/summary` | Real-time totals: `totalSales`, `totalPurchases`, `receivable`, `payable`, `netProfit`, `recentTransactions` |
| `GET` | `/api/contacts` | List contacts with relationship type (`CUSTOMER` / `VENDOR`) and transaction counts |
| `POST` | `/api/contacts` | Register a new customer or wood supplier |
| `GET` | `/api/products` | Inventory catalog with SKU, price, and stock levels |
| `POST` | `/api/products` | Add new furniture item to catalog |
| `GET` | `/api/transactions` | Sales & purchases audit log with payment status |
| `POST` | `/api/transactions` | Post new transaction — **automatically generates balanced double-entry journal items** |
| `GET` | `/api/journal-entries` | General journal entries with line-by-line debit/credit audit and balanced status |
| `POST` | `/api/journal-entries` | Post manual journal entry (strictly rejects if `totalDebit !== totalCredit`) |

---

## Double-Entry Accounting Invariant

The core rule of financial integrity is:
$$\sum \text{Debit} = \sum \text{Credit}$$

Every financial transaction posted via `/api/transactions` generates:
- **Sale:**
  - If Paid: `Debit: Cash` / `Credit: Sales Revenue`
  - If Pending: `Debit: Accounts Receivable` / `Credit: Sales Revenue`
- **Purchase:**
  - If Paid: `Debit: Inventory` / `Credit: Cash`
  - If Pending: `Debit: Inventory` / `Credit: Accounts Payable`

Any attempt to post an unbalanced journal entry via `postJournalEntry()` returns HTTP 400:
```json
{
  "error": "Unbalanced entry rejected: debit 5000 != credit 4000"
}
```

---

## Mentor Demo Walkthrough

1. **Dashboard Overview:**
   - View top summary cards: Total Sales, Total Purchases, Accounts Receivable, Accounts Payable, Net Profit.
   - View recent transactions fetched live from PostgreSQL.
2. **Contacts Management:**
   - Navigate to **Contacts** tab.
   - Click **+ Add New Contact**, add a supplier (e.g. `Urban Oak Crafts`, `VENDOR`).
   - Notice the table instantly reflects the newly saved PostgreSQL record.
3. **Products & Inventory:**
   - Navigate to **Products** tab to inspect live catalog items, SKUs, and stock quantities.
   - Click **+ Add Product** to add a new furniture product with unit pricing and stock.
4. **Transactions & Automated Double-Entry:**
   - Navigate to **Transactions** tab.
   - Click **+ Post New Transaction**, select a contact, specify type (Sale/Purchase) and amount.
   - Notice that both the Transaction document and its balanced Journal Entry are atomically created in the database.
5. **General Journal Ledger:**
   - Navigate to **Journal Entries** tab.
   - Inspect line items showing explicit debit and credit amounts.
   - Note the **✓ Balanced** badge on every valid entry.
   - Try posting a test manual journal entry with unbalanced amounts to see the backend invariant rejection in action.

---

## Project Roadmap

- **Milestone 1 (Complete):** Core vertical slice, Docker PostgreSQL 16 connection, Prisma schema & migrations, Express REST API, seed data, accounting dashboard with dark theme, contacts, products, transactions, and balanced journal entries.
- **Milestone 2 (Next):** User authentication (bcrypt + JWT http-only cookies), PDF invoice generation, multi-mode payment reconciliation.
- **Milestone 3:** Advanced financial reporting (Balance Sheet, Profit & Loss statement, Aged Receivables, Tax GST computation).
