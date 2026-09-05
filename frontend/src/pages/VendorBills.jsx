import React, { useState } from 'react';
import { ShoppingCart, Plus, Eye, CreditCard, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';

export const VendorBills = () => {
  const { data, updateRecord, setActiveModal, formatINR, addRecord } = useAppContext();

  const [viewingBill, setViewingBill] = useState(null);

  const handleRegisterPayment = (bill) => {
    const payId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;

    addRecord('payments', {
      id: payId,
      date: new Date().toISOString().slice(0, 10),
      reference: `UTR-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'Vendor Payment',
      contactId: bill.vendorId,
      contactName: bill.vendorName,
      invoiceBillId: bill.id,
      method: 'Bank',
      amount: bill.total,
      status: 'Completed',
      notes: `Settlement of vendor bill ${bill.id} / ${bill.vendorInvoiceNumber}`
    });

    updateRecord('bills', bill.id, {
      status: 'Paid',
      amountPaid: bill.total
    });

    if (viewingBill && viewingBill.id === bill.id) {
      setViewingBill(prev => ({ ...prev, status: 'Paid', amountPaid: bill.total }));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">Vendor Bills</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Incoming invoices received from material suppliers, logistics partners, and subcontractors.
          </p>
        </div>
        <Button
          onClick={() => setActiveModal({ type: 'NEW_BILL' })}
          size="sm"
          variant="primary"
          className="shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Record Vendor Bill
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill Reference</TableHead>
              <TableHead>Vendor Bill #</TableHead>
              <TableHead>Bill Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Vendor Supplier</TableHead>
              <TableHead>Total Bill</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.bills && data.bills.length > 0 ? (
              data.bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-mono font-bold text-xs text-neutral-950">
                    {bill.id}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">
                    {bill.vendorInvoiceNumber}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{bill.date}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{bill.dueDate}</TableCell>
                  <TableCell className="font-semibold text-neutral-900">{bill.vendorName}</TableCell>
                  <TableCell className="font-mono font-bold text-neutral-950">
                    {formatINR(bill.total)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={bill.status === 'Paid' ? 'paid' : bill.status === 'Pending' ? 'pending' : 'overdue'}>
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setViewingBill(bill)}
                        title="View bill"
                      >
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </Button>
                      {bill.status !== 'Paid' && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleRegisterPayment(bill)}
                          title="Register payment to vendor"
                          className="text-xs"
                        >
                          <CreditCard className="w-3.5 h-3.5 mr-1" />
                          Pay
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-neutral-400">
                  No vendor bills logged.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Bill Modal */}
      {viewingBill && (
        <Modal
          isOpen={true}
          onClose={() => setViewingBill(null)}
          title={`Vendor Bill: ${viewingBill.id}`}
          subtitle={`Supplier: ${viewingBill.vendorName} (Inv: ${viewingBill.vendorInvoiceNumber})`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 grid grid-cols-2 gap-2">
              <div>Bill Date: <span className="font-mono font-semibold">{viewingBill.date}</span></div>
              <div>Due Date: <span className="font-mono font-semibold">{viewingBill.dueDate}</span></div>
              <div>PO Reference: <span className="font-mono">{viewingBill.poReference || 'Direct'}</span></div>
              <div>Status: <Badge variant={viewingBill.status === 'Paid' ? 'paid' : 'pending'}>{viewingBill.status}</Badge></div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewingBill.items.map((it, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{it.description}</TableCell>
                    <TableCell className="font-mono">{it.quantity}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{formatINR(it.total)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-neutral-50">
                  <TableCell colSpan={2}>Grand Total</TableCell>
                  <TableCell className="text-right font-mono font-bold text-neutral-950">
                    {formatINR(viewingBill.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setViewingBill(null)}>Close</Button>
              {viewingBill.status !== 'Paid' && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleRegisterPayment(viewingBill)}
                >
                  Register Full Settlement
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
