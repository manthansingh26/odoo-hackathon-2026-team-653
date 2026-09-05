import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  User,
  Receipt,
  ShoppingCart,
  CreditCard,
  Users,
  Package,
  X,
  LogOut
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    data,
    currentUser,
    userRole,
    setUserRole,
    setIsSearchOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setActiveModal,
    markNotificationRead,
    clearAllNotifications,
    logout
  } = useAppContext();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const notifRef = useRef(null);
  const quickRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target)) {
        setIsQuickActionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = data.notifications?.filter(n => !n.read).length || 0;

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
    if (path === '/budget') return { title: 'Budget Management', category: 'Planning' };
    if (path === '/analytic-accounts') return { title: 'Analytic Accounts', category: 'Cost Centers' };
    if (path === '/reports') return { title: 'Reports Hub', category: 'Analytics' };
    if (path === '/reports/profit-loss') return { title: 'Profit & Loss Statement', category: 'Reports' };
    if (path === '/reports/balance-sheet') return { title: 'Balance Sheet', category: 'Reports' };
    if (path === '/reports/budget') return { title: 'Budget Performance Report', category: 'Reports' };
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
          className="p-2 -ml-2 text-neutral-600 hover:text-neutral-950 md:hidden rounded-md hover:bg-neutral-100"
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

      {/* Right side: Search, Quick Actions, Notifications, Role pill */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-neutral-100/80 hover:bg-neutral-200/80 border border-neutral-200 rounded-lg text-xs text-neutral-500 hover:text-neutral-800 transition-colors shadow-2xs cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-neutral-500" />
          <span className="font-normal">Search records...</span>
          <kbd className="bg-white border border-neutral-300 px-1.5 py-0.5 rounded-sm text-[10px] font-mono text-neutral-600 shadow-2xs">
            Ctrl K
          </kbd>
        </button>

        {/* Global Search Button (Mobile) */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="sm:hidden p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Actions Dropdown (Only for Admin & Accountant) */}
        {userRole !== 'Contact User' && (
          <div className="relative" ref={quickRef}>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
              className="gap-1.5 text-xs shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
            </Button>

            {isQuickActionOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-left">
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickActionOpen(false);
                    setActiveModal({ type: 'NEW_INVOICE' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5 text-neutral-500" />
                  <span>New Customer Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickActionOpen(false);
                    setActiveModal({ type: 'NEW_BILL' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-neutral-500" />
                  <span>New Vendor Bill</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickActionOpen(false);
                    setActiveModal({ type: 'NEW_PAYMENT' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Record Payment</span>
                </button>
                <div className="my-1 border-t border-neutral-100" />
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickActionOpen(false);
                    setActiveModal({ type: 'ADD_CONTACT' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Add Contact</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickActionOpen(false);
                    setActiveModal({ type: 'ADD_PRODUCT' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  <Package className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Add Product</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-md transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-neutral-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <Badge variant="loss" className="text-[10px] px-1.5 py-0">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearAllNotifications}
                    className="text-[11px] text-neutral-500 hover:text-neutral-900 hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNotifOpen(false)}
                    className="p-1 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
                    title="Close notifications"
                    aria-label="Close notifications"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
                {data.notifications && data.notifications.length > 0 ? (
                  data.notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-neutral-50 transition-colors flex items-start gap-3 cursor-pointer ${
                        !n.read ? 'bg-neutral-50/50' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />}
                        {n.type === 'danger' && <AlertTriangle className="w-4 h-4 text-[#c62828]" />}
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                        {n.type === 'info' && <Info className="w-4 h-4 text-neutral-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-neutral-900 truncate">{n.title}</p>
                          <span className="text-[10px] text-neutral-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-0.5 leading-normal">{n.description}</p>
                      </div>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-950 shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-neutral-400">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Tag & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-neutral-200">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-neutral-900 leading-tight">
              {currentUser?.name || 'Aarav Mehta'}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              {userRole}
            </span>
          </div>
          <Badge variant={userRole === 'Admin' ? 'dark' : userRole === 'Accountant' ? 'default' : 'outline'} className="text-[10px] font-mono hidden sm:inline-flex">
            {userRole}
          </Badge>
          <button
            type="button"
            onClick={() => {
              navigate('/', { replace: true });
              logout();
            }}
            title="Sign out to Home Page"
            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
