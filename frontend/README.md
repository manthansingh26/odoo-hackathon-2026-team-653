# Urban Furniture Accounting — Frontend Client

Single Page Application (SPA) dashboard for the Urban Furniture Accounting System built with React 19 and Vite.

## Architecture

- **Core:** React 19, Vite 8
- **Styling:** Custom vanilla CSS design system (`src/index.css`) featuring deep dark palette (`#0a0d14`), warm wood amber accents (`#d97706`), metric cards, data tables, status badges, and accessible modal dialogs.
- **API Client:** `src/services/api.js` utilizing native `fetch` and Vite development reverse-proxy.
- **Directory Structure:**
  - `src/components/` — Reusable UI components (Sidebar, Header, MetricCard, Modal, StatusBadge)
  - `src/pages/` — Feature views (DashboardPage, ContactsPage, ProductsPage, TransactionsPage, JournalPage, PlaceholderPage)
  - `src/services/` — Backend API communication layer
  - `public/` — Static assets and favicon

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Access the application at `http://localhost:5173`. API requests to `/api/*` are automatically forwarded to `http://localhost:4000` via the Vite reverse proxy configured in `vite.config.js`.

### 3. Build & Quality Verification
```bash
npm run lint    # Oxlint static analysis
npm run build   # Production asset compilation
```
