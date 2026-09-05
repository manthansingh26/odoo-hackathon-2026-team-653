import React, { useState } from 'react';
import { ShoppingCart, Plus, ArrowRight, Eye, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';

export const PurchaseOrders = () => {
  const { data, addRecord, formatINR } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPO, setViewingPO] = useState(null);

  const vendors = data.contacts.filter(c => c.type === 'Vendor' || c.type === 'Both');
  const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
  const [expectedDate, setExpectedDate] = useState(
    new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10)
  );
  const [items, setItems] = useState([
    {
      productId: data.products[0]?.id || '',
      quantity: 10,
      unitPrice: data.products[0]?.purchasePrice || 8000
    }
  ]);

  const handleProductChange = (index, prodId) => {
    const prod = data.products.find(p => p.id === prodId);
    setItems(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        productId: prodId,
        unitPrice: prod?.purchasePrice || 0
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
        quantity: 5,
        unitPrice: data.products[0]?.purchasePrice || 5000
      }
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);

  const handleCreatePO = (e) => {
    e.preventDefault();
    const v = data.contacts.find(c => c.id === vendorId);
    const poId = `PO-2026-${Math.floor(100 + Math.random() * 900)}`;

    const formattedItems = items.map(it => {
      const p = data.products.find(prod => prod.id === it.productId);
      return {
        productId: it.productId,
        productName: p?.name || 'Raw Component',
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        total: it.quantity * it.unitPrice
      };
    });

    addRecord('purchaseOrders', {
      id: poId,
      date: new Date().toISOString().slice(0, 10),
      vendorId,
      vendorName: v?.name || 'Vendor',
      expectedDate,
      items: formattedItems,
      totalAmount,
      status: 'Confirmed'
    });

    setIsModalOpen(false);
  };

  const convertPOToBill = (po) => {
    const billId = `BILL-${Math.floor(2000 + Math.random() * 9000)}`;

    addRecord('bills', {
      id: billId,
      poReference: po.id,
      vendorId: po.vendorId,
      vendorName: po.vendorName,
      vendorInvoiceNumber: `VN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10),
      items: po.items.map(it => ({
        description: it.productName,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        total: it.total
      })),
      subtotal: po.totalAmount,
      tax: 0,
      total: po.totalAmount,
      amountPaid: 0,
      status: 'Pending'
    });

    addRecord('recentTransactions', {
      id: `TX-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      reference: billId,
      contact: po.vendorName,
      type: 'Purchase',
      amount: po.totalAmount,
      status: 'Pending'
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">Purchase Orders</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Procurement requisitions sent to timber mills and hardware suppliers.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" variant="primary" className="shadow-xs">
          <Plus className="w-4 h-4 mr-1.5" />
          Create Purchase Order
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead>Total Requisition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.purchaseOrders && data.purchaseOrders.length > 0 ? (
              data.purchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-mono font-bold text-xs text-neutral-950">
                    {po.id}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{po.date}</TableCell>
                  <TableCell className="font-semibold text-neutral-900">{po.vendorName}</TableCell>
                  <TableCell className="text-xs font-mono text-neutral-600">{po.expectedDate}</TableCell>
                  <TableCell className="font-mono font-bold text-neutral-950">
                    {formatINR(po.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={po.status === 'Confirmed' ? 'paid' : 'pending'}>
                      {po.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setViewingPO(po)}
                        title="View PO"
                      >
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => convertPOToBill(po)}
                        title="Convert PO to Vendor Bill"
                        className="text-xs gap-1"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>To Bill</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-neutral-400">
                  No purchase orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create PO Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Purchase Order"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreatePO} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Vendor Supplier *</label>
              <Select value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Expected Delivery *</label>
              <Input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} required />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">Procurement Items</span>
              <Button type="button" size="xs" variant="outline" onClick={addItemRow}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Row
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
                        <option key={p.id} value={p.id}>{p.name} (Cost: ₹{p.purchasePrice})</option>
                      ))}
                    </Select>
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={it.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="text-xs py-1 font-mono"
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Cost (₹)"
                      value={it.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                      className="text-xs py-1 font-mono"
                    />
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

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex justify-between items-center text-sm font-bold">
            <span>Total Requisition:</span>
            <span className="font-mono text-base">{formatINR(totalAmount)}</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Issue Purchase Order</Button>
          </div>
        </form>
      </Modal>

      {/* View PO Modal */}
      {viewingPO && (
        <Modal
          isOpen={true}
          onClose={() => setViewingPO(null)}
          title={`Purchase Order: ${viewingPO.id}`}
          subtitle={`Vendor: ${viewingPO.vendorName}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex justify-between">
              <div>Date: {viewingPO.date}</div>
              <div>Expected: {viewingPO.expectedDate}</div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material / Component</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewingPO.items.map((it, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{it.productName}</TableCell>
                    <TableCell className="font-mono">{it.quantity}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{formatINR(it.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setViewingPO(null)}>Close</Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  convertPOToBill(viewingPO);
                  setViewingPO(null);
                }}
              >
                Convert to Vendor Bill
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
