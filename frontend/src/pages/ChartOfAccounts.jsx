import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  ChevronDown,
  ChevronRight,
  Edit2,
  Archive,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';

export const ChartOfAccounts = () => {
  const { data, addRecord, updateRecord, formatINR } = useAppContext();

  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Assets',
    type: 'Asset',
    balance: 0,
    status: 'Active'
  });

  const toggleCategory = (cat) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const openAddModal = () => {
    setEditingAccount(null);
    setFormData({
      code: `${Math.floor(1000 + Math.random() * 8000)}`,
      name: '',
      category: 'Assets',
      type: 'Asset',
      balance: 0,
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (acc) => {
    setEditingAccount(acc);
    setFormData({
      code: acc.code,
      name: acc.name,
      category: acc.category,
      type: acc.type,
      balance: acc.balance,
      status: acc.status
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingAccount) {
      updateRecord('accounts', editingAccount.id, {
        ...formData,
        balance: Number(formData.balance)
      });
    } else {
      addRecord('accounts', {
        ...formData,
        id: `ACC-${formData.code}`,
        balance: Number(formData.balance)
      });
    }
    setIsModalOpen(false);
  };

  const handleToggleArchive = (acc) => {
    const newStatus = acc.status === 'Archived' ? 'Active' : 'Archived';
    updateRecord('accounts', acc.id, { status: newStatus });
  };

  // Group accounts by standard financial category
  const categoriesList = ['Assets', 'Liabilities', 'Capital', 'Income', 'Expenses'];

  const groupedAccounts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const map = {};
    categoriesList.forEach(cat => { map[cat] = []; });

    (data.accounts || []).forEach(acc => {
      const matchSearch = acc.name.toLowerCase().includes(q) || acc.code.includes(q);
      if (matchSearch) {
        const cat = acc.category || 'Assets';
        if (!map[cat]) map[cat] = [];
        map[cat].push(acc);
      }
    });
    return map;
  }, [data.accounts, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">Chart of Accounts</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Structured ledger accounts organized by Assets, Liabilities, Capital, Income, and Expenses.
          </p>
        </div>
        <Button onClick={openAddModal} size="sm" variant="primary" className="shadow-xs">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Account
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-neutral-200">
        <div className="text-xs font-semibold text-neutral-700">
          General Ledger Accounts Directory
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search account by code or title..."
            className="pl-9 text-xs h-9"
          />
        </div>
      </div>

      {/* Collapsible Groups for Each Category */}
      <div className="space-y-4">
        {categoriesList.map((cat) => {
          const accs = groupedAccounts[cat] || [];
          const isCollapsed = collapsedCategories[cat];
          const totalBalance = accs.reduce((sum, item) => sum + (Number(item.balance) || 0), 0);

          return (
            <div key={cat} className="bg-white border border-neutral-200 rounded-lg shadow-xs overflow-hidden">
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between p-4 bg-neutral-50/80 hover:bg-neutral-100/80 border-b border-neutral-200 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-neutral-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-600" />
                  )}
                  <div>
                    <span className="font-bold text-sm text-neutral-950 uppercase tracking-wider">{cat}</span>
                    <span className="ml-2 text-xs text-neutral-400">({accs.length} accounts)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 uppercase font-semibold block">Subtotal</span>
                  <span className="font-mono text-sm font-bold text-neutral-900">{formatINR(totalBalance)}</span>
                </div>
              </button>

              {/* Accounts Table for this category */}
              {!isCollapsed && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Account Code</TableHead>
                        <TableHead>Account Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Current Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accs.length > 0 ? (
                        accs.map((acc) => (
                          <TableRow key={acc.id}>
                            <TableCell className="font-mono font-bold text-xs text-neutral-900">
                              {acc.code}
                            </TableCell>
                            <TableCell className="font-medium text-neutral-900 text-sm">
                              {acc.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">{acc.type}</Badge>
                            </TableCell>
                            <TableCell className="font-mono font-bold text-neutral-950">
                              {formatINR(acc.balance)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={acc.status === 'Active' ? 'paid' : 'loss'}>
                                {acc.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => openEditModal(acc)}
                                  title="Edit account"
                                >
                                  <Edit2 className="w-4 h-4 text-neutral-600" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleToggleArchive(acc)}
                                  title={acc.status === 'Archived' ? 'Unarchive' : 'Archive'}
                                >
                                  <Archive className="w-4 h-4 text-neutral-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-neutral-400 text-xs">
                            No accounts mapped under {cat}.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Account Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAccount ? 'Edit Ledger Account' : 'Create General Ledger Account'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Account Code *</label>
              <Input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Classification *</label>
              <Select
                value={formData.category}
                onChange={(e) => {
                  const cat = e.target.value;
                  const defaultType = cat === 'Assets' ? 'Asset' : cat === 'Liabilities' ? 'Liability' : cat === 'Income' ? 'Income' : cat === 'Expenses' ? 'Expense' : 'Capital';
                  setFormData({ ...formData, category: cat, type: defaultType });
                }}
              >
                <option value="Assets">Assets</option>
                <option value="Liabilities">Liabilities</option>
                <option value="Capital">Capital / Equity</option>
                <option value="Income">Income</option>
                <option value="Expenses">Expenses</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Account Title *</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. ICICI Corporate Current Account"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Opening Balance (₹)</label>
              <Input
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Status</label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
