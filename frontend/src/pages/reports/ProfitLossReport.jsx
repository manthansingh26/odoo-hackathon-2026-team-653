import React, { useState } from 'react';
import {
  Printer,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Filter
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export const ProfitLossReport = () => {
  const { data, formatINR, addToast } = useAppContext();
  const [period, setPeriod] = useState('FY 2026-27 (YTD)');

  // Extract from Chart of Accounts
  const accounts = data.accounts || [];

  const incomeAccounts = accounts.filter(a => a.category === 'Income');
  const expenseAccounts = accounts.filter(a => a.category === 'Expenses');

  const totalIncome = incomeAccounts.reduce((acc, a) => acc + (Number(a.balance) || 0), 0);
  const totalExpenses = expenseAccounts.reduce((acc, a) => acc + (Number(a.balance) || 0), 0);

  const netProfit = totalIncome - totalExpenses;
  const isProfit = netProfit >= 0;

  const chartComparison = [
    { name: 'Income vs Expense', Income: totalIncome, Expense: totalExpenses }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const rows = [
      ['Category', 'Account', 'Amount (INR)'],
      ...incomeAccounts.map(a => ['Income', a.name, a.balance]),
      ['Total Income', '', totalIncome],
      ...expenseAccounts.map(a => ['Expense', a.name, a.balance]),
      ['Total Expenses', '', totalExpenses],
      ['Net Profit / Loss', '', netProfit]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Urban_Furniture_Profit_Loss_${period.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ title: "Exported", message: "P&L Statement exported to CSV.", type: "success" });
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">Profit & Loss Statement</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Urban Furniture operating statement of revenues, costs of manufacturing, and net profit.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <div className="flex items-center gap-2 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option>FY 2026-27 (YTD)</option>
              <option>Quarter 2 (Jul - Sep 2026)</option>
              <option>Quarter 1 (Apr - Jun 2026)</option>
              <option>Previous Fiscal Year 2025-26</option>
            </select>
          </div>

          <Button size="sm" variant="outline" onClick={handleExportCSV} className="text-xs gap-1">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button size="sm" variant="outline" onClick={handlePrint} className="text-xs gap-1">
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Net Profit Big Highlight Box (Section 20 requirement) */}
      <div
        className={`p-6 rounded-xl border transition-all ${
          isProfit
            ? 'bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32]'
            : 'bg-[#ffebee] border-[#ffcdd2] text-[#c62828]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest block opacity-80">
              Net Bottom-Line Result ({period})
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono mt-1 tracking-tight">
              {formatINR(Math.abs(netProfit))} {isProfit ? 'PROFIT' : 'LOSS'}
            </div>
            <p className="text-xs mt-1 opacity-90">
              Formula: Total Income ({formatINR(totalIncome)}) - Total Expenses ({formatINR(totalExpenses)})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-xs uppercase font-bold block opacity-75">Net Margin</span>
              <span className="font-mono text-xl font-bold">
                {totalIncome > 0 ? `${((netProfit / totalIncome) * 100).toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Visual Chart (Section 20) */}
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartComparison} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip formatter={(val) => [formatINR(val), '']} />
                <Legend />
                <Bar dataKey="Income" name="Gross Income" fill="#111827" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Expense" name="Operating Expenses" fill="#9ca3af" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Structured P&L Table (Section 20) */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        {/* INCOME SECTION */}
        <div className="bg-neutral-900 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex justify-between">
          <span>Income / Operating Revenues</span>
          <span>Amount (INR)</span>
        </div>
        <Table>
          <TableBody>
            {incomeAccounts.map((acc) => (
              <TableRow key={acc.id}>
                <TableCell className="pl-6 font-medium text-neutral-800 text-sm">
                  {acc.name} <span className="text-[11px] text-neutral-400 font-mono">({acc.code})</span>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-neutral-950">
                  {formatINR(acc.balance)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-neutral-100 font-bold text-neutral-950">
              <TableCell className="pl-6">Total Income</TableCell>
              <TableCell className="text-right font-mono text-base font-bold">
                {formatINR(totalIncome)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* EXPENSES SECTION */}
        <div className="bg-neutral-900 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex justify-between mt-4">
          <span>Operating Expenses / COGS</span>
          <span>Amount (INR)</span>
        </div>
        <Table>
          <TableBody>
            {expenseAccounts.map((acc) => (
              <TableRow key={acc.id}>
                <TableCell className="pl-6 font-medium text-neutral-800 text-sm">
                  {acc.name} <span className="text-[11px] text-neutral-400 font-mono">({acc.code})</span>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-neutral-950">
                  {formatINR(acc.balance)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-neutral-100 font-bold text-neutral-950">
              <TableCell className="pl-6">Total Expenses</TableCell>
              <TableCell className="text-right font-mono text-base font-bold">
                {formatINR(totalExpenses)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* NET PROFIT SUMMARY ROW */}
        <div
          className={`p-4 border-t-2 border-neutral-950 flex justify-between items-center text-base font-bold ${
            isProfit ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#ffebee] text-[#c62828]'
          }`}
        >
          <span>NET OPERATING PROFIT / (LOSS)</span>
          <span className="font-mono text-xl">
            {formatINR(netProfit)}
          </span>
        </div>
      </div>
    </div>
  );
};
