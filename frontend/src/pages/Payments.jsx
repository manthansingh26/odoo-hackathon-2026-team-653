import React, { useState } from 'react';
import { CreditCard, Plus, Eye, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';

export const Payments = () => {
  const { data, setActiveModal, formatINR } = useAppContext();

  const [viewingPayment, setViewingPayment] = useState(null);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">Payments Register</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit log of cash inflows from customers and bank disbursements to suppliers.
          </p>
        </div>
        <Button
          onClick={() => setActiveModal({ type: 'NEW_PAYMENT' })}
          size="sm"
          variant="primary"
          className="shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Record Payment
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Ref</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Contact Party</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Channel / Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.payments && data.payments.length > 0 ? (
              data.payments.map((p) => {
                const isCustomer = p.type === 'Customer Payment';

                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono font-bold text-xs text-neutral-950">
                      {p.reference || p.id}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-neutral-600">{p.date}</TableCell>
                    <TableCell className="font-semibold text-neutral-900">{p.contactName}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium ${
                        isCustomer ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {isCustomer ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {p.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-neutral-600">
                      {p.method}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-neutral-950">
                      {formatINR(p.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="paid">{p.status || 'Completed'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setViewingPayment(p)}
                        title="View payment details"
                      >
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-neutral-400">
                  No payments recorded.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Payment Voucher */}
      {viewingPayment && (
        <Modal
          isOpen={true}
          onClose={() => setViewingPayment(null)}
          title={`Payment Voucher: ${viewingPayment.id}`}
          subtitle={`Type: ${viewingPayment.type}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Contact:</span>
                <span className="font-bold text-neutral-900">{viewingPayment.contactName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Reference:</span>
                <span className="font-mono font-semibold text-neutral-900">{viewingPayment.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date:</span>
                <span className="font-mono text-neutral-700">{viewingPayment.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Channel:</span>
                <span className="text-neutral-700">{viewingPayment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Linked Document:</span>
                <span className="font-mono text-neutral-800">{viewingPayment.invoiceBillId || 'General Ledger Account'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold">
                <span>Amount Transacted:</span>
                <span className="font-mono text-neutral-950">{formatINR(viewingPayment.amount)}</span>
              </div>
            </div>

            {viewingPayment.notes && (
              <div className="p-3 bg-neutral-100 rounded-md text-neutral-600">
                <span className="font-semibold block text-neutral-800 mb-0.5">Notes:</span>
                {viewingPayment.notes}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setViewingPayment(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
