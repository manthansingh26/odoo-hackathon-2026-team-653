import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Scale,
  PieChart,
  Boxes,
  BookOpen,
  ArrowRight,
  Receipt,
  ShoppingCart,
  CreditCard
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const ReportsHub = () => {
  const reports = [
    {
      title: "Profit & Loss (Income Statement)",
      description: "Comprehensive breakdown of commercial sales, production COGS, overheads, and net profit margins.",
      icon: TrendingUp,
      url: "/reports/profit-loss",
      badge: "Core Financials"
    },
    {
      title: "Balance Sheet",
      description: "Financial standing equation: Total Assets equals Total Liabilities plus Owner Equity.",
      icon: Scale,
      url: "/reports/balance-sheet",
      badge: "Core Financials"
    },
    {
      title: "Budget Performance Report",
      description: "Comparison of departmental planned allocations against actual outlays with utilization gauges.",
      icon: PieChart,
      url: "/reports/budget",
      badge: "Cost Control"
    },
    {
      title: "Stock & Inventory Valuation",
      description: "Physical stock levels, opening vs purchased vs sold balances, reorder indicators, and total asset worth.",
      icon: Boxes,
      url: "/reports/stock",
      badge: "Inventory"
    },
    {
      title: "General Ledger Statement",
      description: "Account-by-account transaction drilldown with debits, credits, and running balance calculation.",
      icon: BookOpen,
      url: "/reports/ledger",
      badge: "Audit & Tax"
    },
    {
      title: "Sales Summary Report",
      description: "Revenue performance across ergonomic seating, executive desks, acoustic pods, and corporate clients.",
      icon: Receipt,
      url: "/sales-orders",
      badge: "Commercial"
    },
    {
      title: "Purchases & Vendor Outlays",
      description: "Audit of procurement commitments, timber supplier bills, and payment maturities.",
      icon: ShoppingCart,
      url: "/vendor-bills",
      badge: "Procurement"
    },
    {
      title: "Payments & Treasury Log",
      description: "Chronological cash and banking journal detailing inbound receipts and vendor settlements.",
      icon: CreditCard,
      url: "/payments",
      badge: "Treasury"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">Financial Reports & Statements</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Executive reporting center for Urban Furniture corporate accounting and statutory filings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((rep, idx) => {
          const IconComponent = rep.icon;

          return (
            <Card key={idx} className="flex flex-col justify-between hover:border-neutral-400 transition-all group">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-200 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                    {rep.badge}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-base group-hover:text-neutral-950 transition-colors">
                    {rep.title}
                  </CardTitle>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    {rep.description}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to={rep.url}>
                  <Button variant="outline" size="sm" className="w-full justify-between text-xs group-hover:border-neutral-900">
                    <span>View Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
