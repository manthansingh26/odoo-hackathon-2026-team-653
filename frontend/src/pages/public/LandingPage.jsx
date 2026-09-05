import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Boxes,
  Users,
  Scale,
  ArrowUpRight
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const LandingPage = () => {
  const { isAuthenticated } = useAppContext();

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans antialiased overflow-x-hidden flex flex-col justify-between">
      {/* Top Navbar — Brand Logo & Sign In */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-8 w-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center text-sm font-black font-mono shadow-xs">
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

          <Link to={isAuthenticated ? "/dashboard" : "/login"}>
            <Button size="sm" variant="primary" className="font-semibold text-xs gap-1.5 shadow-xs">
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-24 bg-[#fafafa] border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2e7d32]" />
              <span>Commercial Furniture Financial Accounting ERP</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-neutral-950 max-w-4xl mx-auto leading-[1.08]">
              Double-Entry Accounting & ERP for <span className="underline decoration-neutral-300 underline-offset-8">Urban Furniture</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Streamline timber procurement, balanced general ledgers, sales tax invoicing, and statutory balance sheets in a clean, professional workspace.
            </p>

            <div className="flex items-center justify-center pt-2">
              <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                <Button size="lg" variant="primary" className="px-8 gap-2 font-bold shadow-md">
                  <span>{isAuthenticated ? 'Open ERP Dashboard' : 'Access Accounting System'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Interactive Live Preview Card */}
            <div className="mt-8 sm:mt-12 max-w-5xl mx-auto bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden text-left w-full">
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
                  Live System Overview
                </Badge>
              </div>

              <div className="p-4 sm:p-6 space-y-6 bg-white">
                <div className="pb-4 border-b border-neutral-100">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-950">Financial Overview</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Real-time status of commercial operations and general ledger balances.</p>
                </div>

                {/* 4 KPI Cards Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl border border-neutral-200 bg-[#fafafa]">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Sales</span>
                    <div className="text-xl font-black font-mono text-neutral-950 mt-1">₹21,29,660</div>
                    <span className="text-[11px] inline-flex items-center gap-0.5 text-[#2e7d32] font-semibold mt-1">
                      <ArrowUpRight className="w-3 h-3" /> +12.5% vs last month
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-[#fafafa]">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Purchases</span>
                    <div className="text-xl font-black font-mono text-neutral-950 mt-1">₹10,99,300</div>
                    <span className="text-[11px] text-neutral-500 font-semibold mt-1">
                      Raw materials & inventory
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border border-[#c8e6c9] bg-[#e8f5e9]">
                    <span className="text-[10px] uppercase font-bold text-[#2e7d32] block">Net Operating Profit</span>
                    <div className="text-xl font-black font-mono text-[#2e7d32] mt-1">₹10,30,360</div>
                    <span className="text-[11px] inline-flex items-center gap-0.5 text-[#2e7d32] font-semibold mt-1">
                      <ArrowUpRight className="w-3 h-3" /> Balanced Equity
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">Outstanding Receivables</span>
                    <div className="text-xl font-black font-mono text-neutral-950 mt-1">₹7,77,000</div>
                    <span className="text-[11px] text-amber-800 font-semibold mt-1">
                      Pending client clearance
                    </span>
                  </div>
                </div>

                {/* Transactions teaser table */}
                <div className="border border-neutral-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-neutral-50 px-4 py-2 font-bold text-neutral-700 uppercase tracking-wider text-[10px]">
                    Recent Recorded Ledger Events
                  </div>
                  <div className="overflow-x-auto w-full">
                    <div className="min-w-[420px] divide-y divide-neutral-100">
                      <div className="px-4 py-2.5 flex items-center justify-between">
                        <span className="font-mono font-bold text-neutral-950">INV-2026-027</span>
                        <span className="font-medium text-neutral-800">Nimesh Pathak Enterprises</span>
                        <span className="font-mono font-bold text-neutral-950">₹42,500</span>
                        <Badge variant="pending">Pending</Badge>
                      </div>
                      <div className="px-4 py-2.5 flex items-center justify-between">
                        <span className="font-mono font-bold text-neutral-950">BILL-2026-022</span>
                        <span className="font-medium text-neutral-800">Godavari Leather & Textiles</span>
                        <span className="font-mono font-bold text-neutral-950">₹49,000</span>
                        <Badge variant="pending">Pending</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Accounting Modules Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
                Integrated Financial Architecture
              </h2>
              <p className="text-sm text-neutral-500">
                Designed for commercial furniture manufacturing, vendor bill reconciliations, and statutory reporting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-[#fafafa] rounded-xl border border-neutral-200 shadow-xs space-y-3">
                <div className="p-2.5 bg-white text-neutral-900 border border-neutral-200 rounded-lg w-fit">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-950">Double-Entry Journals</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Strict debit-credit balancing invariant ensures every posted journal entry maintains zero suspense difference.
                </p>
              </div>

              <div className="p-6 bg-[#fafafa] rounded-xl border border-neutral-200 shadow-xs space-y-3">
                <div className="p-2.5 bg-white text-[#2e7d32] border border-neutral-200 rounded-lg w-fit">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-950">P&L & Balance Sheet</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Running ledger calculations with net profit reconciliation directly feeding into the equity balance sheet equation.
                </p>
              </div>

              <div className="p-6 bg-[#fafafa] rounded-xl border border-neutral-200 shadow-xs space-y-3">
                <div className="p-2.5 bg-white text-neutral-900 border border-neutral-200 rounded-lg w-fit">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-950">Contact Master</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Consolidated management of corporate B2B clients, timber mills, logistics partners, and material suppliers.
                </p>
              </div>

              <div className="p-6 bg-[#fafafa] rounded-xl border border-neutral-200 shadow-xs space-y-3">
                <div className="p-2.5 bg-white text-neutral-900 border border-neutral-200 rounded-lg w-fit">
                  <Boxes className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-950">Inventory Valuation</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  SKU-level stock tracking across desks, ergonomic seating, velvet sofas, and acoustic privacy pods.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Professional Footer */}
      <footer className="border-t border-neutral-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="h-5 w-5 rounded bg-neutral-950 text-white flex items-center justify-center text-[10px] font-black font-mono">
                U
              </div>
              <span className="text-xs font-bold text-neutral-950 font-mono tracking-wider">
                Urban Accounting System
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Double-entry accounting and ERP workspace for modern furniture businesses.
            </p>
          </div>
          <div className="text-xs text-neutral-400 font-mono">
            &copy; 2026 Urban Accounting System
          </div>
        </div>
      </footer>
    </div>
  );
};
