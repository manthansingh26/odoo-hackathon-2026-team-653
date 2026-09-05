import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Archive,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Heart
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FavoriteButton } from '../components/ui/FavoriteButton';

export const Contacts = () => {
  const {
    data,
    addRecord,
    updateRecord,
    deleteRecord,
    toggleFavorite,
    formatINR
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Customer' | 'Vendor' | 'Both'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [viewingContact, setViewingContact] = useState(null);
  const [deletingContactId, setDeletingContactId] = useState(null);

  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Customer',
    email: '',
    mobile: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    outstanding: 0,
    status: 'Active'
  });

  const openAddModal = () => {
    setEditingContact(null);
    setFormData({
      name: '',
      type: 'Customer',
      email: '',
      mobile: '',
      address: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      outstanding: 0,
      status: 'Active'
    });
    setIsFormOpen(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      type: contact.type,
      email: contact.email,
      mobile: contact.mobile,
      address: contact.address || '',
      city: contact.city || '',
      state: contact.state || '',
      pincode: contact.pincode || '',
      outstanding: contact.outstanding || 0,
      status: contact.status || 'Active'
    });
    setIsFormOpen(true);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (editingContact) {
      updateRecord('contacts', editingContact.id, {
        ...formData,
        outstanding: Number(formData.outstanding)
      });
    } else {
      addRecord('contacts', {
        ...formData,
        outstanding: Number(formData.outstanding),
        favorite: false,
        createdAt: new Date().toISOString().slice(0, 10)
      });
    }
    setIsFormOpen(false);
  };

  const handleToggleArchive = (contact) => {
    const newStatus = contact.status === 'Archived' ? 'Active' : 'Archived';
    updateRecord('contacts', contact.id, { status: newStatus });
  };

  const filteredContacts = useMemo(() => {
    return (data.contacts || []).filter((contact) => {
      const matchTab = activeTab === 'All' || contact.type === activeTab;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        contact.name.toLowerCase().includes(q) ||
        contact.email.toLowerCase().includes(q) ||
        contact.city.toLowerCase().includes(q) ||
        contact.mobile.includes(q);
      return matchTab && matchSearch;
    });
  }, [data.contacts, activeTab, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">Contact Master</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your furniture clients, timber vendors, and trading partners.
          </p>
        </div>
        <Button onClick={openAddModal} size="sm" variant="primary" className="shadow-xs">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Contact
        </Button>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-neutral-200">
        {/* Tabs: All, Customers, Vendors, Both */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-md">
          {['All', 'Customer', 'Vendor', 'Both'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab === 'All' ? 'All Contacts' : tab === 'Customer' ? 'Customers' : tab === 'Vendor' ? 'Vendors' : 'Both (Dual)'}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, city..."
            className="pl-9 text-xs h-9"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">Fav</TableHead>
              <TableHead>Contact Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Email & Phone</TableHead>
              <TableHead>City & State</TableHead>
              <TableHead>Outstanding</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="w-10">
                    <FavoriteButton
                      isFavorite={c.favorite}
                      onToggle={() => toggleFavorite('contacts', c.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-neutral-950 text-sm">{c.name}</div>
                    <div className="text-[11px] text-neutral-400 font-mono">ID: {c.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.type === 'Customer' ? 'dark' : c.type === 'Vendor' ? 'default' : 'outline'}>
                      {c.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-neutral-900 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-neutral-400" />
                      {c.email}
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3 h-3 text-neutral-400" />
                      {c.mobile}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-neutral-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {c.city}, {c.state}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-semibold text-neutral-950">
                    {formatINR(c.outstanding)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.status === 'Active' ? 'paid' : 'loss'}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setViewingContact(c)}
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditModal(c)}
                        title="Edit contact"
                      >
                        <Edit2 className="w-4 h-4 text-neutral-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleToggleArchive(c)}
                        title={c.status === 'Archived' ? 'Unarchive' : 'Archive'}
                      >
                        <Archive className="w-4 h-4 text-neutral-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeletingContactId(c.id)}
                        title="Delete contact"
                        className="hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 text-neutral-400 hover:text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-neutral-400">
                  No contacts found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Contact Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingContact ? 'Edit Contact' : 'Add New Contact'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveContact} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Full Name / Entity *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Acme Furnishings"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Contact Type *</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Customer">Customer</option>
                <option value="Vendor">Vendor</option>
                <option value="Both">Both</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Email *</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Mobile / Phone *</label>
              <Input
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">City</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">State</label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Pincode</label>
              <Input
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Outstanding Balance (₹)</label>
              <Input
                type="number"
                value={formData.outstanding}
                onChange={(e) => setFormData({ ...formData, outstanding: e.target.value })}
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
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingContact ? 'Update Contact' : 'Create Contact'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Contact Details Modal */}
      {viewingContact && (
        <Modal
          isOpen={true}
          onClose={() => setViewingContact(null)}
          title="Contact Dossier"
          subtitle={`Profile details for ${viewingContact.name}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div>
                <div className="text-base font-bold text-neutral-900">{viewingContact.name}</div>
                <div className="text-neutral-500">{viewingContact.type} Entity</div>
              </div>
              <Badge variant={viewingContact.status === 'Active' ? 'paid' : 'loss'}>
                {viewingContact.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-neutral-100 rounded-md bg-neutral-50/50">
                <span className="text-neutral-400 uppercase tracking-wider text-[10px] block font-bold">Email</span>
                <span className="font-semibold text-neutral-800 break-all">{viewingContact.email}</span>
              </div>
              <div className="p-3 border border-neutral-100 rounded-md bg-neutral-50/50">
                <span className="text-neutral-400 uppercase tracking-wider text-[10px] block font-bold">Mobile</span>
                <span className="font-semibold text-neutral-800">{viewingContact.mobile}</span>
              </div>
            </div>

            <div className="p-3 border border-neutral-100 rounded-md bg-neutral-50/50">
              <span className="text-neutral-400 uppercase tracking-wider text-[10px] block font-bold">Address</span>
              <span className="text-neutral-800">
                {viewingContact.address}, {viewingContact.city}, {viewingContact.state} - {viewingContact.pincode}
              </span>
            </div>

            <div className="p-3 border border-neutral-200 rounded-md bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <span className="text-neutral-400 text-[10px] uppercase tracking-wider block font-bold">Current Outstanding</span>
                <span className="text-lg font-bold font-mono text-white">{formatINR(viewingContact.outstanding)}</span>
              </div>
              <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                Ledger Synced
              </Badge>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setViewingContact(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingContactId}
        onClose={() => setDeletingContactId(null)}
        onConfirm={() => deleteRecord('contacts', deletingContactId)}
        title="Delete Contact Record"
        message="Are you sure you want to permanently delete this contact from your database? This will impact transaction linkages."
      />
    </div>
  );
};
