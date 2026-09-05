import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';

export const Journals = () => {
  const { data, addRecord, updateRecord } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Sales',
    defaultAccount: '',
    status: 'Active'
  });

  const openAddModal = () => {
    setEditingJournal(null);
    setFormData({
      name: '',
      code: 'GEN',
      type: 'Sales',
      defaultAccount: data.accounts[0]?.id || '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (j) => {
    setEditingJournal(j);
    setFormData({
      name: j.name,
      code: j.code,
      type: j.type,
      defaultAccount: j.defaultAccount,
      status: j.status
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingJournal) {
      updateRecord('journals', editingJournal.id, { ...formData });
    } else {
      addRecord('journals', {
        ...formData,
        entriesCount: 0
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">Journal Master</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure primary posting ledgers for sales invoices, vendor bills, bank transactions, and cash outlays.
          </p>
        </div>
        <Button onClick={openAddModal} size="sm" variant="primary" className="shadow-xs">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Journal
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Journal Name</TableHead>
              <TableHead>Short Code</TableHead>
              <TableHead>Journal Type</TableHead>
              <TableHead>Default Post Account</TableHead>
              <TableHead>Posted Entries</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.journals && data.journals.length > 0 ? (
              data.journals.map((j) => {
                const defAccount = data.accounts.find(a => a.id === j.defaultAccount);

                return (
                  <TableRow key={j.id}>
                    <TableCell className="font-semibold text-neutral-950 text-sm">
                      {j.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-neutral-600">
                      {j.code}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{j.type}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-neutral-700">
                      {defAccount ? `${defAccount.code} - ${defAccount.name}` : (j.defaultAccount || 'General')}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-neutral-900">
                      {j.entriesCount || 0}
                    </TableCell>
                    <TableCell>
                      <Badge variant={j.status === 'Active' ? 'paid' : 'loss'}>
                        {j.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditModal(j)}
                        title="Edit journal configuration"
                      >
                        <Edit2 className="w-4 h-4 text-neutral-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-neutral-400">
                  No journals configured.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Journal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingJournal ? 'Edit Journal' : 'Create New Journal'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Journal Title *</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Export Sales Journal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Short Code *</label>
              <Input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. EXP"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Journal Type *</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Sales">Sales</option>
                <option value="Purchase">Purchase</option>
                <option value="Bank">Bank</option>
                <option value="Cash">Cash</option>
                <option value="General">General / Miscellaneous</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Default Account *</label>
            <Select
              value={formData.defaultAccount}
              onChange={(e) => setFormData({ ...formData, defaultAccount: e.target.value })}
              required
            >
              {data.accounts.map(a => (
                <option key={a.id} value={a.id}>{a.code} - {a.name} ({a.category})</option>
              ))}
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Journal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
