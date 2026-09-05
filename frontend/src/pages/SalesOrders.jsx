import React, { useState } from 'react';
import { Plus, Receipt, Trash2, Eye, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';

export const SalesOrders = () => {
  const { data, addRecord, formatINR } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);

  const [customerContactId, setCustomerContactId] = useState(data.contacts[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [expectedDelivery, setExpectedDelivery] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  );
  const [items, setItems] = useState([
    {
      productId: data.products[0]?.id || '',
      quantity: 2,
      unitPrice: data.products[0]?.salesPrice || 14500,
      taxRate: 18
    }
  ]);
  const [discount, setDiscount] = useState(0);

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

  const subtotal = items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
  const tax = items.reduce((acc, it) => acc + (it.quantity * it.unitPrice * (it.taxRate / 100)), 0);
  const grandTotal = Math.max(0, subtotal + tax - Number(discount));

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const contact = data.contacts.find(c => c.id === customerContactId);
    const orderId = `SO-2026-${Math.floor(100 + Math.random() * 900)}`;

    const formattedItems = items.map(it => {
      const p = data.products.find(prod => prod.id === it.productId);
      const lineSub = it.quantity * it.unitPrice;
      const lineTax = lineSub * (it.taxRate / 100);
      return {
        productId: it.productId,
        productName: p?.name || 'Item',
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        taxRate: it.taxRate,
        total: Math.round(lineSub + lineTax)
      };
    });

    addRecord('salesOrders', {
      id: orderId,
      date,
      contactId: customerContactId,
      customerName: contact?.name || 'Customer',
      expectedDelivery,
      items: formattedItems,
      subtotal: Math.round(subtotal),
      tax: Math.round(tax),
      discount: Number(discount),
      grandTotal: Math.round(grandTotal),
      status: 'Confirmed'
    });

    setIsModalOpen(false);
  };

  const convertToInvoice = (so) => {
    const invId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const contact = data.contacts.find(c => c.id === so.contactId);

    addRecord('invoices', {
      id: invId,
      orderId: so.id,
      contactId: so.contactId,
      customerName: so.customerName,
      customerEmail: contact?.email || '',
      customerAddress: contact?.address || '',
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      items: so.items,
      subtotal: so.subtotal,
      tax: so.tax,
      discount: so.discount,
      grandTotal: so.grandTotal,
      amountPaid: 0,
      status: 'Pending',
      paymentMethod: 'Pending',
      notes: `Generated automatically from confirmed sales order #${so.id}`
    });

    addRecord('recentTransactions', {
      id: `TX-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      reference: invId,
      contactId: so.contactId,
      contact: so.customerName,
      type: 'SALE',
      amount: so.grandTotal,
      status: 'Pending'
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">Sales Orders</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Confirmed commercial bookings and customer quote orders.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" variant="primary" className="shadow-xs">
          <Plus className="w-4 h-4 mr-1.5" />
          Create Sales Order
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Items Count</TableHead>
              <TableHead>Grand Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.salesOrders && data.salesOrders.length > 0 ? (
              data.salesOrders.map((so) => (
                <TableRow key={so.id}>
                  <TableCell className="font-mono font-bold text-xs text-neutral-950">
                    {so.id}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{so.date}</TableCell>
                  <TableCell className="font-semibold text-neutral-900">{so.customerName}</TableCell>
                  <TableCell className="text-xs text-neutral-600 font-mono">{so.expectedDelivery}</TableCell>
                  <TableCell className="text-xs text-neutral-700">
                    {so.items?.length || 0} product(s)
                  </TableCell>
                  <TableCell className="font-mono font-bold text-neutral-950">
                    {formatINR(so.grandTotal)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={so.status === 'Confirmed' ? 'paid' : 'pending'}>
                      {so.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setViewingOrder(so)}
                        title="View order"
                      >
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => convertToInvoice(so)}
                        title="Convert to Customer Invoice"
                        className="text-xs gap-1"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-neutral-400">
                  No sales orders recorded.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* New Sales Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Sales Order"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Customer *</label>
              <Select value={customerContactId} onChange={(e) => setCustomerContactId(e.target.value)}>
                {data.contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Order Date *</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Expected Delivery *</label>
              <Input type="date" value={expectedDelivery} onChange={(e) => setExpectedDelivery(e.target.value)} required />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">Order Lines</span>
              <Button type="button" size="xs" variant="outline" onClick={addItemRow}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Product
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
                        <option key={p.id} value={p.id}>{p.name} (₹{p.salesPrice})</option>
                      ))}
                    </Select>
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={it.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="text-xs py-1 font-mono"
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Price"
                      value={it.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                      className="text-xs py-1 font-mono"
                    />
                  </div>
                  <div className="w-20">
                    <Select
                      value={it.taxRate}
                      onChange={(e) => handleItemChange(idx, 'taxRate', e.target.value)}
                      className="text-xs py-1"
                    >
                      <option value="0">0%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    disabled={items.length <= 1}
                    className="p-1 text-neutral-400 hover:text-red-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 flex justify-between items-center text-xs">
            <div className="w-44">
              <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Discount (₹)</label>
              <Input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="text-xs h-8"
              />
            </div>
            <div className="text-right space-y-1">
              <div className="text-neutral-500">Subtotal: {formatINR(subtotal)}</div>
              <div className="text-neutral-500">GST Tax: {formatINR(tax)}</div>
              <div className="text-base font-bold font-mono text-neutral-950">
                Grand Total: {formatINR(grandTotal)}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Sales Order</Button>
          </div>
        </form>
      </Modal>

      {/* View Sales Order Modal */}
      {viewingOrder && (
        <Modal
          isOpen={true}
          onClose={() => setViewingOrder(null)}
          title={`Sales Order: ${viewingOrder.id}`}
          subtitle={`Customer: ${viewingOrder.customerName}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Date</span>
                <span className="font-semibold text-neutral-800">{viewingOrder.date}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Delivery Promised</span>
                <span className="font-semibold text-neutral-800">{viewingOrder.expectedDelivery}</span>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewingOrder.items.map((it, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium text-neutral-900">{it.productName}</TableCell>
                    <TableCell className="font-mono">{it.quantity}</TableCell>
                    <TableCell className="font-mono">{formatINR(it.unitPrice)}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-neutral-900">{formatINR(it.total)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-neutral-50">
                  <TableCell colSpan={3}>Grand Total</TableCell>
                  <TableCell className="text-right font-mono text-neutral-950 font-bold">
                    {formatINR(viewingOrder.grandTotal)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setViewingOrder(null)}>Close</Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  convertToInvoice(viewingOrder);
                  setViewingOrder(null);
                }}
              >
                Generate Invoice
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
