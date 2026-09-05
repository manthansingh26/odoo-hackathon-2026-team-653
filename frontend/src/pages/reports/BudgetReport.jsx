import React from 'react';
import { PieChart, Download, Printer, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export const BudgetReport = () => {
  const { data, formatINR } = useAppContext();
  const budgets = data.budgets || [];

  const chartData = budgets.map(b => ({
    name: b.name.slice(0, 18) + '...',
    Planned: b.plannedAmount,
    Actual: b.usedAmount
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">Budget Performance Report</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Variance analysis comparing allocated planned budgets against actual expenditures.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <Button size="sm" variant="outline" onClick={() => window.print()} className="text-xs gap-1">
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Variance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Planned vs Actual Utilization by Budget Head</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                />
                <Tooltip formatter={(val) => [formatINR(val), '']} />
                <Legend />
                <Bar dataKey="Planned" name="Planned Allocation" fill="#111827" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" name="Actual Utilized" fill="#9ca3af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Budget Table (Section 22) */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Budget Head</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Planned (₹)</TableHead>
              <TableHead>Actual (₹)</TableHead>
              <TableHead>Remaining (₹)</TableHead>
              <TableHead>Utilization</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((b) => {
              const util = b.plannedAmount > 0 ? Math.round((b.usedAmount / b.plannedAmount) * 100) : 0;
              const remaining = b.plannedAmount - b.usedAmount;
              const isOver = util > 100;

              return (
                <TableRow key={b.id}>
                  <TableCell className="font-semibold text-neutral-900 text-sm">
                    {b.name}
                    <div className="text-[10px] text-neutral-400 font-normal">Lead: {b.responsiblePerson}</div>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-600 font-mono">{b.period}</TableCell>
                  <TableCell className="font-mono font-bold text-neutral-900">{formatINR(b.plannedAmount)}</TableCell>
                  <TableCell className="font-mono font-bold text-neutral-900">{formatINR(b.usedAmount)}</TableCell>
                  <TableCell className="font-mono font-bold">
                    <span className={remaining >= 0 ? 'text-[#2e7d32]' : 'text-[#c62828]'}>
                      {formatINR(remaining)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-neutral-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isOver ? 'bg-[#c62828]' : 'bg-[#2e7d32]'}`}
                          style={{ width: `${Math.min(100, util)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-semibold">{util}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={isOver ? 'loss' : 'paid'}>
                      {isOver ? 'Over Budget' : 'Within Budget'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
