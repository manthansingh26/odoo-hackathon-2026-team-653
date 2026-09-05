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

export const LandingPage = () => {
  const { isAuthenticated, currentUser, formatINR, login } = useAppContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleQuickLaunch = (role = 'Admin') => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { role } });
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* --- TOP FIXED & TRANSPARENT BLURRED NAVBAR --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-md border-b border-neutral-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Branding */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-8 w-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center text-sm font-black font-mono shadow-xs group-hover:bg-neutral-800 transition-colors">
              U
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-widest text-neutral-950 uppercase font-mono">
                URBAN
              </span>
              <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-500 uppercase -mt-1">
                ACCOUNTING SYSTEM
              </span>
            </div>
          </Link>

          {/* Desktop Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-600">
            <a href="#features" className="hover:text-neutral-950 transition-colors">Features</a>
            <a href="#metrics" className="hover:text-neutral-950 transition-colors">Metrics</a>
            <a href="#roles" className="hover:text-neutral-950 transition-colors">Role Architecture</a>
            <a href="#accounting" className="hover:text-neutral-950 transition-colors">Double-Entry</a>
          </nav>

          {/* Right Action CTA Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm" className="gap-1.5 text-xs shadow-xs">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold text-neutral-700 hover:text-neutral-950">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" className="gap-1.5 text-xs shadow-xs font-semibold">
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Controls: Get Started + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {!isAuthenticated ? (
              <Link to="/signup">
                <Button variant="primary" size="sm" className="text-[11px] px-2.5 py-1 font-semibold gap-1">
                  <span>Get Started</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            ) : (
              <Link to="/dashboard">
                <Button variant="primary" size="sm" className="text-[11px] px-2.5 py-1 font-semibold">
                  Dashboard
                </Button>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-neutral-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-xl">
            <nav className="flex flex-col space-y-2 text-xs font-semibold text-neutral-700">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
              >
                Features
              </a>
              <a
                href="#metrics"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
              >
                Metrics
              </a>
              <a
                href="#roles"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
              >
                Role Architecture
              </a>
            </nav>
            <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full text-xs font-semibold gap-1.5">
                      <span>Get Started Free</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full text-xs font-semibold gap-1.5">
                    <span>Open ERP Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

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
            <Link to="/signup">
              <Button size="lg" variant="primary" className="w-full sm:w-auto px-8 gap-2 font-bold shadow-md">
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <button
              onClick={() => handleQuickLaunch('Admin')}
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
                    onClick={() => handleQuickLaunch('Admin')}
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
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs space-y-3">
              <div className="p-2.5 bg-neutral-100 text-neutral-900 rounded-lg w-fit">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">Double-Entry Journal Balancing</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Debit and Credit balancing validator ensures that every journal entry balances to ₹0 difference before posting to the general ledger.
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
                  <Button size="sm" variant="primary" onClick={() => handleQuickLaunch('Admin')} className="w-full sm:w-auto font-bold shadow-xs">
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
                  <Button size="sm" variant="primary" onClick={() => handleQuickLaunch('Accountant')} className="w-full sm:w-auto font-bold shadow-xs">
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
                  <Button size="sm" variant="primary" onClick={() => handleQuickLaunch('Contact User')} className="w-full sm:w-auto font-bold shadow-xs">
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
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-neutral-950 hover:bg-neutral-100 font-bold px-8 shadow-sm">
                Get Started Free
              </Button>
            </Link>
            <button
              onClick={() => handleQuickLaunch('Admin')}
              className="w-full sm:w-auto px-8 py-3 text-sm font-semibold rounded-md border border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer text-center"
            >
              One-Click Demo Launch
            </button>
          </div>
        </div>
      </section>

      {/* --- RESPONSIVE FOOTER --- */}
      <footer className="bg-white border-t border-neutral-200 py-10 sm:py-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-neutral-950 text-white flex items-center justify-center text-xs font-black font-mono">
              U
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 font-medium">
              <span className="font-bold text-neutral-900">Urban Furniture Pvt. Ltd.</span>
              <span className="hidden sm:inline">•</span>
              <span>GSTIN: 27AAACU1234F1Z5</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium">
            <a href="#features" className="hover:text-neutral-950 transition-colors">Features</a>
            <a href="#metrics" className="hover:text-neutral-950 transition-colors">Metrics</a>
            <a href="#roles" className="hover:text-neutral-950 transition-colors">Roles</a>
            <Link to="/login" className="hover:text-neutral-950 transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-neutral-950 transition-colors">Register</Link>
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className="hover:text-neutral-950 transition-colors">ERP Workspace</Link>
          </div>

          <div className="text-center md:text-right text-[11px] text-neutral-400">
            &copy; {new Date().getFullYear()} Urban Accounting System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
