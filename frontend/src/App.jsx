import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { Layout } from './components/layout/Layout';

// Authentication Pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';

// Core Business Pages
import { Dashboard } from './pages/Dashboard';
import { Contacts } from './pages/Contacts';
import { Products } from './pages/Products';
import { ChartOfAccounts } from './pages/ChartOfAccounts';
import { Journals } from './pages/Journals';
import { JournalEntries } from './pages/JournalEntries';
import { SalesOrders } from './pages/SalesOrders';
import { Invoices } from './pages/Invoices';
import { PurchaseOrders } from './pages/PurchaseOrders';
import { VendorBills } from './pages/VendorBills';
import { Payments } from './pages/Payments';
import { Budget } from './pages/Budget';
import { AnalyticAccounts } from './pages/AnalyticAccounts';
import { Settings } from './pages/Settings';

// Financial Reports
import { ReportsHub } from './pages/reports/ReportsHub';
import { ProfitLossReport } from './pages/reports/ProfitLossReport';
import { BalanceSheetReport } from './pages/reports/BalanceSheetReport';
import { BudgetReport } from './pages/reports/BudgetReport';
import { StockReport } from './pages/reports/StockReport';
import { LedgerReport } from './pages/reports/LedgerReport';

// Client Portal Pages (Contact User)
import { MyInvoices } from './pages/portal/MyInvoices';
import { MyBills } from './pages/portal/MyBills';
import { MyPayments } from './pages/portal/MyPayments';
import { ProfilePage } from './pages/portal/ProfilePage';

import { LandingPage } from './pages/public/LandingPage';

function App() {
  const { isAuthenticated, userRole } = useAppContext();

  // Role verification helper
  const isContact = userRole === 'Contact User';
  const isAdmin = userRole === 'Admin';
  const isAccountant = userRole === 'Accountant';

  return (
    <Routes>
      {/* Public Home / Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Authenticated Workspace wrapped in Layout */}
      <Route
        element={
          isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
        }
      >
        {/* Core & Overview */}
        <Route
          path="/dashboard"
          element={!isContact ? <Dashboard /> : <Navigate to="/my-invoices" replace />}
        />

        {/* Master Data (Admin & Accountant only) */}
        <Route
          path="contacts"
          element={!isContact ? <Contacts /> : <Navigate to="/my-invoices" replace />}
        />
        <Route
          path="products"
          element={!isContact ? <Products /> : <Navigate to="/my-invoices" replace />}
        />

        {/* Accounting Core (Restricted from Contact Users) */}
        <Route
          path="accounts"
          element={!isContact ? <ChartOfAccounts /> : <Navigate to="/my-invoices" replace />}
        />
        <Route
          path="journals"
          element={!isContact ? <Journals /> : <Navigate to="/my-invoices" replace />}
        />
        <Route
          path="journal-entries"
          element={!isContact ? <JournalEntries /> : <Navigate to="/my-invoices" replace />}
        />

        {/* Sales */}
        <Route path="sales" element={<Navigate to="/invoices" replace />} />
        <Route
          path="sales-orders"
          element={!isContact ? <SalesOrders /> : <Navigate to="/my-invoices" replace />}
        />
        <Route
          path="invoices"
          element={!isContact ? <Invoices /> : <Navigate to="/my-invoices" replace />}
        />

        {/* Purchases */}
        <Route path="purchases" element={<Navigate to="/vendor-bills" replace />} />
        <Route
          path="purchase-orders"
          element={!isContact ? <PurchaseOrders /> : <Navigate to="/my-bills" replace />}
        />
        <Route
          path="vendor-bills"
          element={!isContact ? <VendorBills /> : <Navigate to="/my-bills" replace />}
        />

        {/* Treasury */}
        <Route
          path="payments"
          element={!isContact ? <Payments /> : <Navigate to="/my-payments" replace />}
        />

        {/* Management & Cost Centers */}
        <Route
          path="budget"
          element={!isContact ? <Budget /> : <Navigate to="/my-invoices" replace />}
        />
        <Route
          path="analytic-accounts"
          element={!isContact ? <AnalyticAccounts /> : <Navigate to="/my-invoices" replace />}
        />

        {/* Financial Reports Hub & Sub-reports (Admin & Accountant only) */}
        <Route
          path="reports"
          element={!isContact ? <ReportsHub /> : <Navigate to="/my-invoices" replace />}
        />
        <Route
          path="reports/profit-loss"
          element={!isContact ? <ProfitLossReport /> : <Navigate to="/my-invoices" replace />}
        />
        <Route
          path="reports/balance-sheet"
          element={!isContact ? <BalanceSheetReport /> : <Navigate to="/my-invoices" replace />}
        />
        <Route
          path="reports/budget"
          element={!isContact ? <BudgetReport /> : <Navigate to="/my-invoices" replace />}
        />
        <Route
          path="reports/stock"
          element={!isContact ? <StockReport /> : <Navigate to="/my-invoices" replace />}
        />
        <Route
          path="reports/ledger"
          element={!isContact ? <LedgerReport /> : <Navigate to="/my-invoices" replace />}
        />

        {/* Settings (Admin Only) */}
        <Route
          path="settings"
          element={isAdmin ? <Settings /> : (isContact ? <Navigate to="/my-invoices" replace /> : <Navigate to="/dashboard" replace />)}
        />

        {/* Contact User Restricted Portal */}
        <Route path="my-invoices" element={<MyInvoices />} />
        <Route path="my-bills" element={<MyBills />} />
        <Route path="my-payments" element={<MyPayments />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to={isContact ? "/my-invoices" : "/dashboard"} replace />} />
      </Route>
    </Routes>
  );
}

export default App;
