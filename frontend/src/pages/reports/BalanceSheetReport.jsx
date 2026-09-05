import React, { useState } from 'react';
import { Printer, Download, Scale, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export const BalanceSheetReport = () => {
  const { data, formatINR, addToast } = useAppContext();
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().slice(0, 10));

  const accounts = data.accounts || [];

  const assetAccounts = accounts.filter(a => a.category === 'Assets');
  const liabilityAccounts = accounts.filter(a => a.category === 'Liabilities');
  const capitalAccounts = accounts.filter(a => a.category === 'Capital');
  const incomeAccounts = accounts.filter(a => a.category === 'Income');
  const expenseAccounts = accounts.filter(a => a.category === 'Expenses');

  const totalAssets = assetAccounts.reduce((acc, a) => acc + (Number(a.balance) || 0), 0);
  const totalLiabilities = liabilityAccounts.reduce((acc, a) => acc + (Number(a.balance) || 0), 0);
  const totalCapital = capitalAccounts.reduce((acc, a) => acc + (Number(a.balance) || 0), 0);
  const totalIncome = incomeAccounts.reduce((acc, a) => acc + (Number(a.balance) || 0), 0);
  const totalExpenses = expenseAccounts.reduce((acc, a) => acc + (Number(a.balance) || 0), 0);
  
  // Standard financial accounting: Current Period Net Profit forms part of Retained Earnings / Equity
  const currentPeriodNetProfit = totalIncome - totalExpenses;
  const totalEquity = totalCapital + currentPeriodNetProfit;

  const liabilitiesAndEquity = totalLiabilities + totalEquity;
  const isEquationBalanced = Math.abs(totalAssets - liabilitiesAndEquity) < 1;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const rows = [
      ['Classification', 'Account', 'Balance (INR)'],
      ...assetAccounts.map(a => ['Asset', a.name, a.balance]),
      ['Total Assets', '', totalAssets],
      ...liabilityAccounts.map(a => ['Liability', a.name, a.balance]),
      ['Total Liabilities', '', totalLiabilities],
      ...capitalAccounts.map(a => ['Capital', a.name, a.balance]),
      ['Capital', 'Current Period Net Profit / Retained Earnings', currentPeriodNetProfit],
      ['Total Equity', '', totalEquity],
      ['Total Liabilities & Equity', '', liabilitiesAndEquity]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Urban_Furniture_Balance_Sheet_${asOfDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ title: "Exported", message: "Balance Sheet exported to CSV.", type: "success" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">Balance Sheet Statement</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Financial position of Urban Furniture Pvt. Ltd. as of {asOfDate}.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <Button size="sm" variant="outline" onClick={handleExportCSV} className="text-xs gap-1">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button size="sm" variant="outline" onClick={handlePrint} className="text-xs gap-1">
            <Printer className="w-3.5 h-3.5" />
            Print Statement
          </Button>
        </div>
      </div>

      {/* Accounting Equation Banner: Total Assets = Total Liabilities + Capital */}
      <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-neutral-900 text-white rounded-lg">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Accounting Equation</span>
              <h3 className="text-sm font-bold text-neutral-950">
                Total Assets = Total Liabilities + Total Equity
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="px-3 py-1.5 bg-neutral-50 rounded-md border border-neutral-200">
              <span className="text-neutral-500 block text-[10px]">Assets</span>
              <span className="font-mono font-bold text-neutral-950 text-sm">{formatINR(totalAssets)}</span>
            </div>
            <span className="font-bold text-neutral-400">=</span>
            <div className="px-3 py-1.5 bg-neutral-50 rounded-md border border-neutral-200">
              <span className="text-neutral-500 block text-[10px]">Liabilities + Equity</span>
              <span className="font-mono font-bold text-neutral-950 text-sm">{formatINR(liabilitiesAndEquity)}</span>
            </div>
            <Badge variant={isEquationBalanced ? 'paid' : 'loss'}>
              {isEquationBalanced ? 'Equation Balanced' : 'Check Suspense Account'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Two Column Accounting Layout: Assets on Left, Liabilities & Capital on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ASSETS COLUMN */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-neutral-900 text-white px-4 py-3 flex justify-between items-center text-xs font-bold uppercase tracking-wider">
              <span>ASSETS (Application of Funds)</span>
              <span>Balance (INR)</span>
            </div>
            <Table>
              <TableBody>
                {assetAccounts.map(acc => (
                  <TableRow key={acc.id}>
                    <TableCell className="pl-6 font-medium text-neutral-800 text-sm">
                      {acc.name} <span className="text-[10px] font-mono text-neutral-400">({acc.code})</span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-neutral-950">
                      {formatINR(acc.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 bg-neutral-100 border-t-2 border-neutral-900 flex justify-between items-center text-base font-bold text-neutral-950">
            <span>TOTAL ASSETS</span>
            <span className="font-mono text-lg">{formatINR(totalAssets)}</span>
          </div>
        </div>

        {/* LIABILITIES & CAPITAL COLUMN */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Liabilities */}
            <div className="bg-neutral-900 text-white px-4 py-3 flex justify-between items-center text-xs font-bold uppercase tracking-wider">
              <span>LIABILITIES (External Obligations)</span>
              <span>Balance (INR)</span>
            </div>
            <Table>
              <TableBody>
                {liabilityAccounts.map(acc => (
                  <TableRow key={acc.id}>
                    <TableCell className="pl-6 font-medium text-neutral-800 text-sm">
                      {acc.name} <span className="text-[10px] font-mono text-neutral-400">({acc.code})</span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-neutral-950">
                      {formatINR(acc.balance)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-neutral-50 font-semibold text-neutral-700">
                  <TableCell className="pl-6 text-xs uppercase">Subtotal Liabilities</TableCell>
                  <TableCell className="text-right font-mono text-xs">{formatINR(totalLiabilities)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Capital / Equity */}
            <div className="bg-neutral-800 text-white px-4 py-2.5 flex justify-between items-center text-xs font-bold uppercase tracking-wider mt-2">
              <span>CAPITAL / EQUITY (Owner Funds)</span>
              <span>Balance (INR)</span>
            </div>
            <Table>
              <TableBody>
                {capitalAccounts.map(acc => (
                  <TableRow key={acc.id}>
                    <TableCell className="pl-6 font-medium text-neutral-800 text-sm">
                      {acc.name} <span className="text-[10px] font-mono text-neutral-400">({acc.code})</span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-neutral-950">
                      {formatINR(acc.balance)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="pl-6 font-medium text-emerald-800 text-sm flex items-center gap-1.5">
                    <span>Current Period Net Profit / Retained Earnings</span>
                    <Badge variant="paid" className="text-[10px] py-0">P&L Transfer</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-emerald-700">
                    {formatINR(currentPeriodNetProfit)}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-neutral-50 font-semibold text-neutral-700">
                  <TableCell className="pl-6 text-xs uppercase">Total Equity (Capital + Net Profit)</TableCell>
                  <TableCell className="text-right font-mono text-xs">{formatINR(totalEquity)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="p-4 bg-neutral-100 border-t-2 border-neutral-900 flex justify-between items-center text-base font-bold text-neutral-950">
            <span>TOTAL LIABILITIES & EQUITY</span>
            <span className="font-mono text-lg">{formatINR(liabilitiesAndEquity)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
