import React, { useState } from 'react';
import { Receipt, Eye, Printer, Download, CreditCard } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';

export const MyInvoices = () => {
  const { data, activeContactId, formatINR, updateRecord } = useAppContext();
  const [viewingInvoice, setViewingInvoice] = useState(null);

  // Filter only invoices belonging to this client (or match Nimesh Pathak C-101)
  const myInvoices = (data.invoices || []).filter(
    inv => inv.contactId === activeContactId || inv.customerName.toLowerCase().includes('nimesh')
  );

  const handlePayNow = (inv) => {
    updateRecord('invoices', inv.id, {
      status: 'Paid',
      amountPaid: inv.grandTotal,
      paymentMethod: 'UPI / Online'
    });
    setViewingInvoice(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-950">My Invoices</h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          View and settle your commercial furniture invoices issued by Urban Furniture.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date Issued</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Items Count</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myInvoices.length > 0 ? (
              myInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono font-bold text-xs text-neutral-950">{inv.id}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{inv.date}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{inv.dueDate}</TableCell>
                  <TableCell className="text-xs text-neutral-600">{inv.items?.length || 1} item(s)</TableCell>
                  <TableCell className="font-mono font-bold text-neutral-950">{formatINR(inv.grandTotal)}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === 'Paid' ? 'paid' : inv.status === 'Pending' ? 'pending' : 'overdue'}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setViewingInvoice(inv)} title="View invoice">
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </Button>
                      {inv.status !== 'Paid' && (
                        <Button size="xs" variant="primary" onClick={() => handlePayNow(inv)} className="text-xs gap-1">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay Now</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-neutral-400">
                  You have no outstanding invoices.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Invoice Detail Modal */}
      {viewingInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setViewingInvoice(null)}
          title={`Invoice ${viewingInvoice.id}`}
          subtitle={`Due: ${viewingInvoice.dueDate}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">Billed To</span>
                <span className="font-semibold text-neutral-900">{viewingInvoice.customerName}</span>
              </div>
              <Badge variant={viewingInvoice.status === 'Paid' ? 'paid' : 'pending'}>
                {viewingInvoice.status}
              </Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewingInvoice.items.map((it, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium text-neutral-900">{it.productName}</TableCell>
                    <TableCell className="font-mono">{it.quantity}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-neutral-900">{formatINR(it.total)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-neutral-50">
                  <TableCell colSpan={2}>Grand Total</TableCell>
                  <TableCell className="text-right font-mono font-bold text-neutral-950 text-sm">
                    {formatINR(viewingInvoice.grandTotal)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <Button size="sm" variant="outline" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5 mr-1" /> Print
              </Button>
              <Button size="sm" variant="outline" onClick={() => setViewingInvoice(null)}>
                Close
              </Button>
              {viewingInvoice.status !== 'Paid' && (
                <Button size="sm" variant="primary" onClick={() => handlePayNow(viewingInvoice)}>
                  Pay {formatINR(viewingInvoice.grandTotal)}
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
