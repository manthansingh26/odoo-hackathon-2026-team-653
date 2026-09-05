import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { Plus, Trash2 } from 'lucide-react';

export const QuickActionModals = () => {
  const {
    activeModal,
    setActiveModal,
    data,
    addRecord,
    formatINR
  } = useAppContext();

  if (!activeModal) return null;

  const closeModal = () => setActiveModal(null);

  return (
    <>
      {activeModal.type === 'NEW_INVOICE' && (
        <InvoiceModal onClose={closeModal} data={data} addRecord={addRecord} />
      )}
      {activeModal.type === 'NEW_BILL' && (
        <BillModal onClose={closeModal} data={data} addRecord={addRecord} />
      )}
      {activeModal.type === 'NEW_PAYMENT' && (
        <PaymentModal onClose={closeModal} data={data} addRecord={addRecord} />
      )}
      {activeModal.type === 'ADD_CONTACT' && (
        <ContactModal onClose={closeModal} addRecord={addRecord} />
      )}
      {activeModal.type === 'ADD_PRODUCT' && (
        <ProductModal onClose={closeModal} addRecord={addRecord} />
      )}
    </>
  );
};

// --- INVOICE MODAL ---
const InvoiceModal = ({ onClose, data, addRecord }) => {
  const [contactId, setContactId] = useState(data.contacts[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
  );
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState([
    {
      productId: data.products[0]?.id || '',
      quantity: 1,
      unitPrice: data.products[0]?.salesPrice || 10000,
      taxRate: 18
    }
  ]);
  const [notes, setNotes] = useState('Standard 1-year warranty included. Payment due on invoice maturity.');

  const handleProductChange = (index, prodId) => {
    const prod = data.products.find(p => p.id === prodId);
    setItems(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        productId: prodId,
        unitPrice: prod?.salesPrice || 0
      };
      return copy;
    });
  };

  const handleItemChange = (index, field, val) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: Number(val) };
      return copy;
    });
  };

  const addItemRow = () => {
    setItems(prev => [
      ...prev,
      {
        productId: data.products[0]?.id || '',
        quantity: 1,
        unitPrice: data.products[0]?.salesPrice || 5000,
        taxRate: 18
      }
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
  const tax = items.reduce((acc, it) => acc + (it.quantity * it.unitPrice * (it.taxRate / 100)), 0);
  const grandTotal = Math.max(0, subtotal + tax - Number(discount));

  const handleSubmit = (e) => {
    e.preventDefault();
    const contact = data.contacts.find(c => c.id === contactId);
    const invoiceId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;

    const formattedItems = items.map(it => {
      const p = data.products.find(prod => prod.id === it.productId);
      const lineSubtotal = it.quantity * it.unitPrice;
      const lineTax = lineSubtotal * (it.taxRate / 100);
      return {
        productId: it.productId,
        productName: p?.name || 'Custom Product',
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        taxRate: it.taxRate,
        total: Math.round(lineSubtotal + lineTax)
      };
    });

    addRecord('invoices', {
      id: invoiceId,
      orderId: `SO-${Math.floor(1000 + Math.random() * 9000)}`,
      contactId,
      customerName: contact?.name || 'Unknown Contact',
      customerEmail: contact?.email || '',
      customerAddress: contact?.address || '',
      date,
      dueDate,
      items: formattedItems,
      subtotal: Math.round(subtotal),
      tax: Math.round(tax),
      discount: Number(discount),
      grandTotal: Math.round(grandTotal),
      amountPaid: 0,
      status: 'Pending',
      paymentMethod: 'Pending',
      notes
    });

    // Also add to recent transactions
    addRecord('recentTransactions', {
      id: `TX-${Date.now()}`,
      date,
      reference: invoiceId,
      contactId,
      contact: contact?.name || 'Unknown',
      type: 'Sales',
      amount: Math.round(grandTotal),
      status: 'Pending'
    });

    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create Customer Invoice" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Customer *</label>
            <Select value={contactId} onChange={(e) => setContactId(e.target.value)} required>
              {data.contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Invoice Date *</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Due Date *</label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>
        </div>

        {/* Line Items */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Invoice Items</span>
            <Button type="button" size="xs" variant="outline" onClick={addItemRow}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Line
            </Button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {items.map((it, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-neutral-50 p-2 rounded-md border border-neutral-200">
                <div className="flex-1">
                  <Select
                    value={it.productId}
                    onChange={(e) => handleProductChange(idx, e.target.value)}
                    className="text-xs py-1"
                  >
                    {data.products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - ₹{p.salesPrice}</option>
                    ))}
                  </Select>
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="text-xs py-1"
                  />
                </div>
                <div className="w-28">
                  <Input
                    type="number"
                    min="0"
                    value={it.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    placeholder="Price"
                    className="text-xs py-1"
                  />
                </div>
                <div className="w-20">
                  <Select
                    value={it.taxRate}
                    onChange={(e) => handleItemChange(idx, 'taxRate', e.target.value)}
                    className="text-xs py-1"
                  >
                    <option value="0">0% GST</option>
                    <option value="5">5% GST</option>
                    <option value="12">12% GST</option>
                    <option value="18">18% GST</option>
                    <option value="28">28% GST</option>
                  </Select>
                </div>
                <button
                  type="button"
                  onClick={() => removeItemRow(idx)}
                  disabled={items.length <= 1}
                  className="p-1.5 text-neutral-400 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Totals & Summary */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Discount (₹)</label>
            <Input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0"
              className="text-xs"
            />
            <div className="mt-2">
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Terms & Notes</label>
              <Textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-neutral-600 flex flex-col justify-end">
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span>Subtotal:</span>
              <span className="font-semibold text-neutral-900">₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span>GST Tax:</span>
              <span className="font-semibold text-neutral-900">₹{Math.round(tax).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span>Discount:</span>
              <span className="font-semibold text-red-700">-₹{Number(discount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 text-sm font-bold text-neutral-950 border-t-2 border-neutral-900">
              <span>Grand Total:</span>
              <span className="font-mono text-base">₹{Math.round(grandTotal).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="sm">Create Invoice</Button>
        </div>
      </form>
    </Modal>
  );
};

// --- BILL MODAL ---
const BillModal = ({ onClose, data, addRecord }) => {
  const vendors = data.contacts.filter(c => c.type === 'Vendor' || c.type === 'Both');
  const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
  const [vendorInvNo, setVendorInvNo] = useState(`VN-${Math.floor(1000 + Math.random() * 9000)}`);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [amount, setAmount] = useState(50000);
  const [description, setDescription] = useState('Procurement of raw materials and hardware.');

  const handleSubmit = (e) => {
    e.preventDefault();
    const vendor = data.contacts.find(c => c.id === vendorId);
    const billId = `BILL-${Math.floor(2000 + Math.random() * 9000)}`;

    addRecord('bills', {
      id: billId,
      vendorId,
      vendorName: vendor?.name || 'Vendor',
      vendorInvoiceNumber: vendorInvNo,
      date,
      dueDate,
      items: [{ description, quantity: 1, unitPrice: Number(amount), total: Number(amount) }],
      subtotal: Number(amount),
      tax: 0,
      total: Number(amount),
      amountPaid: 0,
      status: 'Pending'
    });

    addRecord('recentTransactions', {
      id: `TX-${Date.now()}`,
      date,
      reference: billId,
      contactId: vendorId,
      contact: vendor?.name || 'Vendor',
      type: 'Purchase',
      amount: Number(amount),
      status: 'Pending'
    });

    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Record Vendor Bill" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Vendor *</label>
          <Select value={vendorId} onChange={(e) => setVendorId(e.target.value)} required>
            {vendors.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Vendor Bill No. *</label>
            <Input value={vendorInvNo} onChange={(e) => setVendorInvNo(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Bill Amount (₹) *</label>
            <Input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Bill Date *</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Due Date *</label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Description / Item Details</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </div>
        <div className="flex justify-end gap-2 pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="sm">Save Bill</Button>
        </div>
      </form>
    </Modal>
  );
};

// --- PAYMENT MODAL ---
const PaymentModal = ({ onClose, data, addRecord }) => {
  const [type, setType] = useState('Customer Payment');
  const [contactId, setContactId] = useState(data.contacts[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState('Bank');
  const [amount, setAmount] = useState(25000);
  const [reference, setReference] = useState(`NEFT-${Math.floor(100000 + Math.random() * 900000)}`);
  const [notes, setNotes] = useState('Payment settlement via electronic bank transfer.');

  const handleSubmit = (e) => {
    e.preventDefault();
    const contact = data.contacts.find(c => c.id === contactId);
    const payId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;

    addRecord('payments', {
      id: payId,
      date,
      reference,
      type,
      contactId,
      contactName: contact?.name || 'Contact',
      method,
      amount: Number(amount),
      status: 'Completed',
      notes
    });

    addRecord('recentTransactions', {
      id: `TX-${Date.now()}`,
      date,
      reference: payId,
      contact: contact?.name || 'Contact',
      type: 'Payment',
      amount: Number(amount),
      status: 'Completed'
    });

    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Record Payment" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Payment Type *</label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Customer Payment">Customer Payment (Inflow)</option>
              <option value="Vendor Payment">Vendor Payment (Outflow)</option>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Contact Party *</label>
            <Select value={contactId} onChange={(e) => setContactId(e.target.value)}>
              {data.contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Amount (₹) *</label>
            <Input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Payment Method *</label>
            <Select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="Bank">Bank (NEFT / RTGS)</option>
              <option value="Cash">Cash in Hand</option>
              <option value="UPI">UPI / Card</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Payment Date *</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Reference / UTR No. *</label>
            <Input value={reference} onChange={(e) => setReference(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Notes</label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="sm">Register Payment</Button>
        </div>
      </form>
    </Modal>
  );
};

// --- ADD CONTACT MODAL ---
const ContactModal = ({ onClose, addRecord }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    addRecord('contacts', {
      ...formData,
      outstanding: Number(formData.outstanding),
      favorite: false,
      createdAt: new Date().toISOString().slice(0, 10)
    });
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add New Contact" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Contact Name *</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Kulkarni"
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
              <option value="Both">Both (Customer & Vendor)</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Email Address *</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="client@domain.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Mobile Number *</label>
            <Input
              required
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Street Address</label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Plot / Flat / Street Name"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">City *</label>
            <Input
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">State *</label>
            <Input
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Pincode *</label>
            <Input
              required
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="sm">Save Contact</Button>
        </div>
      </form>
    </Modal>
  );
};

// --- ADD PRODUCT MODAL ---
const ProductModal = ({ onClose, addRecord }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: `FURN-${Math.floor(100 + Math.random() * 900)}`,
    type: 'Goods',
    category: 'Seating',
    salesPrice: 15000,
    purchasePrice: 9500,
    stock: 20,
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addRecord('products', {
      ...formData,
      salesPrice: Number(formData.salesPrice),
      purchasePrice: Number(formData.purchasePrice),
      stock: formData.type === 'Service' ? null : Number(formData.stock),
      status: Number(formData.stock) > 5 ? 'Active' : 'Low Stock',
      favorite: false
    });
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add New Product" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Product Name *</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ergonomic Standing Desk"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Item Code / SKU *</label>
            <Input
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Product Type *</label>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Goods">Goods (Physical Product)</option>
              <option value="Service">Service</option>
              <option value="Combo">Combo / Bundle</option>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Category *</label>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Seating">Seating</option>
              <option value="Desks">Desks</option>
              <option value="Tables">Tables</option>
              <option value="Lounge">Lounge</option>
              <option value="Storage">Storage</option>
              <option value="Acoustics">Acoustics</option>
              <option value="Service">Service</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Sales Price (₹) *</label>
            <Input
              type="number"
              min="0"
              required
              value={formData.salesPrice}
              onChange={(e) => setFormData({ ...formData, salesPrice: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Cost / Purchase (₹)</label>
            <Input
              type="number"
              min="0"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Opening Stock</label>
            <Input
              type="number"
              min="0"
              disabled={formData.type === 'Service'}
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Description</label>
          <Textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Product materials, finish, and dimensions"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="sm">Save Product</Button>
        </div>
      </form>
    </Modal>
  );
};
