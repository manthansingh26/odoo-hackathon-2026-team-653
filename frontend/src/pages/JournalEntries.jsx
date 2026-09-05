import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  Eye
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { validateJournalEntryForm } from '../utils/validation';

export const JournalEntries = () => {
  const { data, addRecord, formatINR, addToast } = useAppContext();

  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [viewingEntry, setViewingEntry] = useState(null);
  const [errors, setErrors] = useState({});

  // New Journal Entry state
  const [journal, setJournal] = useState('Sales Journal');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState(`JE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState(() => {
    const acc1 = data.accounts?.[0] || { id: 'ACC-1010', name: 'Cash in Hand' };
    const acc2 = data.accounts?.[1] || { id: 'ACC-4010', name: 'Sales Revenue - Commercial Furniture' };
    return [
      {
        accountId: acc1.id,
        accountName: acc1.name,
        description: 'Debit line',
        debit: 50000,
        credit: 0
      },
      {
        accountId: acc2.id,
        accountName: acc2.name,
        description: 'Credit line',
        debit: 0,
        credit: 50000
      }
    ];
  });

  const handleAccountChange = (index, accId) => {
    const acc = (data.accounts || []).find(a => a.id === accId);
    setLines(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        accountId: accId,
        accountName: acc?.name || copy[index].accountName || 'General Account'
      };
      return copy;
    });
  };

  const handleLineValueChange = (index, field, val) => {
    setLines(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: Number(val) };
      return copy;
    });
  };

  const addLine = () => {
    const defaultAcc = data.accounts?.[0] || { id: 'ACC-1010', name: 'Cash in Hand' };
    setLines(prev => [
      ...prev,
      {
        accountId: defaultAcc.id,
        accountName: defaultAcc.name,
        description: '',
        debit: 0,
        credit: 0
      }
    ]);
  };

  const removeLine = (index) => {
    if (lines.length <= 2) return;
    setLines(prev => prev.filter((_, i) => i !== index));
  };

  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const isBalanced = totalDebit > 0 && totalDebit === totalCredit;
  const difference = Math.abs(totalDebit - totalCredit);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateJournalEntryForm({
      date,
      reference,
      description,
      lines
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      if (validation.errors.balance) {
        addToast({
          type: 'error',
          message: validation.errors.balance
        });
      } else {
        addToast({
          type: 'error',
          message: 'Please resolve the highlighted validation errors before posting.'
        });
      }
      return;
    }

    setErrors({});

    const cleanLines = lines.map(l => {
      const acc = (data.accounts || []).find(a => a.id === l.accountId);
      return {
        ...l,
        accountId: l.accountId || acc?.id || 'ACC-1000',
        accountName: (l.accountName || acc?.name || 'General Account').trim(),
        description: l.description || '',
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0
      };
    });

    const entryRef = reference?.trim() || `JE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    addRecord('journalEntries', {
      id: entryRef,
      journal: journal || 'General Journal',
      date,
      transactionDate: date ? new Date(date).toISOString() : new Date().toISOString(),
      reference: entryRef,
      description: description.trim(),
      lines: cleanLines,
      items: cleanLines,
      totalDebit,
      totalCredit,
      status: 'Posted'
    });

    addToast({
      type: 'success',
      message: `Journal voucher ${entryRef} posted successfully.`
    });

    setIsCreatorOpen(false);
    setReference(`JE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    setDescription('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">Journal Entries</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Double-entry posted transactions ensuring debits equal credits in general ledger.
          </p>
        </div>
        <Button onClick={() => { setErrors({}); setIsCreatorOpen(true); }} size="sm" variant="primary" className="shadow-xs">
          <Plus className="w-4 h-4 mr-1.5" />
          New Journal Entry
        </Button>
      </div>

      {/* Entries List Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Journal</TableHead>
              <TableHead>Narration / Description</TableHead>
              <TableHead>Debit (₹)</TableHead>
              <TableHead>Credit (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.journalEntries && data.journalEntries.length > 0 ? (
              data.journalEntries.map((je) => {
                const displayDate = je.transactionDate
                  ? (typeof je.transactionDate === 'string' ? je.transactionDate.slice(0, 10) : new Date(je.transactionDate).toISOString().slice(0, 10))
                  : (je.date || '-');
                const displayRef = je.reference || je.id;
                const displayDesc = je.description || '-';
                const displayJournal = je.journal || 'General Journal';

                return (
                  <TableRow key={je.id}>
                    <TableCell className="font-mono font-bold text-xs text-neutral-950">
                      {displayRef}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-neutral-600">
                      {displayDate}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{displayJournal}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-neutral-800 font-medium max-w-xs truncate" title={displayDesc}>
                      {displayDesc}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-neutral-900">
                      {formatINR(je.totalDebit)}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-neutral-900">
                      {formatINR(je.totalCredit)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="paid">
                        <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                        {je.status || 'Posted'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setViewingEntry(je)}
                        title="View voucher"
                      >
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-neutral-400">
                  No journal vouchers posted yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* New Journal Entry Modal with Double Entry Table and Validation */}
      <Modal
        isOpen={isCreatorOpen}
        onClose={() => {
          setIsCreatorOpen(false);
          setErrors({});
        }}
        title="Double-Entry Journal Voucher"
        subtitle="Debit and Credit totals must balance before posting"
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Target Journal *</label>
              <Select value={journal} onChange={(e) => setJournal(e.target.value)}>
                {(data.journals || []).map(j => (
                  <option key={j.id} value={j.name}>{j.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Posting Date *</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors(prev => ({ ...prev, date: null }));
                }}
                error={errors.date}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Reference / Doc No. *</label>
              <Input
                value={reference}
                onChange={(e) => {
                  setReference(e.target.value);
                  if (errors.reference) setErrors(prev => ({ ...prev, reference: null }));
                }}
                error={errors.reference}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Voucher Narration / Description *</label>
            <Input
              required
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: null }));
              }}
              error={errors.description}
              placeholder="e.g. Depreciation allocation for showroom assets"
            />
          </div>

          {errors.lines && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {errors.lines}
            </div>
          )}

          {/* Double-entry lines table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Accounting Split Lines
              </span>
              <Button type="button" size="xs" variant="outline" onClick={addLine}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Account Row
              </Button>
            </div>

            <div className="space-y-2 border border-neutral-200 rounded-lg p-2 bg-neutral-50/50 max-h-60 overflow-y-auto">
              {lines.map((l, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-md border border-neutral-200">
                  <div className="flex-1">
                    <Select
                      value={l.accountId}
                      onChange={(e) => handleAccountChange(idx, e.target.value)}
                      className="text-xs h-8"
                    >
                      {data.accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.code} - {acc.name} ({acc.category})
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="w-44 hidden sm:block">
                    <Input
                      placeholder="Line narration"
                      value={l.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLines(prev => {
                          const copy = [...prev];
                          copy[idx].description = val;
                          return copy;
                        });
                      }}
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Debit ₹"
                      value={l.debit || ''}
                      onChange={(e) => handleLineValueChange(idx, 'debit', e.target.value)}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Credit ₹"
                      value={l.credit || ''}
                      onChange={(e) => handleLineValueChange(idx, 'credit', e.target.value)}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(idx)}
                    disabled={lines.length <= 2}
                    className="p-1 text-neutral-400 hover:text-red-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Validation & Balance Status Box (Section 13) */}
          <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Total Debit</span>
                <span className="font-mono text-lg font-bold text-neutral-950">{formatINR(totalDebit)}</span>
              </div>
              <div className="border-l border-neutral-300 pl-6">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Total Credit</span>
                <span className="font-mono text-lg font-bold text-neutral-950">{formatINR(totalCredit)}</span>
              </div>
            </div>

            {/* Status indicator: Balanced (Green) vs Not Balanced (Red) */}
            <div className="flex items-center gap-3">
              {isBalanced ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#e8f5e9] border border-[#c8e6c9] text-[#2e7d32]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <div className="text-xs font-bold">
                    Balanced
                    <span className="font-normal block text-[10px]">Difference: ₹0</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#ffebee] border border-[#ffcdd2] text-[#c62828]">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <div className="text-xs font-bold">
                    Not Balanced
                    <span className="font-normal block text-[10px]">Difference: {formatINR(difference)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {errors.balance && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {errors.balance}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsCreatorOpen(false);
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!isBalanced || totalDebit === 0}>
              Post Journal Voucher
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Journal Entry Detail Voucher */}
      {viewingEntry && (
        <Modal
          isOpen={true}
          onClose={() => setViewingEntry(null)}
          title={`Journal Voucher: ${viewingEntry.reference || viewingEntry.id}`}
          subtitle={`Posted in ${viewingEntry.journal || 'General Journal'} on ${
            viewingEntry.transactionDate
              ? (typeof viewingEntry.transactionDate === 'string' ? viewingEntry.transactionDate.slice(0, 10) : new Date(viewingEntry.transactionDate).toISOString().slice(0, 10))
              : (viewingEntry.date || '-')
          }`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Narration / Description</span>
              <p className="text-sm font-semibold text-neutral-900 mt-0.5">{viewingEntry.description || '-'}</p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Line Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(viewingEntry.lines || viewingEntry.items || []).map((l, i) => (
                  <TableRow key={l.id || i}>
                    <TableCell className="font-medium text-neutral-900">{l.accountName || l.accountId || 'General Account'}</TableCell>
                    <TableCell className="text-neutral-500">{l.description || '-'}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-neutral-900">
                      {Number(l.debit) > 0 ? formatINR(Number(l.debit)) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-neutral-900">
                      {Number(l.credit) > 0 ? formatINR(Number(l.credit)) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-neutral-50 font-bold">
                  <TableCell colSpan={2}>Grand Total</TableCell>
                  <TableCell className="text-right font-mono font-bold text-neutral-950">
                    {formatINR(viewingEntry.totalDebit)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-neutral-950">
                    {formatINR(viewingEntry.totalCredit)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setViewingEntry(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
