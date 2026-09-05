import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Shield,
  Layers,
  Receipt,
  PieChart,
  Boxes,
  Users,
  BarChart3,
  Scale,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  CreditCard,
  Building2,
  Lock,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { AuthModal } from '../../components/auth/AuthModal';
import { DoubleEntryModal } from '../../components/modals/DoubleEntryModal';

export const LandingPage = () => {
  const { isAuthenticated, currentUser, formatINR } = useAppContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('admin');
  const [isDoubleEntryOpen, setIsDoubleEntryOpen] = useState(false);
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    tab: 'login', // 'login' | 'signup'
    role: 'Admin'
  });

  const openAuth = (tab = 'login', role = 'Admin') => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setAuthModal({
        isOpen: true,
        tab,
        role
      });
    }
  };

  const closeAuth = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Top Reusable Public Navbar */}
      <PublicNavbar
        onOpenAuth={(tab) => openAuth(tab, 'Admin')}
        onOpenDoubleEntry={() => setIsDoubleEntryOpen(true)}
      />

      {/* --- HERO SECTION (with pt-24 for fixed header) --- */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-24 bg-[#fafafa] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2e7d32]" />
            <span>Built Specifically for Commercial & Bespoke Furniture Manufacturing</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-neutral-950 max-w-4xl mx-auto leading-[1.08]">
            Next-Generation ERP & Accounting for <span className="underline decoration-neutral-300 underline-offset-8">Urban Furniture</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Streamline raw timber procurement, double-entry general ledgers, sales invoicing, and profit margins in a clean, minimalist black-and-white workspace.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <Button
              size="lg"
              variant="primary"
              onClick={() => openAuth('signup')}
              className="w-full sm:w-auto px-8 gap-2 font-bold shadow-md cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <button
              type="button"
              onClick={() => openAuth('login', 'Admin')}
              className="w-full sm:w-auto inline-flex items-center justify-center font-semibold text-sm px-6 py-2.5 rounded-md border border-neutral-300 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-900 shadow-2xs transition-colors cursor-pointer gap-2"
            >
              <span>Explore Live Dashboard Demo</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-500" />
            </button>
          </div>

          {/* Quick trust pill */}
          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-neutral-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              No External Database Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              Multi-Role Isolation (Admin, Accountant, Client)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              100% Client-Side Reactive State
            </span>
          </div>

          {/* --- HERO LIVE INTERACTIVE PREVIEW CARD --- */}
          <div className="mt-8 sm:mt-12 max-w-5xl mx-auto bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden text-left w-full">
            {/* Top Preview Bar */}
            <div className="bg-neutral-900 text-white px-4 sm:px-5 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="ml-1.5 font-mono text-neutral-400 text-[11px] truncate">
                  https://urbanfurniture.erp/dashboard
                </span>
              </div>
              <Badge variant="profit" className="text-[10px] font-bold shrink-0 ml-2">
                Live System Preview
              </Badge>
            </div>

            {/* Dashboard Mock Content */}
            <div className="p-4 sm:p-6 space-y-6 bg-white">
              {/* Header Preview (Good morning, Admin) - Responsive */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-950">Good morning, Admin</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Here's what's happening with Urban Furniture today.</p>
                </div>
                <div className="w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => openAuth('login', 'Admin')}
                    className="w-full sm:w-auto px-4 py-2 sm:py-1.5 bg-neutral-950 text-white text-xs font-semibold rounded-md shadow-xs hover:bg-neutral-800 transition-colors cursor-pointer text-center"
                  >
                    Open Full ERP
                  </button>
                </div>
              </div>

              {/* 4 KPI Cards Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-neutral-200 bg-[#fafafa]">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Sales</span>
                  <div className="text-xl font-black font-mono text-neutral-950 mt-1">₹12,84,500</div>
                  <span className="text-[11px] inline-flex items-center gap-0.5 text-[#2e7d32] font-semibold mt-1">
                    <ArrowUpRight className="w-3 h-3" /> +12.5%
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-[#fafafa]">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Purchases</span>
                  <div className="text-xl font-black font-mono text-neutral-950 mt-1">₹7,42,800</div>
                  <span className="text-[11px] text-neutral-500 font-semibold mt-1">
                    +8.2% materials
                  </span>
                </div>

                {/* Net Profit highlighted in Green */}
                <div className="p-4 rounded-xl border border-[#c8e6c9] bg-[#e8f5e9]">
                  <span className="text-[10px] uppercase font-bold text-[#2e7d32] block">Net Operating Profit</span>
                  <div className="text-xl font-black font-mono text-[#2e7d32] mt-1">₹3,18,400</div>
                  <span className="text-[11px] inline-flex items-center gap-0.5 text-[#2e7d32] font-semibold mt-1">
                    <ArrowUpRight className="w-3 h-3" /> +15.8% PROFIT
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Outstanding Receivables</span>
                  <div className="text-xl font-black font-mono text-neutral-950 mt-1">₹2,46,500</div>
                  <span className="text-[11px] text-amber-800 font-semibold mt-1">
                    Needs attention
                  </span>
                </div>
              </div>

              {/* Transactions teaser table with horizontal scroll container */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden text-xs">
                <div className="bg-neutral-50 px-4 py-2 font-bold text-neutral-700 uppercase tracking-wider text-[10px]">
                  Recent Recorded Ledger Events
                </div>
                <div className="overflow-x-auto w-full">
                  <div className="min-w-[420px] divide-y divide-neutral-100">
                    <div className="px-4 py-2.5 flex items-center justify-between">
                      <span className="font-mono font-bold text-neutral-950">INV-1024</span>
                      <span className="font-medium text-neutral-800">Nimesh Pathak</span>
                      <span className="font-mono font-bold text-neutral-950">₹42,500</span>
                      <Badge variant="paid">Paid</Badge>
                    </div>
                    <div className="px-4 py-2.5 flex items-center justify-between">
                      <span className="font-mono font-bold text-neutral-950">BILL-2041</span>
                      <span className="font-medium text-neutral-800">Azure Furniture</span>
                      <span className="font-mono font-bold text-neutral-950">₹75,000</span>
                      <Badge variant="pending">Pending</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- METRICS SECTION --- */}
      <section id="metrics" className="py-16 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 border border-neutral-200 rounded-xl bg-neutral-50/50">
              <div className="text-3xl sm:text-4xl font-black font-mono text-neutral-950">₹12.8L+</div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-2">
                Monthly Turnover Tracked
              </div>
            </div>
            <div className="p-6 border border-neutral-200 rounded-xl bg-neutral-50/50">
              <div className="text-3xl sm:text-4xl font-black font-mono text-neutral-950">100%</div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-2">
                Double-Entry Balance Verification
              </div>
            </div>
            <div className="p-6 border border-neutral-200 rounded-xl bg-neutral-50/50">
              <div className="text-3xl sm:text-4xl font-black font-mono text-neutral-950">3-Tier</div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-2">
                Strict Role Governance
              </div>
            </div>
            <div className="p-6 border border-neutral-200 rounded-xl bg-neutral-50/50">
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#2e7d32]">Zero Lag</div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-2">
                Local-State React Client
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-20 bg-[#fafafa] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="outline" className="text-xs font-semibold uppercase tracking-widest">
              Core Accounting Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              Enterprise Grade Financial Engineering
            </h2>
            <p className="text-sm text-neutral-500">
              Everything required to manage high-volume commercial furniture projects, supplier payables, and statutory balance sheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 (Interactive Double-Entry Sandbox Trigger) */}
            <div
              onClick={() => setIsDoubleEntryOpen(true)}
              className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs space-y-3 hover:border-neutral-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-neutral-100 group-hover:bg-neutral-950 group-hover:text-white transition-colors text-neutral-900 rounded-lg w-fit">
                  <Scale className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-neutral-500 group-hover:text-neutral-950 transition-colors flex items-center gap-1">
                  Open Demo <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-950 group-hover:text-neutral-900">Double-Entry Journal Balancing</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Debit and Credit balancing validator ensures that every journal entry balances to ₹0 difference before posting to the general ledger. Click to try live simulator.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs space-y-3">
              <div className="p-2.5 bg-neutral-100 text-[#2e7d32] rounded-lg w-fit">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">Subtle Green Profit & Red Loss</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Instant visual feedback across P&L, products, and cost centers: profitable items highlighted in crisp green and deficit units in red.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs space-y-3">
              <div className="p-2.5 bg-neutral-100 text-neutral-900 rounded-lg w-fit">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">Customer & Vendor Master</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Filter clients, timber mills, and dual-purpose partners with address books, outstanding balances, and favorite pins.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs space-y-3">
              <div className="p-2.5 bg-neutral-100 text-neutral-900 rounded-lg w-fit">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">Product SKU & Raw Material Stock</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Track physical inventory, low stock thresholds, unit production costs, and profit margins on executive desks and seating.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs space-y-3">
              <div className="p-2.5 bg-neutral-100 text-neutral-900 rounded-lg w-fit">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">GST Tax Invoices & Print Ready</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Formatted tax invoices with GST calculations, bank wire details, browser print functionality, and download triggers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs space-y-3">
              <div className="p-2.5 bg-neutral-100 text-neutral-900 rounded-lg w-fit">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">CapEx & OpEx Departmental Budgets</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Quarterly budget allocations with semantic consumption pace bars (green under budget, amber near threshold, red overrun).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- DOUBLE-ENTRY ACCOUNTING SECTION (#accounting) --- */}
      <section id="accounting" className="py-20 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="outline" className="text-xs font-semibold uppercase tracking-widest text-neutral-900 border-neutral-300">
              Statutory Double-Entry Standard
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              Zero-Tolerance Double-Entry Balancing Engine
            </h2>
            <p className="text-sm text-neutral-500">
              Every financial transaction strictly complies with the fundamental accounting equation: <span className="font-mono font-bold text-neutral-900">Assets = Liabilities + Equity</span>. Postings are mathematically prevented until <span className="font-mono font-bold text-neutral-900">Total Debit = Total Credit (₹0 difference)</span>.
            </p>
          </div>

          {/* Live Simulator Preview Card */}
          <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-[#fafafa] rounded-2xl border border-neutral-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-neutral-900 text-white rounded-lg">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-950">Live Journal Voucher Verification</h3>
                </div>
                <p className="text-xs text-neutral-500">
                  Try our interactive sandbox to simulate real double-entry journal vouchers with instant debit/credit balance checks.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsDoubleEntryOpen(true)}
                className="gap-2 font-bold shadow-xs cursor-pointer"
              >
                <span>Open Double-Entry Sandbox</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Visual Example Card */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden text-xs">
              <div className="bg-neutral-100/70 p-3 border-b border-neutral-200 flex items-center justify-between font-mono font-semibold text-neutral-600">
                <span>VOUCHER: JV-2026-089 (Customer NEFT Receipt)</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                  ✓ STATUS: BALANCED (₹0.00 Diff)
                </span>
              </div>
              <div className="divide-y divide-neutral-100">
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-neutral-900">1001 - HDFC Bank Current A/c</span>
                    <span className="text-neutral-400 ml-2">(Asset - Inward NEFT Credit)</span>
                  </div>
                  <div className="font-mono">
                    <span className="text-emerald-700 font-bold">Dr: ₹85,000.00</span>
                    <span className="text-neutral-300 mx-2">|</span>
                    <span className="text-neutral-400">Cr: ₹0.00</span>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-neutral-900">4001 - Commercial Furniture Sales</span>
                    <span className="text-neutral-400 ml-2">(Income - Revenue Recognition)</span>
                  </div>
                  <div className="font-mono">
                    <span className="text-neutral-400">Dr: ₹0.00</span>
                    <span className="text-neutral-300 mx-2">|</span>
                    <span className="text-neutral-900 font-bold">Cr: ₹85,000.00</span>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 p-3 border-t border-neutral-200 flex items-center justify-between font-mono font-bold text-neutral-900">
                <span>Total Debit: ₹85,000.00</span>
                <span>Total Credit: ₹85,000.00</span>
                <span className="text-emerald-700">Net Difference: ₹0.00</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500 pt-2">
              <span>Automatic general ledger posting • Audit trail tracking • Double-entry integrity guaranteed</span>
              <button
                type="button"
                onClick={() => setIsDoubleEntryOpen(true)}
                className="font-bold text-neutral-950 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Launch Interactive Demo Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- ROLE ARCHITECTURE SECTION --- */}
      <section id="roles" className="py-20 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              Three Dedicated Role Workspaces
            </h2>
            <p className="text-sm text-neutral-500">
              Each user persona receives an isolated, tailored experience with zero access leaks.
            </p>

            {/* Tabs (Fully responsive flex-wrap) */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setActiveTab('admin')}
                className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                1. Managing Director (Admin)
              </button>
              <button
                onClick={() => setActiveTab('accountant')}
                className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  activeTab === 'accountant'
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                2. Chartered Accountant
              </button>
              <button
                onClick={() => setActiveTab('client')}
                className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  activeTab === 'client'
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                3. Client Portal (Customer)
              </button>
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="max-w-4xl mx-auto p-5 sm:p-8 bg-[#fafafa] rounded-2xl border border-neutral-200 shadow-xs">
            {activeTab === 'admin' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-950">Admin Perspective: Complete Unrestricted Oversight</h3>
                  <Badge variant="dark" className="self-start sm:self-auto shrink-0">Full Access</Badge>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Managing directors and company partners have total command over chart of accounts, master journals, system taxation parameters, P&L statements, balance sheets, and user roles.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 text-xs">
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ System Settings & GSTIN</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ Profit & Loss Reporting</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ Balance Sheet Equation</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ Double-Entry Journal Posting</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ CapEx Budget Control</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ Contact & Vendor Master</div>
                </div>
                <div className="pt-3">
                  <Button size="sm" variant="primary" onClick={() => openAuth('login', 'Admin')} className="w-full sm:w-auto font-bold shadow-xs cursor-pointer">
                    Launch as Admin
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'accountant' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-950">Accountant Perspective: Bookkeeping & General Ledgers</h3>
                  <Badge variant="default" className="self-start sm:self-auto shrink-0">Accounting & Audit</Badge>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Chartered accountants and finance managers can post double-entry vouchers, reconcile vendor bills, record client NEFT payments, and audit running ledger balances.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 text-xs">
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ Double-Entry Journal Entries</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ Running Ledger Balances</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ Sales & Purchase Postings</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ Bank & Cash Reconciliation</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ Inventory Valuation</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md text-neutral-400">✗ Settings (Restricted)</div>
                </div>
                <div className="pt-3">
                  <Button size="sm" variant="primary" onClick={() => openAuth('login', 'Accountant')} className="w-full sm:w-auto font-bold shadow-xs cursor-pointer">
                    Launch as Accountant
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'client' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-950">Client Portal: Clean Customer & Vendor Interface</h3>
                  <Badge variant="outline" className="self-start sm:self-auto shrink-0">Client View</Badge>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  B2B corporate clients and timber suppliers only see their personal invoices, bills, clearance receipts, and billing profile. Private company ledgers are completely hidden.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 text-xs">
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ My Invoices & Pay Now</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ My Vendor Bills</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ Payment Clearance Log</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md font-medium">✓ Company Billing Profile</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md text-neutral-400">✗ General Ledger (Hidden)</div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-md text-neutral-400">✗ Company P&L (Hidden)</div>
                </div>
                <div className="pt-3">
                  <Button size="sm" variant="primary" onClick={() => openAuth('login', 'Contact User')} className="w-full sm:w-auto font-bold shadow-xs cursor-pointer">
                    Launch as Client User
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION BANNER --- */}
      <section className="py-16 sm:py-20 bg-neutral-950 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Ready to experience next-generation accounting?
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
            Launch the Urban Furniture accounting ERP prototype now. Switch between Admin, Accountant, and Client roles with 1 click.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              variant="outline"
              onClick={() => openAuth('signup')}
              className="w-full sm:w-auto bg-white text-neutral-950 hover:bg-neutral-100 font-bold px-8 shadow-sm cursor-pointer"
            >
              Get Started Free
            </Button>
            <button
              type="button"
              onClick={() => openAuth('login', 'Admin')}
              className="w-full sm:w-auto px-8 py-3 text-sm font-semibold rounded-md border border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer text-center"
            >
              One-Click Demo Launch
            </button>
          </div>
        </div>
      </section>

      {/* Reusable Public Footer */}
      <PublicFooter
        onOpenAuth={(tab) => openAuth(tab, 'Admin')}
        onOpenDoubleEntry={() => setIsDoubleEntryOpen(true)}
      />

      {/* Auth Modal Popup Box */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuth}
        initialTab={authModal.tab}
        initialRole={authModal.role}
      />

      {/* Double-Entry Interactive Sandbox Modal */}
      <DoubleEntryModal
        isOpen={isDoubleEntryOpen}
        onClose={() => setIsDoubleEntryOpen(false)}
        onLaunchERP={(role) => openAuth('login', role || 'Accountant')}
      />
    </div>
  );
};
