import React, { useState, useMemo } from 'react';
import { MessageSquare, Filter, CheckCircle2, Clock, AlertTriangle, Eye, Search, Send, User, Building2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const AdminFeedbackInbox = () => {
  const { data, updateFeedbackStatus } = useAppContext();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'New' | 'In Progress' | 'Resolved'
  const [roleFilter, setRoleFilter] = useState('All'); // 'All' | 'Contact User' | 'Accountant' | 'Vendor' | 'Admin'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyNote, setReplyNote] = useState('');

  const messages = data.feedbackMessages || [];

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const matchTab = activeTab === 'All' || msg.status === activeTab;
      const matchRole = roleFilter === 'All' || msg.senderRole === roleFilter;
      const matchCategory = categoryFilter === 'All' || msg.category === categoryFilter;

      const q = searchQuery.toLowerCase();
      const matchSearch =
        (msg.senderName || '').toLowerCase().includes(q) ||
        (msg.email || '').toLowerCase().includes(q) ||
        (msg.referenceId || '').toLowerCase().includes(q) ||
        (msg.message || '').toLowerCase().includes(q);

      return matchTab && matchRole && matchCategory && matchSearch;
    });
  }, [messages, activeTab, roleFilter, categoryFilter, searchQuery]);

  const newCount = messages.filter(m => m.status === 'New').length;
  const inProgressCount = messages.filter(m => m.status === 'In Progress').length;
  const urgentCount = messages.filter(m => m.priority === 'Urgent' && m.status !== 'Resolved').length;
  const resolvedCount = messages.filter(m => m.status === 'Resolved').length;

  const handleUpdateTicket = (id, newStatus) => {
    updateFeedbackStatus(id, newStatus, replyNote);
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket(prev => ({ ...prev, status: newStatus, adminNote: replyNote || prev.adminNote }));
    }
    setReplyNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950">Help & Feedback Messages Inbox</h1>
            {newCount > 0 && (
              <Badge variant="loss" className="font-mono text-xs">
                {newCount} New
              </Badge>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Executive management console receiving direct issue reports and feedback from Customers, Accountants, and Vendors.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Inbox</span>
            <div className="text-2xl font-bold font-mono text-neutral-950 mt-0.5">{messages.length}</div>
          </div>
          <div className="p-2.5 bg-neutral-100 rounded-lg text-neutral-700">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">New Messages</span>
            <div className="text-2xl font-bold font-mono text-amber-700 mt-0.5">{newCount}</div>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">In Progress</span>
            <div className="text-2xl font-bold font-mono text-blue-700 mt-0.5">{inProgressCount}</div>
          </div>
          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Resolved</span>
            <div className="text-2xl font-bold font-mono text-emerald-700 mt-0.5">{resolvedCount}</div>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Status Tabs & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-neutral-200 shadow-2xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-md overflow-x-auto">
          {['All', 'New', 'In Progress', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white text-neutral-950 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab === 'All' ? `All (${messages.length})` : tab}
            </button>
          ))}
        </div>

        {/* Sender Role, Category & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-white border border-neutral-200 rounded-md px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="All">All User Roles</option>
            <option value="Contact User">Customers</option>
            <option value="Accountant">Accountants</option>
            <option value="Vendor">Vendors</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-white border border-neutral-200 rounded-md px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Purchase Orders">Purchase Orders</option>
            <option value="Vendor Bills">Vendor Bills</option>
            <option value="Customer Invoices">Customer Invoices</option>
            <option value="Payments & Settlement">Payments</option>
            <option value="Product Quality & Delivery">Delivery / Quality</option>
          </select>

          <div className="relative w-full sm:w-52">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticket, sender..."
              className="pl-8 text-xs h-8"
            />
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket #</TableHead>
              <TableHead>Sender Party</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Category & Ref</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Message Snippet</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => (
                <TableRow key={msg.id} className={msg.status === 'New' ? 'bg-amber-50/30' : ''}>
                  <TableCell className="font-mono font-bold text-xs text-neutral-950">{msg.id}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-neutral-900 text-xs">{msg.senderName}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">{msg.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={msg.senderRole === 'Contact User' ? 'dark' : msg.senderRole === 'Accountant' ? 'default' : 'outline'}>
                      {msg.senderRole}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium text-neutral-900">{msg.category}</div>
                    <div className="text-[10px] font-mono text-neutral-500">Ref: {msg.referenceId || 'N/A'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        msg.priority === 'Urgent'
                          ? 'loss'
                          : msg.priority === 'High'
                          ? 'pending'
                          : 'outline'
                      }
                    >
                      {msg.priority || 'Normal'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-neutral-700">
                    {msg.message}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        msg.status === 'Resolved'
                          ? 'paid'
                          : msg.status === 'In Progress'
                          ? 'pending'
                          : 'loss'
                      }
                    >
                      {msg.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedTicket(msg)}
                        title="View Ticket Dossier"
                      >
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </Button>

                      {msg.status !== 'Resolved' && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleUpdateTicket(msg.id, 'Resolved')}
                          className="text-[11px] gap-1 text-emerald-700 hover:text-emerald-800"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Resolve</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-neutral-400 text-xs">
                  No feedback tickets found matching your active criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Ticket Details & Resolution Drawer Modal */}
      {selectedTicket && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTicket(null)}
          title={`Support Ticket ${selectedTicket.id}`}
          subtitle={`Received on ${selectedTicket.date}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">Submitter Coordinates</span>
                <span className="font-bold text-neutral-900 text-sm">{selectedTicket.senderName}</span>
                <span className="text-neutral-500 text-xs block">{selectedTicket.senderRole} • {selectedTicket.email}</span>
              </div>
              <div className="text-right space-y-1">
                <Badge variant={selectedTicket.status === 'Resolved' ? 'paid' : 'pending'}>
                  {selectedTicket.status}
                </Badge>
                <div className="text-[10px] font-mono text-neutral-500">Priority: {selectedTicket.priority}</div>
              </div>
            </div>

            {/* Category & Reference */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-white border border-neutral-200 rounded-md">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">Module / Category</span>
                <span className="font-semibold text-neutral-900">{selectedTicket.category}</span>
              </div>
              <div className="p-2.5 bg-white border border-neutral-200 rounded-md">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">Document Reference</span>
                <span className="font-mono text-xs font-bold text-neutral-900">{selectedTicket.referenceId}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="p-3.5 bg-neutral-900 text-white rounded-lg space-y-1">
              <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">User Message / Issue Report</div>
              <p className="text-xs leading-relaxed text-neutral-200 whitespace-pre-wrap font-sans">
                {selectedTicket.message}
              </p>
            </div>

            {/* Admin Response Note */}
            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-800 block">Admin Resolution Notes & Internal Action</label>
              <textarea
                rows={3}
                value={replyNote}
                onChange={(e) => setReplyNote(e.target.value)}
                placeholder="Enter internal action taken, clearance notes, or customer response details..."
                className="w-full p-2.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
              />
              {selectedTicket.adminNote && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-950 text-xs">
                  <span className="font-bold block text-emerald-800">Previous Admin Resolution:</span>
                  {selectedTicket.adminNote}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant={selectedTicket.status === 'In Progress' ? 'primary' : 'outline'}
                  onClick={() => handleUpdateTicket(selectedTicket.id, 'In Progress')}
                >
                  Mark In Progress
                </Button>
                <Button
                  size="xs"
                  variant={selectedTicket.status === 'Resolved' ? 'primary' : 'outline'}
                  onClick={() => handleUpdateTicket(selectedTicket.id, 'Resolved')}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 border-none"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Resolve Ticket
                </Button>
              </div>

              <Button size="sm" variant="outline" onClick={() => setSelectedTicket(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
