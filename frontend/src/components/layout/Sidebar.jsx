import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  BookOpen,
  Receipt,
  ShoppingCart,
  CreditCard,
  PieChart,
  BarChart3,
  Settings,
  User,
  ChevronDown,
  ChevronRight,
  Shield,
  RotateCcw,
  Sparkles,
  FileText,
  Boxes,
  Compass,
  ArrowRightLeft,
  LogOut
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';

export const Sidebar = ({ onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, setUserRole, currentUser, logout, resetAllData } = useAppContext();

  // Collapsible groups in sidebar
  const [openGroups, setOpenGroups] = useState({
    accounting: true,
    sales: true,
    purchases: true,
    reports: true
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const isContactUser = userRole === 'Contact User';
  const isAccountant = userRole === 'Accountant';

  const linkBase = "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors select-none";
  const linkActive = "bg-neutral-950 text-white font-semibold shadow-xs";
  const linkInactive = "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100";

  const subLinkBase = "flex items-center gap-2 pl-9 pr-3 py-1.5 rounded-md text-xs font-medium transition-colors";
  const subLinkActive = "bg-neutral-200/70 text-neutral-950 font-semibold";
  const subLinkInactive = "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100";

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-screen flex flex-col justify-between shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-200 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-widest text-neutral-950 uppercase font-mono">
              URBAN
            </span>
            <span className="text-[9px] font-bold tracking-[0.25em] text-neutral-500 uppercase mt-0.5">
              ACCOUNTING SYSTEM
            </span>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" title="System Online" />
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded-md">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-neutral-700" />
            Role:
          </span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="bg-transparent font-semibold text-neutral-900 focus:outline-none cursor-pointer"
          >
            <option value="Admin">Admin (Aarav Mehta)</option>
            <option value="Accountant">Accountant (Priya Sharma)</option>
            <option value="Contact User">Client User (Nimesh Pathak)</option>
          </select>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Contact User Restricted View */}
        {isContactUser ? (
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Customer Portal
            </div>
            <NavLink
              to="/my-invoices"
              onClick={onCloseMobile}
              className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
            >
              <Receipt className="w-4 h-4" />
              <span>My Invoices</span>
            </NavLink>
            <NavLink
              to="/my-bills"
              onClick={onCloseMobile}
              className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>My Bills</span>
            </NavLink>
            <NavLink
              to="/my-payments"
              onClick={onCloseMobile}
              className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
            >
              <CreditCard className="w-4 h-4" />
              <span>My Payments</span>
            </NavLink>
            <NavLink
              to="/profile"
              onClick={onCloseMobile}
              className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </NavLink>
          </div>
        ) : (
          /* Admin / Accountant Complete View */
          <>
            {/* Dashboard */}
            <NavLink
              to="/dashboard"
              onClick={onCloseMobile}
              className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            {/* Contacts */}
            <NavLink
              to="/contacts"
              onClick={onCloseMobile}
              className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
            >
              <Users className="w-4 h-4" />
              <span>Contacts</span>
            </NavLink>

            {/* Products */}
            <NavLink
              to="/products"
              onClick={onCloseMobile}
              className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </NavLink>

            {/* Accounting Submenu */}
            {!isContactUser && (
              <div>
                <button
                  type="button"
                  onClick={() => toggleGroup('accounting')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4" />
                    <span>Accounting</span>
                  </span>
                  {openGroups.accounting ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {openGroups.accounting && (
                  <div className="mt-1 space-y-0.5">
                    <NavLink
                      to="/accounts"
                      onClick={onCloseMobile}
                      className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                    >
                      <span>Chart of Accounts</span>
                    </NavLink>
                    <NavLink
                      to="/journals"
                      onClick={onCloseMobile}
                      className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                    >
                      <span>Journal Master</span>
                    </NavLink>
                    <NavLink
                      to="/journal-entries"
                      onClick={onCloseMobile}
                      className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                    >
                      <span>Journal Entries</span>
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {/* Sales Submenu */}
            <div>
              <button
                type="button"
                onClick={() => toggleGroup('sales')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Receipt className="w-4 h-4" />
                  <span>Sales</span>
                </span>
                {openGroups.sales ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {openGroups.sales && (
                <div className="mt-1 space-y-0.5">
                  <NavLink
                    to="/sales-orders"
                    onClick={onCloseMobile}
                    className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                  >
                    <span>Sales Orders</span>
                  </NavLink>
                  <NavLink
                    to="/invoices"
                    onClick={onCloseMobile}
                    className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                  >
                    <span>Customer Invoices</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Purchases Submenu */}
            <div>
              <button
                type="button"
                onClick={() => toggleGroup('purchases')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Purchases</span>
                </span>
                {openGroups.purchases ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {openGroups.purchases && (
                <div className="mt-1 space-y-0.5">
                  <NavLink
                    to="/purchase-orders"
                    onClick={onCloseMobile}
                    className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                  >
                    <span>Purchase Orders</span>
                  </NavLink>
                  <NavLink
                    to="/vendor-bills"
                    onClick={onCloseMobile}
                    className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                  >
                    <span>Vendor Bills</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Payments */}
            <NavLink
              to="/payments"
              onClick={onCloseMobile}
              className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payments</span>
            </NavLink>

            {/* Budget */}
            <NavLink
              to="/budget"
              onClick={onCloseMobile}
              className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
            >
              <PieChart className="w-4 h-4" />
              <span>Budget</span>
            </NavLink>

            {/* Analytic Accounts */}
            <NavLink
              to="/analytic-accounts"
              onClick={onCloseMobile}
              className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
            >
              <Compass className="w-4 h-4" />
              <span>Analytic Accounts</span>
            </NavLink>

            {/* Reports Submenu */}
            <div>
              <button
                type="button"
                onClick={() => toggleGroup('reports')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4" />
                  <span>Reports</span>
                </span>
                {openGroups.reports ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {openGroups.reports && (
                <div className="mt-1 space-y-0.5">
                  <NavLink
                    to="/reports"
                    end
                    onClick={onCloseMobile}
                    className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                  >
                    <span>All Reports Hub</span>
                  </NavLink>
                  <NavLink
                    to="/reports/profit-loss"
                    onClick={onCloseMobile}
                    className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                  >
                    <span>Profit & Loss</span>
                  </NavLink>
                  <NavLink
                    to="/reports/balance-sheet"
                    onClick={onCloseMobile}
                    className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                  >
                    <span>Balance Sheet</span>
                  </NavLink>
                  <NavLink
                    to="/reports/budget"
                    onClick={onCloseMobile}
                    className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                  >
                    <span>Budget Report</span>
                  </NavLink>
                  <NavLink
                    to="/reports/stock"
                    onClick={onCloseMobile}
                    className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                  >
                    <span>Stock Report</span>
                  </NavLink>
                  <NavLink
                    to="/reports/ledger"
                    onClick={onCloseMobile}
                    className={({ isActive }) => cn(subLinkBase, isActive ? subLinkActive : subLinkInactive)}
                  >
                    <span>General Ledger</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Settings (Admin only) */}
            {userRole === 'Admin' && (
              <NavLink
                to="/settings"
                onClick={onCloseMobile}
                className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </NavLink>
            )}
          </>
        )}
      </div>

      {/* User profile & footer */}
      <div className="p-3 border-t border-neutral-200 bg-neutral-50/70 space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0 font-mono">
              {((currentUser?.name || (userRole === 'Accountant' ? 'Priya Sharma' : userRole === 'Contact User' ? 'Nimesh Pathak' : 'Aarav Mehta'))).slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-neutral-900 truncate">
                {currentUser?.name || (userRole === 'Accountant' ? 'Priya Sharma' : userRole === 'Contact User' ? 'Nimesh Pathak' : 'Aarav Mehta')}
              </p>
              <p className="text-[10px] text-neutral-500 truncate">
                {currentUser?.title || (userRole === 'Accountant' ? 'Senior Chartered Accountant' : userRole === 'Contact User' ? 'Key Client / Procurement Head' : 'Managing Director & ERP Administrator')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={resetAllData}
              title="Reset demo data"
              className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/', { replace: true });
              }}
              title="Sign out to Landing Page"
              className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
