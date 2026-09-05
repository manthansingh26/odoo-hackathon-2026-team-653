import React, { useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';

export const MyBills = () => {
  const { data, activeContactId, formatINR } = useAppContext();
  const [viewingBill, setViewingBill] = useState(null);

  // Filter bills belonging to this active partner
  const activeContact = (data.contacts || []).find(c => c.id === activeContactId);
  const activeContactName = (activeContact?.name || '').toLowerCase();

  const myBills = (data.bills || []).filter(b => {
    if (b.vendorId && b.vendorId === activeContactId) return true;
    if (activeContactName && (b.vendorName || '').toLowerCase().includes(activeContactName)) return true;
    return false;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-950">My Bills & Supplier Statements</h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Invoices and purchase bills submitted to Urban Furniture for material supplies and services.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill Ref</TableHead>
              <TableHead>Vendor Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Total (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myBills.length > 0 ? (
              myBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-mono font-bold text-xs text-neutral-950">{bill.id}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{bill.vendorInvoiceNumber}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{bill.date}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{bill.dueDate}</TableCell>
                  <TableCell className="font-mono font-bold text-neutral-950">{formatINR(bill.total)}</TableCell>
                  <TableCell>
                    <Badge variant={bill.status === 'Paid' ? 'paid' : 'pending'}>{bill.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => setViewingBill(bill)} title="View bill">
                      <Eye className="w-4 h-4 text-neutral-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-neutral-400">
                  No vendor bills registered for your profile.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {viewingBill && (
        <Modal
          isOpen={true}
          onClose={() => setViewingBill(null)}
          title={`Bill Record: ${viewingBill.id}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200 space-y-1">
              <div>Invoice No: <span className="font-mono font-bold">{viewingBill.vendorInvoiceNumber}</span></div>
              <div>Issue Date: {viewingBill.date}</div>
              <div>Due Date: {viewingBill.dueDate}</div>
              <div className="font-bold text-sm text-neutral-950 pt-2 border-t border-neutral-200">
                Amount: {formatINR(viewingBill.total)}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setViewingBill(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
