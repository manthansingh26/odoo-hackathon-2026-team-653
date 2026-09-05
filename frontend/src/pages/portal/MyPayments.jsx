import React from 'react';
import { CreditCard } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export const MyPayments = () => {
  const { data, activeContactId, formatINR } = useAppContext();

  const activeContact = (data.contacts || []).find(c => c.id === activeContactId);
  const activeContactName = (activeContact?.name || '').toLowerCase();

  const myPayments = (data.payments || []).filter(p => {
    if (p.contactId && p.contactId === activeContactId) return true;
    if (activeContactName && (p.contactName || '').toLowerCase().includes(activeContactName)) return true;
    return false;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-950">My Payment History</h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Receipts and clearance references for all electronic transfers and UPI payments.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt ID</TableHead>
              <TableHead>Transaction Date</TableHead>
              <TableHead>Banking UTR Reference</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Amount Paid (₹)</TableHead>
              <TableHead>Clearance Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myPayments.length > 0 ? (
              myPayments.map((pay) => (
                <TableRow key={pay.id}>
                  <TableCell className="font-mono font-bold text-xs text-neutral-950">{pay.id}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{pay.date}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-800">{pay.reference}</TableCell>
                  <TableCell className="text-xs text-neutral-600">{pay.method}</TableCell>
                  <TableCell className="font-mono font-bold text-neutral-950">{formatINR(pay.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="paid">{pay.status || 'Cleared'}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-neutral-400">
                  No payment records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
