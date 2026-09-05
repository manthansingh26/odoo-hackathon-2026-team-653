import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Printer,
  Download,
  Share2,
  CheckCircle,
  Eye,
  CreditCard,
  Building2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';

export const Invoices = () => {
  const { data, updateRecord, setActiveModal, formatINR, addToast } = useAppContext();

  const [activeInvoice, setActiveInvoice] = useState(null);

  const handleMarkPaid = (inv) => {
    updateRecord('invoices', inv.id, {
      status: 'Paid',
      amountPaid: inv.grandTotal,
      paymentMethod: 'Bank Direct'
    });
    if (activeInvoice && activeInvoice.id === inv.id) {
      setActiveInvoice(prev => ({
        ...prev,
        status: 'Paid',
        amountPaid: inv.grandTotal,
        paymentMethod: 'Bank Direct'
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = (inv) => {
    addToast({
      title: "PDF Generated",
      message: `Invoice #${inv.id} prepared for print download.`,
      type: "success"
    });
    window.print();
  };

  const handleShare = (inv) => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      title: "Link Copied",
      message: `Invoice #${inv.id} direct link copied to clipboard.`,
      type: "info"
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">Customer Invoices</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            GST compliant sales tax invoices and receivables tracking.
          </p>
        </div>
        <Button
          onClick={() => setActiveModal({ type: 'NEW_INVOICE' })}
          size="sm"
          variant="primary"
          className="shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Invoice
        </Button>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.invoices && data.invoices.length > 0 ? (
              data.invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono font-bold text-xs text-neutral-950">
                    {inv.id}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{inv.date}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{inv.dueDate}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-neutral-900 text-sm">{inv.customerName}</div>
                    <div className="text-[11px] text-neutral-400 font-mono">{inv.orderId}</div>
                  </TableCell>
                  <TableCell className="font-mono font-bold text-neutral-950">
                    {formatINR(inv.grandTotal)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={inv.status === 'Paid' ? 'paid' : inv.status === 'Pending' ? 'pending' : 'overdue'}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setActiveInvoice(inv)}
                        title="View and print invoice"
                      >
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </Button>
                      {inv.status !== 'Paid' && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleMarkPaid(inv)}
                          title="Mark as paid"
                          className="text-xs text-[#2e7d32] border-[#c8e6c9] hover:bg-[#e8f5e9]"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-neutral-400">
                  No invoices issued.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Professional Customer Invoice Detail View & Print Modal (Section 15) */}
      {activeInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setActiveInvoice(null)}
          title={`Tax Invoice: ${activeInvoice.id}`}
          subtitle="Print-ready tax invoice preview"
          maxWidth="max-w-3xl"
        >
          {/* Action buttons (Print, Download PDF, Share, Mark Paid) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-neutral-200 no-print">
            <div className="flex items-center gap-2">
              <Badge variant={activeInvoice.status === 'Paid' ? 'paid' : 'pending'} className="text-xs">
                Status: {activeInvoice.status}
              </Badge>
              {activeInvoice.status !== 'Paid' && (
                <Button size="xs" variant="profit" onClick={() => handleMarkPaid(activeInvoice)}>
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark Paid
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handlePrint} className="gap-1.5 text-xs">
                <Printer className="w-3.5 h-3.5" />
                Print Invoice
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(activeInvoice)} className="gap-1.5 text-xs">
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleShare(activeInvoice)} className="gap-1.5 text-xs">
                <Share2 className="w-3.5 h-3.5" />
                Share
              </Button>
            </div>
          </div>

          {/* Printable Invoice Document Body */}
          <div className="p-6 bg-white border border-neutral-200 rounded-lg shadow-2xs text-xs space-y-6">
            {/* Header branding */}
            <div className="flex items-start justify-between border-b border-neutral-900 pb-5">
              <div>
                <h1 className="text-2xl font-black font-mono tracking-widest text-neutral-950 uppercase">
                  URBAN FURNITURE
                </h1>
                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mt-0.5">
                  TAX INVOICE / CASH MEMORANDUM
                </p>
                <div className="text-[11px] text-neutral-500 mt-2 space-y-0.5">
                  <p>{data.company.address}</p>
                  <p>GSTIN: <span className="font-mono font-bold text-neutral-800">{data.company.gstin}</span> | PAN: {data.company.pan}</p>
                  <p>Contact: {data.company.phone} | {data.company.email}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block bg-neutral-950 text-white font-mono font-bold px-3 py-1 rounded-sm text-sm">
                  {activeInvoice.id}
                </div>
                <div className="mt-2 text-neutral-600 space-y-1">
                  <div>Invoice Date: <span className="font-semibold text-neutral-900 font-mono">{activeInvoice.date}</span></div>
                  <div>Due Date: <span className="font-semibold text-neutral-900 font-mono">{activeInvoice.dueDate}</span></div>
                  <div>PO / Order: <span className="font-mono text-neutral-800">{activeInvoice.orderId || 'Direct'}</span></div>
                </div>
              </div>
            </div>

            {/* Bill To Customer details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-md border border-neutral-200">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">
                  Billed To (Client):
                </span>
                <div className="text-sm font-bold text-neutral-950">{activeInvoice.customerName}</div>
                <div className="text-neutral-600 mt-1 space-y-0.5">
                  <p>{activeInvoice.customerAddress || 'Client site address'}</p>
                  <p>{activeInvoice.customerEmail}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">
                  Payment Status:
                </span>
                <div className="text-sm font-bold font-mono">
                  {activeInvoice.status === 'Paid' ? (
                    <span className="text-[#2e7d32]">PAID IN FULL</span>
                  ) : (
                    <span className="text-amber-700">PENDING BALANCE DUE</span>
                  )}
                </div>
                <p className="text-neutral-500 mt-1">Payment Method: {activeInvoice.paymentMethod || 'NEFT / RTGS'}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-neutral-900 bg-neutral-100">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Item / Product Description</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">GST %</TableHead>
                  <TableHead className="text-right">Total (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeInvoice.items && activeInvoice.items.length > 0 ? (
                  activeInvoice.items.map((it, idx) => (
                    <TableRow key={idx} className="border-b border-neutral-200">
                      <TableCell className="text-neutral-400 font-mono">{idx + 1}</TableCell>
                      <TableCell className="font-semibold text-neutral-900">{it.productName}</TableCell>
                      <TableCell className="text-center font-mono">{it.quantity}</TableCell>
                      <TableCell className="text-right font-mono">{formatINR(it.unitPrice)}</TableCell>
                      <TableCell className="text-right font-mono">{it.taxRate}%</TableCell>
                      <TableCell className="text-right font-mono font-bold text-neutral-900">
                        {formatINR(it.total)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-neutral-400">
                      No items specified.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Bottom summary and bank coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Bank Account Wire Details</span>
                <p className="font-semibold text-neutral-900">{data.company.bank}</p>
                <p>Account No: <span className="font-mono font-bold text-neutral-950">{data.company.accountNo}</span></p>
                <p>IFSC: <span className="font-mono font-bold text-neutral-950">{data.company.ifsc}</span></p>
                <p className="text-[10px] text-neutral-400 mt-2">Notes: {activeInvoice.notes}</p>
              </div>

              <div className="space-y-1 text-right text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span className="text-neutral-500">Subtotal:</span>
                  <span className="font-mono font-semibold">{formatINR(activeInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span className="text-neutral-500">Output GST:</span>
                  <span className="font-mono font-semibold">{formatINR(activeInvoice.tax)}</span>
                </div>
                {activeInvoice.discount > 0 && (
                  <div className="flex justify-between py-1 border-b border-neutral-200 text-red-600">
                    <span>Discount:</span>
                    <span className="font-mono font-semibold">-{formatINR(activeInvoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b-2 border-neutral-900 text-base font-bold text-neutral-950">
                  <span>Grand Total:</span>
                  <span className="font-mono text-lg">{formatINR(activeInvoice.grandTotal)}</span>
                </div>
                <div className="flex justify-between py-1 text-neutral-600 text-[11px]">
                  <span>Amount Paid:</span>
                  <span className="font-mono">{formatINR(activeInvoice.amountPaid || 0)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-neutral-900 text-xs">
                  <span>Balance Due:</span>
                  <span className="font-mono text-sm">
                    {formatINR(Math.max(0, activeInvoice.grandTotal - (activeInvoice.amountPaid || 0)))}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature authorization */}
            <div className="pt-8 border-t border-neutral-200 flex justify-between items-end">
              <div className="text-[10px] text-neutral-400">
                This is an electronically generated tax invoice under Urban Furniture ERP.
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-neutral-950">For Urban Furniture Pvt. Ltd.</div>
                <div className="h-10"></div>
                <div className="text-[10px] text-neutral-500 border-t border-neutral-300 pt-1">Authorized Signatory</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
