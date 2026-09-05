# Urban Furniture Accounting — Backend API

RESTful API backend for the Urban Furniture Accounting System built with Express.js, Prisma ORM, and PostgreSQL 16.

## Architecture

- **Runtime:** Node.js (ESM, `--watch` support)
- **Framework:** Express.js 4
- **ORM:** Prisma 6 with PostgreSQL 16 driver
- **Database:** PostgreSQL running in Docker (`recoverai-postgres` container)
- **Pattern:** Layered separation of concerns:
  - `src/controllers/` — HTTP request/response handling and status codes
  - `src/services/` — Business logic and double-entry ledger invariants
  - `src/routes/` — Express route definitions
  - `src/middleware/` — Shared error handling and cross-cutting concerns
  - `src/config/` — Shared Prisma client singleton

## Getting Started

### 1. Configure Environment
Ensure `.env` exists (copy from `.env.example`):
```bash
cp .env.example .env
```
Default connection string:
```bash
DATABASE_URL="postgresql://recoverai:recoverai@localhost:5432/urban_furniture"
```

### 2. Install & Generate Prisma Client
```bash
npm install
npm run prisma:generate
```

### 3. Migrations & Demo Seed Data
```bash
# Forward safe migration
npm run prisma:migrate -- --name init_accounting_demo

# Populate realistic demo contacts, products, transactions, and balanced journal entries
npm run seed
```

### 4. Run Server
```bash
# Development with file watch
npm run dev

# Production
npm start
```

Default server URL: `http://localhost:4000`

## API Endpoints

- `GET /api/health` — Service health check
- `GET /api/dashboard/summary` — Aggregate financial metrics
- `GET /api/contacts` / `POST /api/contacts` — Contact management
- `GET /api/products` / `POST /api/products` — Product catalog
- `GET /api/transactions` / `POST /api/transactions` — Transaction logging with automatic balanced journal entry generation
- `GET /api/journal-entries` / `POST /api/journal-entries` — General journal audit trail and validation
