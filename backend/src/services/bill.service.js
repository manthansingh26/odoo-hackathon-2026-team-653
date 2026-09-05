import { prisma } from '../config/db.js'
import { createTransaction, markTransactionPaid } from './transaction.service.js'
import { httpError } from './journal.service.js'

export async function listBills(filters = {}) {
  const where = {
    type: 'PURCHASE',
  }
  if (filters.contactId || filters.vendorId) {
    where.contactId = filters.contactId || filters.vendorId
  }
  if (filters.status) {
    where.status = filters.status.toUpperCase()
  }

  const txs = await prisma.transaction.findMany({
    where,
    orderBy: { transactionDate: 'desc' },
    include: {
      contact: true,
      journalEntry: {
        include: { items: true },
      },
    },
  })

  return txs.map((tx, idx) => {
    const amt = Number(tx.amount || 0)
    const isPaid = tx.status === 'PAID'
    const dateStr = tx.transactionDate ? tx.transactionDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
    const dueDate = new Date(new Date(dateStr).getTime() + 30 * 86400000).toISOString().slice(0, 10)

    return {
      id: tx.reference,
      dbId: tx.id,
      poReference: `PO-2026-${String(idx + 1).padStart(3, '0')}`,
      vendorId: tx.contactId,
      vendorName: tx.contact?.name || 'Raw Material Supplier',
      vendorInvoiceNumber: `VN-${String(idx + 1001)}`,
      date: dateStr,
      dueDate,
      items: [
        {
          description: `Procurement Consignment (${tx.reference})`,
          quantity: 1,
          unitPrice: amt,
          total: amt,
        },
      ],
      subtotal: amt,
      tax: 0,
      total: amt,
      amountPaid: isPaid ? amt : 0,
      status: isPaid ? 'Paid' : 'Pending',
      journalEntry: tx.journalEntry,
    }
  })
}

export async function createBill(data) {
  const { vendorId, contactId, amount, date, dueDate: _dueDate, vendorInvNo, description, reference } = data
  const finalVendorId = vendorId || contactId

  if (!finalVendorId) {
    throw httpError(400, 'Vendor (contactId) is required')
  }

  const vendor = await prisma.contact.findUnique({
    where: { id: finalVendorId },
  })
  if (!vendor) {
    throw httpError(404, 'Vendor not found')
  }
  if (vendor.type !== 'VENDOR') {
    throw httpError(400, 'Selected contact must be a VENDOR')
  }

  const numAmount = Number(amount)
  if (isNaN(numAmount) || numAmount <= 0) {
    throw httpError(400, 'Bill amount must be greater than 0')
  }

  if (vendorInvNo !== undefined && typeof vendorInvNo === 'string' && !vendorInvNo.trim()) {
    throw httpError(400, 'Vendor invoice number cannot be empty')
  }

  const billRef = reference?.trim() || `BILL-${Math.floor(1000 + Math.random() * 9000)}`

  const tx = await createTransaction({
    type: 'PURCHASE',
    reference: billRef,
    contactId: finalVendorId,
    amount: numAmount,
    status: 'PENDING',
    transactionDate: date || new Date(),
  })

  return {
    id: tx.reference,
    dbId: tx.id,
    vendorId: finalVendorId,
    vendorName: vendor.name,
    vendorInvoiceNumber: vendorInvNo || `VN-${Date.now().toString().slice(-4)}`,
    date: tx.transactionDate.toISOString().slice(0, 10),
    items: [
      {
        description: description?.trim() || `Procurement Consignment (${tx.reference})`,
        quantity: 1,
        unitPrice: numAmount,
        total: numAmount,
      },
    ],
    subtotal: numAmount,
    tax: 0,
    total: numAmount,
    amountPaid: 0,
    status: 'Pending',
    journalEntry: tx.journalEntry,
  }
}

export async function payBill(idOrRef, paymentData = {}) {
  return markTransactionPaid(idOrRef, paymentData)
}
