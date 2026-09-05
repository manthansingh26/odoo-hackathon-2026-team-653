import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  FileText,
  Calendar,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useAppContext } from '../context/AppContext';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';

export const Dashboard = () => {
  const { data, userRole, setActiveModal, formatINR } = useAppContext();
  const [timeRange, setTimeRange] = useState('This Month');

  const { kpi, chartData, recentTransactions } = data;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
            Good morning, {userRole === 'Contact User' ? 'Nimesh' : 'Admin'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Here's what's happening with Urban Furniture today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Q2 FY 2026</option>
              <option>Fiscal Year 2026-27</option>
            </select>
          </div>

          {userRole !== 'Contact User' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setActiveModal({ type: 'NEW_INVOICE' })}
              className="shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Invoice
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards (Section 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sales"
          amount={formatINR(kpi.totalSales)}
          change={kpi.salesChange}
          isPositive={true}
          icon={TrendingUp}
          subtitle="vs last month"
        />

        <StatCard
          title="Total Purchases"
          amount={formatINR(kpi.totalPurchases)}
          change={kpi.purchasesChange}
          isPositive={null}
          icon={ShoppingCart}
          subtitle="materials & cogs"
        />

        <StatCard
          title="Net Profit"
          amount={formatINR(kpi.netProfit)}
          change={kpi.profitChange}
          isPositive={true}
          variant="profit"
          icon={DollarSign}
          subtitle="after operational expenses"
        />

        <StatCard
          title="Outstanding Receivables"
          amount={formatINR(kpi.outstandingReceivables)}
          variant="warning"
          icon={CreditCard}
          subtitle={kpi.receivablesAlert}
        />
      </div>

      {/* Quick Action Bar (Section 8) */}
      {userRole !== 'Contact User' && (
        <Card className="bg-gradient-to-r from-neutral-900 to-neutral-950 text-white border-0 shadow-md">
          <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Instantly execute accounting workflows and record new transactions.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
                onClick={() => setActiveModal({ type: 'NEW_INVOICE' })}
              >
                + New Invoice
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
                onClick={() => setActiveModal({ type: 'NEW_BILL' })}
              >
                + New Bill
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
                onClick={() => setActiveModal({ type: 'NEW_PAYMENT' })}
              >
                + Record Payment
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
                onClick={() => setActiveModal({ type: 'ADD_CONTACT' })}
              >
                + Add Contact
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
                onClick={() => setActiveModal({ type: 'ADD_PRODUCT' })}
              >
                + Add Product
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Dashboard Charts (Section 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sales, Purchases & Net Profit</CardTitle>
              <p className="text-xs text-neutral-500 mt-0.5">
                Monthly trend analysis in INR (mostly grayscale, subtle green profit)
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.salesOverview} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                  />
                  <Tooltip
                    formatter={(val) => [formatINR(val), '']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="sales" name="Sales" stroke="#111827" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="purchases" name="Purchases" stroke="#9ca3af" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="profit" name="Profit" stroke="#2e7d32" strokeWidth={2.5} dot={{ r: 4, fill: '#2e7d32' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue vs Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue vs Expenses by Category</CardTitle>
              <p className="text-xs text-neutral-500 mt-0.5">
                Top furniture manufacturing and retail categories
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.revenueVsExpenses} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                  />
                  <Tooltip
                    formatter={(val) => [formatINR(val), '']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#111827" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Direct Cost" fill="#d1d5db" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Weekly Cash Flow</CardTitle>
            <p className="text-xs text-neutral-500 mt-0.5">
              Liquidity tracking: Inflow (Cash In) vs Outflow (Cash Out)
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.cashFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  formatter={(val) => [formatINR(val), '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="cashIn" name="Cash In" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cashOut" name="Cash Out" fill="#9ca3af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions Table (Section 7) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Accounting Transactions</CardTitle>
            <p className="text-xs text-neutral-500 mt-0.5">
              Latest invoices, bills, and payments recorded in Urban Furniture ledger
            </p>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Contact Party</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((tx) => {
                  let badgeVariant = 'default';
                  if (tx.status === 'Paid' || tx.status === 'Completed') badgeVariant = 'paid';
                  else if (tx.status === 'Pending') badgeVariant = 'pending';
                  else if (tx.status === 'Overdue') badgeVariant = 'overdue';

                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs text-neutral-600">
                        {tx.date}
                      </TableCell>
                      <TableCell className="font-semibold text-neutral-950 font-mono text-xs">
                        {tx.reference}
                      </TableCell>
                      <TableCell className="font-medium text-neutral-900">
                        {tx.contact}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-0.5 bg-neutral-100 rounded-md font-medium text-neutral-700">
                          {tx.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono font-semibold text-neutral-950">
                        {formatINR(tx.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={badgeVariant}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-neutral-500">
                        {tx.paymentMethod || 'Bank'}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-neutral-400">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
