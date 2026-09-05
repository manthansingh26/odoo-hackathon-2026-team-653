import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Badge } from '../ui/Badge';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    userRole,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    logout
  } = useAppContext();

  // Breadcrumb / title derivation
  const getPageMeta = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return { title: 'Dashboard', category: 'Overview' };
    if (path === '/contacts') return { title: 'Contact Master', category: 'Relations' };
    if (path === '/products') return { title: 'Product Master', category: 'Inventory' };
    if (path === '/accounts') return { title: 'Chart of Accounts', category: 'Accounting' };
    if (path === '/journals') return { title: 'Journal Master', category: 'Accounting' };
    if (path === '/journal-entries') return { title: 'Journal Entries', category: 'Accounting' };
    if (path === '/sales-orders') return { title: 'Sales Orders', category: 'Sales' };
    if (path.startsWith('/invoices')) return { title: 'Customer Invoices', category: 'Sales' };
    if (path === '/purchase-orders') return { title: 'Purchase Orders', category: 'Purchases' };
    if (path.startsWith('/vendor-bills')) return { title: 'Vendor Bills', category: 'Purchases' };
    if (path === '/payments') return { title: 'Payments Register', category: 'Treasury' };
    if (path === '/reports/profit-loss') return { title: 'Profit & Loss Statement', category: 'Reports' };
    if (path === '/reports/balance-sheet') return { title: 'Balance Sheet', category: 'Reports' };
    if (path === '/reports/stock') return { title: 'Stock & Inventory Valuation', category: 'Reports' };
    if (path === '/reports/ledger') return { title: 'General Ledger', category: 'Reports' };
    if (path === '/settings') return { title: 'System Settings', category: 'Configuration' };
    if (path === '/my-invoices') return { title: 'My Invoices', category: 'Client Portal' };
    if (path === '/my-bills') return { title: 'My Bills', category: 'Client Portal' };
    if (path === '/my-payments') return { title: 'My Payments', category: 'Client Portal' };
    if (path === '/profile') return { title: 'Account Profile', category: 'User' };
    return { title: 'Urban Accounting', category: 'ERP' };
  };

  const { title, category } = getPageMeta();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-4 sm:px-6 h-16 flex items-center justify-between">
      {/* Left side: Hamburger (Mobile) + Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -ml-2 text-neutral-600 hover:text-neutral-950 md:hidden rounded-md hover:bg-neutral-100 cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
            <span className="uppercase tracking-wider">{category}</span>
            <span>/</span>
            <span className="text-neutral-600">{title}</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-950 leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: Logged-in User Information & Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-xs font-bold text-neutral-900 leading-tight">
            {currentUser?.name || 'Aarav Mehta'}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">
            {userRole}
          </span>
        </div>
        <Badge
          variant={userRole === 'Admin' ? 'dark' : userRole === 'Accountant' ? 'default' : 'outline'}
          className="text-[10px] font-mono"
        >
          {userRole}
        </Badge>
        <button
          type="button"
          onClick={() => {
            navigate('/', { replace: true });
            logout();
          }}
          title="Sign out"
          className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-md transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-red-600" />
        </button>
      </div>
    </header>
  );
};
