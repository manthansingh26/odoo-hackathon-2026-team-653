import React, { useState } from 'react';
import { Compass, Plus, Eye, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';

export const AnalyticAccounts = () => {
  const { data, addRecord, formatINR } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingAnalytic, setViewingAnalytic] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Expense',
    responsiblePerson: '',
    totalIncome: 0,
    totalExpense: 0,
    status: 'Active'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    addRecord('analyticAccounts', {
      ...formData,
      totalIncome: Number(formData.totalIncome),
      totalExpense: Number(formData.totalExpense)
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">Analytic Accounts</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cost and profit centers tracking departmental profitability and project expenditures.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" variant="primary" className="shadow-xs">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Cost Center
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Analytic Account / Cost Center</TableHead>
              <TableHead>Primary Type</TableHead>
              <TableHead>Responsible Owner</TableHead>
              <TableHead>Recorded Inflows</TableHead>
              <TableHead>Recorded Outlays</TableHead>
              <TableHead>Net Contribution</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.analyticAccounts && data.analyticAccounts.length > 0 ? (
              data.analyticAccounts.map((ana) => {
                const net = (Number(ana.totalIncome) || 0) - (Number(ana.totalExpense) || 0);

                return (
                  <TableRow key={ana.id}>
                    <TableCell className="font-semibold text-neutral-950 text-sm">
                      {ana.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ana.type === 'Income' ? 'paid' : 'default'}>
                        {ana.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-neutral-700 font-medium">
                      {ana.responsiblePerson}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-neutral-900 font-semibold">
                      {formatINR(ana.totalIncome || 0)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-neutral-600">
                      {formatINR(ana.totalExpense || 0)}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-xs">
                      <span className={net >= 0 ? 'text-[#2e7d32]' : 'text-[#c62828]'}>
                        {formatINR(net)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ana.status === 'Active' ? 'paid' : 'loss'}>
                        {ana.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setViewingAnalytic(ana)}
                        title="View center analytics"
                      >
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-neutral-400">
                  No cost centers logged.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Analytic Center Modal */}
      {viewingAnalytic && (
        <Modal
          isOpen={true}
          onClose={() => setViewingAnalytic(null)}
          title={`Cost Center: ${viewingAnalytic.name}`}
          subtitle={`Managed by ${viewingAnalytic.responsiblePerson}`}
          maxWidth="max-w-md"
        >
          {(() => {
            const inc = Number(viewingAnalytic.totalIncome) || 0;
            const exp = Number(viewingAnalytic.totalExpense) || 0;
            const netVal = inc - exp;
            const isNetProfit = netVal >= 0;

            return (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-neutral-200 rounded-md bg-white">
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block">Recorded Inflows</span>
                    <span className="text-lg font-bold font-mono text-neutral-900">{formatINR(inc)}</span>
                  </div>
                  <div className="p-3 border border-neutral-200 rounded-md bg-white">
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block">Operating Outlays</span>
                    <span className="text-lg font-bold font-mono text-neutral-500">{formatINR(exp)}</span>
                  </div>
                </div>

                {/* Profit / Loss Dynamic Result Box */}
                <div
                  className={`p-4 rounded-lg border flex items-center justify-between transition-all ${
                    isNetProfit
                      ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]'
                      : 'bg-[#ffebee] text-[#c62828] border-[#ffcdd2]'
                  }`}
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider block opacity-90">
                      {isNetProfit ? 'Net Departmental Profit' : 'Net Departmental Loss / Deficit'}
                    </span>
                    <span className="text-xl font-bold font-mono">
                      {isNetProfit ? `+${formatINR(netVal)}` : `-${formatINR(Math.abs(netVal))}`}
                    </span>
                    <p className="text-[11px] mt-0.5 opacity-85">
                      Formula: Inflows ({formatINR(inc)}) - Outlays ({formatINR(exp)})
                    </p>
                  </div>
                  <Badge variant={isNetProfit ? 'profit' : 'loss'} className="text-xs font-bold">
                    {isNetProfit ? 'PROFIT' : 'LOSS'}
                  </Badge>
                </div>

                <div className="flex justify-end pt-2">
                  <Button size="sm" variant="outline" onClick={() => setViewingAnalytic(null)}>
                    Close
                  </Button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Analytic Account"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Center Title *</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Export Shipping Logistics"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Primary Type *</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Expense">Expense Center</option>
                <option value="Income">Profit / Revenue Center</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Manager / Lead *</label>
              <Input
                required
                value={formData.responsiblePerson}
                onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                placeholder="e.g. Rohan Varma"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Initial Inflows (₹)</label>
              <Input
                type="number"
                min="0"
                value={formData.totalIncome}
                onChange={(e) => setFormData({ ...formData, totalIncome: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Initial Outlays (₹)</label>
              <Input
                type="number"
                min="0"
                value={formData.totalExpense}
                onChange={(e) => setFormData({ ...formData, totalExpense: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Cost Center</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
