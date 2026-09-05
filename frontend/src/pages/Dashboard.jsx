import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Plus,
  CreditCard,
  Calendar
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
  const { data, userRole, currentUser, setActiveModal, formatINR } = useAppContext();
  const [timeRange, setTimeRange] = useState('This Month');
  const [activeTableTab, setActiveTableTab] = useState('transactions'); // 'transactions' | 'journalEntries'

  const { kpi, chartData, recentTransactions, journalEntries } = data;

  // Filter transactions dynamically based on selected timeRange
  const filteredTransactions = React.useMemo(() => {
    if (!recentTransactions || recentTransactions.length === 0) return [];
    if (timeRange === 'All' || timeRange === 'Fiscal Year 2026-27') return recentTransactions;

    const sorted = [...recentTransactions].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    if (sorted.length === 0) return [];

    const latestDate = new Date(sorted[0].date || '2026-09-05');

    if (timeRange === 'Today') {
      const targetStr = latestDate.toISOString().slice(0, 10);
      return sorted.filter(t => (t.date || '').slice(0, 10) === targetStr);
    }
    if (timeRange === 'This Week') {
      const weekAgo = new Date(latestDate.getTime() - 7 * 86400000);
      return sorted.filter(t => new Date(t.date || 0) >= weekAgo);
    }
    if (timeRange === 'This Month') {
      const monthPrefix = latestDate.toISOString().slice(0, 7);
      return sorted.filter(t => (t.date || '').startsWith(monthPrefix));
    }
    if (timeRange === 'Q2 FY 2026') {
      return sorted.filter(t => {
        const d = (t.date || '').slice(0, 10);
        return d >= '2026-07-01' && d <= '2026-09-30';
      });
    }
    return sorted;
  }, [recentTransactions, timeRange]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
            Good day, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Finance Team'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Enterprise overview and double-entry accounting status for Urban Furniture.
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

      {/* Recent Ledger & Double-Entry Activity */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle>
              {activeTableTab === 'transactions' ? 'Recent Accounting Transactions' : 'Recent Journal Vouchers (Double-Entry)'}
            </CardTitle>
            <p className="text-xs text-neutral-500 mt-0.5">
              {activeTableTab === 'transactions'
                ? 'Latest sales invoices, purchase bills, and cash flows recorded in ledger'
                : 'Balanced debit and credit voucher records posted to PostgreSQL'}
            </p>
          </div>
          <div className="flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTableTab('transactions')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTableTab === 'transactions'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Transactions ({filteredTransactions?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTableTab('journalEntries')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTableTab === 'journalEntries'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Journal Vouchers ({journalEntries?.length || 0})
            </button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          {activeTableTab === 'transactions' ? (
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
                {filteredTransactions && filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => {
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
                      No transactions recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voucher Ref</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Journal</TableHead>
                  <TableHead>Narration</TableHead>
                  <TableHead>Debit (₹)</TableHead>
                  <TableHead>Credit (₹)</TableHead>
                  <TableHead>Balance Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journalEntries && journalEntries.length > 0 ? (
                  journalEntries.map((je) => {
                    const dateStr = je.transactionDate
                      ? (typeof je.transactionDate === 'string' ? je.transactionDate.slice(0, 10) : new Date(je.transactionDate).toISOString().slice(0, 10))
                      : (je.date || '-');
                    const isBalanced = Number(je.totalDebit) > 0 && Math.abs(Number(je.totalDebit) - Number(je.totalCredit)) < 1;

                    return (
                      <TableRow key={je.id}>
                        <TableCell className="font-mono font-semibold text-xs text-neutral-950">
                          {je.reference || je.id}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-neutral-600">
                          {dateStr}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs px-2 py-0.5 bg-neutral-100 rounded-md font-medium text-neutral-700">
                            {je.journal || 'General Journal'}
                          </span>
                        </TableCell>
                        <TableCell className="text-neutral-800 text-xs max-w-xs truncate">
                          {je.description || '-'}
                        </TableCell>
                        <TableCell className="font-mono font-semibold text-neutral-950 text-xs">
                          {formatINR(je.totalDebit || 0)}
                        </TableCell>
                        <TableCell className="font-mono font-semibold text-neutral-950 text-xs">
                          {formatINR(je.totalCredit || 0)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={isBalanced ? 'paid' : 'loss'}>
                            {isBalanced ? 'Balanced' : 'Unbalanced'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-neutral-400">
                      No journal entries recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
};
