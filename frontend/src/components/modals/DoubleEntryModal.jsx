import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Scale, Plus, Trash2, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

const PRESET_SCENARIOS = {
  sales: {
    name: 'Customer Payment (Sales)',
    reference: 'JV-2026-089',
    narration: 'Receipt from TechCraft Solutions for Executive Desks',
    lines: [
      { id: '1', code: '1001', account: 'HDFC Bank Current A/c', type: 'Asset', narration: 'Bank NEFT credit', debit: 85000, credit: 0 },
      { id: '2', code: '4001', account: 'Commercial Furniture Sales', type: 'Income', narration: 'Revenue recognized', debit: 0, credit: 85000 }
    ]
  },
  purchase: {
    name: 'Raw Timber Procurement (Expense)',
    reference: 'JV-2026-090',
    narration: 'Purchase of Teakwood & Oak timber logs from GreenWood Mills',
    lines: [
      { id: '1', code: '5001', account: 'Raw Materials & Timber COGS', type: 'Expense', narration: 'Raw materials inventory inward', debit: 62000, credit: 0 },
      { id: '2', code: '2001', account: 'Sundry Creditors (GreenWood Mills)', type: 'Liability', narration: 'Vendor payable recorded', debit: 0, credit: 62000 }
    ]
  },
  rent: {
    name: 'Showroom Rent & Utilities',
    reference: 'JV-2026-091',
    narration: 'Monthly showroom lease & electricity allocation',
    lines: [
      { id: '1', code: '5002', account: 'Showroom Lease & Rent Expense', type: 'Expense', narration: 'Factory & Showroom lease', debit: 45000, credit: 0 },
      { id: '2', code: '1002', account: 'Petty Cash / Operating Account', type: 'Asset', narration: 'Bank auto-debit payout', debit: 0, credit: 45000 }
    ]
  }
};

const AVAILABLE_ACCOUNTS = [
  { code: '1001', name: 'HDFC Bank Current A/c', type: 'Asset' },
  { code: '1002', name: 'Petty Cash / Operating Account', type: 'Asset' },
  { code: '1003', name: 'Trade Receivables / Debtors', type: 'Asset' },
  { code: '2001', name: 'Sundry Creditors / Vendors', type: 'Liability' },
  { code: '2002', name: 'GST Output Liability A/c', type: 'Liability' },
  { code: '3001', name: 'Shareholder Equity Capital', type: 'Equity' },
  { code: '4001', name: 'Commercial Furniture Sales', type: 'Income' },
  { code: '5001', name: 'Raw Materials & Timber COGS', type: 'Expense' },
  { code: '5002', name: 'Showroom Lease & Rent Expense', type: 'Expense' }
];

export const DoubleEntryModal = ({ isOpen, onClose, onLaunchERP }) => {
  const [scenarioKey, setScenarioKey] = useState('sales');
  const [reference, setReference] = useState(PRESET_SCENARIOS.sales.reference);
  const [narration, setNarration] = useState(PRESET_SCENARIOS.sales.narration);
  const [lines, setLines] = useState(PRESET_SCENARIOS.sales.lines);

  const loadScenario = (key) => {
    const sc = PRESET_SCENARIOS[key];
    if (sc) {
      setScenarioKey(key);
      setReference(sc.reference);
      setNarration(sc.narration);
      setLines(JSON.parse(JSON.stringify(sc.lines)));
    }
  };

  const handleLineChange = (index, field, value) => {
    const updated = [...lines];
    if (field === 'debit' || field === 'credit') {
      const num = parseFloat(value) || 0;
      updated[index][field] = num;
      // If user types debit, clear credit on that line (unless intentionally both, but usually either Dr or Cr)
      if (field === 'debit' && num > 0) {
        updated[index].credit = 0;
      } else if (field === 'credit' && num > 0) {
        updated[index].debit = 0;
      }
    } else if (field === 'accountSelect') {
      const acc = AVAILABLE_ACCOUNTS.find(a => a.code === value);
      if (acc) {
        updated[index].code = acc.code;
        updated[index].account = acc.name;
        updated[index].type = acc.type;
      }
    } else {
      updated[index][field] = value;
    }
    setLines(updated);
  };

  const addLine = () => {
    const defaultAcc = AVAILABLE_ACCOUNTS[0];
    setLines([
      ...lines,
      {
        id: Date.now().toString(),
        code: defaultAcc.code,
        account: defaultAcc.name,
        type: defaultAcc.type,
        narration: '',
        debit: 0,
        credit: 0
      }
    ]);
  };

  const removeLine = (index) => {
    if (lines.length <= 2) return; // Keep at least 2 lines for double-entry
    setLines(lines.filter((_, i) => i !== index));
  };

  // Live calculations
  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference === 0 && totalDebit > 0;

  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Double-Entry Accounting Sandbox"
      subtitle="Interactive balancing engine: Every financial voucher enforces Debit = Credit."
      maxWidth="max-w-4xl"
    >
      <div className="p-6 space-y-6">
        {/* Preset Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Preset Scenarios:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(PRESET_SCENARIOS).map(([key, sc]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => loadScenario(key)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                    scenarioKey === key
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {sc.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadScenario(scenarioKey)}
            className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Scenario</span>
          </button>
        </div>

        {/* Voucher Info Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs">
          <div>
            <span className="font-semibold text-neutral-500 block">Voucher Reference</span>
            <span className="font-mono font-bold text-neutral-900">{reference}</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-500 block">Date</span>
            <span className="font-medium text-neutral-900">{new Date().toISOString().slice(0, 10)}</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-500 block">Narration</span>
            <span className="text-neutral-800 truncate block">{narration}</span>
          </div>
        </div>

        {/* Double-Entry Split Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-neutral-900" />
              Journal Split Lines (Double-Entry)
            </span>
            <button
              type="button"
              onClick={addLine}
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Row
            </button>
          </div>

          <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-100/70 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Account Code & Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Line Narration</th>
                    <th className="py-2.5 px-3 text-right">Debit (Dr) ₹</th>
                    <th className="py-2.5 px-3 text-right">Credit (Cr) ₹</th>
                    <th className="py-2.5 px-2 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {lines.map((line, idx) => (
                    <tr key={line.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-2 px-3">
                        <select
                          value={line.code}
                          onChange={(e) => handleLineChange(idx, 'accountSelect', e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                        >
                          {AVAILABLE_ACCOUNTS.map((acc) => (
                            <option key={acc.code} value={acc.code}>
                              {acc.code} - {acc.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <Badge
                          variant={
                            line.type === 'Asset'
                              ? 'default'
                              : line.type === 'Liability'
                              ? 'warning'
                              : line.type === 'Income'
                              ? 'profit'
                              : 'destructive'
                          }
                          className="text-[10px]"
                        >
                          {line.type}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={line.narration}
                          onChange={(e) => handleLineChange(idx, 'narration', e.target.value)}
                          placeholder="Optional narration"
                          className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={line.debit || ''}
                          onChange={(e) => handleLineChange(idx, 'debit', e.target.value)}
                          placeholder="0.00"
                          className="w-28 text-right font-mono font-bold bg-neutral-50/70 border border-neutral-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={line.credit || ''}
                          onChange={(e) => handleLineChange(idx, 'credit', e.target.value)}
                          placeholder="0.00"
                          className="w-28 text-right font-mono font-bold bg-neutral-50/70 border border-neutral-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        {lines.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeLine(idx)}
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                            title="Remove row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Balancing Verification Bar */}
            <div className="bg-neutral-50 p-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {isBalanced ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>✓ Perfectly Balanced (Debit = Credit)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>⚠️ Unbalanced Voucher (Diff: {formatINR(difference)})</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 text-xs font-mono">
                <div>
                  <span className="text-neutral-500 mr-1.5">Total Dr:</span>
                  <span className="font-bold text-neutral-950">{formatINR(totalDebit)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 mr-1.5">Total Cr:</span>
                  <span className="font-bold text-neutral-950">{formatINR(totalCredit)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 mr-1.5">Difference:</span>
                  <span className={`font-bold ${isBalanced ? 'text-emerald-700' : 'text-red-600'}`}>
                    {formatINR(difference)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explanatory Info Card */}
        <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 space-y-1">
          <div className="font-bold text-neutral-950 flex items-center gap-1.5">
            <span>💡 How Double-Entry Works in Urban Furniture ERP:</span>
          </div>
          <p className="leading-relaxed">
            In compliance with statutory accounting standards (Odoo & ICAI), an entry is permanently locked from posting until <strong className="text-neutral-900">Total Debit exactly equals Total Credit</strong>. Once balanced, it immediately updates the General Ledger, Balance Sheet, and Trial Balance.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Close Sandbox
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              if (onLaunchERP) onLaunchERP('Accountant');
            }}
            className="w-full sm:w-auto gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-bold shadow-xs cursor-pointer"
          >
            <span>Open Full Double-Entry in ERP (Accountant)</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
