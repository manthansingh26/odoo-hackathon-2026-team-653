import React, { useState, useEffect } from 'react';
import { HelpCircle, Send, MessageSquare, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';

export const HelpFeedbackModal = ({
  isOpen,
  onClose,
  defaultCategory = 'Purchases & Orders',
  defaultReferenceId = ''
}) => {
  const { currentUser, userRole, addFeedback } = useAppContext();

  const [category, setCategory] = useState(defaultCategory);
  const [referenceId, setReferenceId] = useState(defaultReferenceId);
  const [priority, setPriority] = useState('Normal');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCategory(defaultCategory);
      setReferenceId(defaultReferenceId);
      setPriority('Normal');
      setMessage('');
    }
  }, [isOpen, defaultCategory, defaultReferenceId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    addFeedback({
      category,
      referenceId: referenceId.trim() || 'N/A',
      priority,
      message: message.trim()
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Purchases & Billing Help & Feedback"
      subtitle="Report an issue or share feedback directly with Executive Management & Admin"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Sender Info Banner */}
        <div className="p-3 bg-neutral-900 text-white rounded-lg flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-wider">Submitter Profile</span>
            <span className="font-bold text-sm text-white">
              {currentUser?.name || (userRole === 'Contact User' ? 'Nimesh Pathak' : 'Staff User')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-wider">Access Role</span>
            <span className="font-mono text-xs font-bold text-emerald-400">{userRole}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Module / Category *</label>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Purchase Orders">Purchase Orders</option>
              <option value="Vendor Bills">Vendor Bills</option>
              <option value="Customer Invoices">Customer Invoices</option>
              <option value="Payments & Settlement">Payments & Settlement</option>
              <option value="Product Quality & Delivery">Product Quality & Delivery</option>
              <option value="General Inquiry">General Inquiry</option>
            </Select>
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Priority Level *</label>
            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Normal">Normal Inquiry</option>
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent Issue</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">Document Reference ID (PO # / Bill # / Invoice # / UTR)</label>
          <Input
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            placeholder="e.g. PO-2026-001, BILL-2041, INV-1024, UTR-881920"
          />
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">Message / Feedback Details *</label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Provide details about your purchase order, billing statement, payment clearance, or suggestion..."
            className="w-full p-3 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <span className="text-[11px] text-neutral-500 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-neutral-600" /> Direct Executive Dispatch
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting || !message.trim()} className="gap-1.5 shadow-2xs">
              <Send className="w-3.5 h-3.5" />
              <span>Send Message to Admin</span>
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
