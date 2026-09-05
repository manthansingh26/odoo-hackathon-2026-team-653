import React, { useState } from 'react';
import { PieChart, Plus, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';

export const Budget = () => {
  const { data, addRecord, formatINR } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    period: 'FY 2026-27 Q2',
    responsiblePerson: '',
    analyticAccount: 'Showroom Ops',
    plannedAmount: 300000,
    usedAmount: 0
  });

  const budgets = data.budgets || [];
  const totalPlanned = budgets.reduce((acc, b) => acc + (Number(b.plannedAmount) || 0), 0);
  const totalUsed = budgets.reduce((acc, b) => acc + (Number(b.usedAmount) || 0), 0);
  const totalRemaining = totalPlanned - totalUsed;
  const overallUtilization = totalPlanned > 0 ? Math.round((totalUsed / totalPlanned) * 100) : 0;

  const handleCreate = (e) => {
    e.preventDefault();
    addRecord('budgets', {
      ...formData,
      plannedAmount: Number(formData.plannedAmount),
      usedAmount: Number(formData.usedAmount),
      status: 'Active'
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">Budget Management</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Quarterly CapEx and operational budget allocations for Urban Furniture departments.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" variant="primary" className="shadow-xs">
          <Plus className="w-4 h-4 mr-1.5" />
          Create Budget
        </Button>
      </div>

      {/* KPI Cards (Section 18) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Budget Planned</span>
          <div className="text-2xl font-bold font-mono text-neutral-950 mt-1">{formatINR(totalPlanned)}</div>
          <span className="text-xs text-neutral-500 mt-1 block">FY 2026-27 allocated</span>
        </Card>

        <Card className="p-4 bg-white border border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Consumed (Used)</span>
          <div className="text-2xl font-bold font-mono text-neutral-950 mt-1">{formatINR(totalUsed)}</div>
          <span className="text-xs text-neutral-500 mt-1 block">Across all cost centers</span>
        </Card>

        <Card className="p-4 bg-white border border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Remaining Buffer</span>
          <div className={`text-2xl font-bold font-mono mt-1 ${totalRemaining >= 0 ? 'text-[#2e7d32]' : 'text-[#c62828]'}`}>
            {formatINR(totalRemaining)}
          </div>
          <span className="text-xs text-neutral-500 mt-1 block">Available unspent fund</span>
        </Card>

        <Card className="p-4 bg-white border border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Overall Utilization</span>
          <div className="text-2xl font-bold font-mono text-neutral-950 mt-1">{overallUtilization}%</div>
          <span className={`text-xs mt-1 block font-medium ${
            overallUtilization > 100 ? 'text-[#c62828]' : overallUtilization > 80 ? 'text-amber-700' : 'text-[#2e7d32]'
          }`}>
            {overallUtilization > 100 ? 'Budget overrun!' : overallUtilization > 80 ? 'Near limit' : 'Under budget'}
          </span>
        </Card>
      </div>

      {/* Detailed Budget Cards with Semantic Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((b) => {
          const util = b.plannedAmount > 0 ? Math.round((b.usedAmount / b.plannedAmount) * 100) : 0;
          const remaining = b.plannedAmount - b.usedAmount;
          const isOver = util > 100;
          const isNear = util >= 80 && util <= 100;

          // Semantic progress color:
          // Under budget -> green (#2e7d32)
          // Near limit -> amber/neutral
          // Over budget -> red (#c62828)
          let barBg = 'bg-[#2e7d32]';
          let badgeVariant = 'paid';
          if (isOver) {
            barBg = 'bg-[#c62828]';
            badgeVariant = 'loss';
          } else if (isNear) {
            barBg = 'bg-amber-600';
            badgeVariant = 'pending';
          }

          return (
            <Card key={b.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-neutral-950 text-base">{b.name}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {b.period} • Lead: {b.responsiblePerson}
                  </p>
                </div>
                <Badge variant={badgeVariant}>
                  {util}% Utilized
                </Badge>
              </div>

              {/* Metric stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">Planned</span>
                  <span className="font-mono font-bold text-neutral-900">{formatINR(b.plannedAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">Spent / Used</span>
                  <span className="font-mono font-bold text-neutral-900">{formatINR(b.usedAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">Remaining</span>
                  <span className={`font-mono font-bold ${remaining >= 0 ? 'text-[#2e7d32]' : 'text-[#c62828]'}`}>
                    {formatINR(remaining)}
                  </span>
                </div>
              </div>

              {/* Progress Bar (Semantic) */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-neutral-500 mb-1">
                  <span>Consumption Pace</span>
                  <span className="font-mono font-semibold">{util}%</span>
                </div>
                <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${barBg}`}
                    style={{ width: `${Math.min(100, util)}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Budget Allocation"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Budget Title *</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Warehouse Automation CapEx"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Period *</label>
              <Select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              >
                <option value="FY 2026-27 Q2">FY 2026-27 Q2</option>
                <option value="FY 2026-27 Q3">FY 2026-27 Q3</option>
                <option value="FY 2026-27 Q4">FY 2026-27 Q4</option>
                <option value="FY 2026-27 Annual">FY 2026-27 Annual</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Responsible Person *</label>
              <Input
                required
                value={formData.responsiblePerson}
                onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                placeholder="e.g. Aarav Mehta"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Planned Budget (₹) *</label>
              <Input
                type="number"
                min="1"
                required
                value={formData.plannedAmount}
                onChange={(e) => setFormData({ ...formData, plannedAmount: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Initial Used (₹)</label>
              <Input
                type="number"
                min="0"
                value={formData.usedAmount}
                onChange={(e) => setFormData({ ...formData, usedAmount: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Budget</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
