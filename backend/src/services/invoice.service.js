import { prisma } from '../config/db.js'
import { createTransaction, markTransactionPaid } from './transaction.service.js'
import { httpError } from './journal.service.js'

export async function listInvoices(filters = {}) {
  const where = {
    type: 'SALE',
  }
  if (filters.contactId) {
    where.contactId = filters.contactId
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
    const dueDate = new Date(new Date(dateStr).getTime() + 14 * 86400000).toISOString().slice(0, 10)
    const subtotal = Math.round((amt / 1.18) * 100) / 100
    const tax = Math.round((amt - subtotal) * 100) / 100

    return {
      id: tx.reference,
      dbId: tx.id,
      orderId: `SO-2026-${String(idx + 1).padStart(3, '0')}`,
      contactId: tx.contactId,
      customerName: tx.contact?.name || 'Commercial Client',
      customerEmail: tx.contact?.email || '',
      customerAddress: 'Commercial Hub, Mumbai',
      date: dateStr,
      dueDate,
      items: [
        {
          productId: 'FUR-COMM',
          productName: `Commercial Furniture Specification (${tx.reference})`,
          quantity: 1,
          unitPrice: subtotal,
          taxRate: 18,
          total: amt,
        },
      ],
      subtotal,
      tax,
      discount: 0,
      grandTotal: amt,
      amountPaid: isPaid ? amt : 0,
      status: isPaid ? 'Paid' : 'Pending',
      paymentMethod: isPaid ? 'Bank Transfer' : 'Pending',
      notes: `Invoice ${tx.reference} for ${tx.contact?.name || 'Customer'}`,
      journalEntry: tx.journalEntry,
    }
  })
}

export async function createInvoice(data) {
  const { contactId, items, discount = 0, date, dueDate: _dueDate, reference, notes: _notes, grandTotal } = data

  if (!contactId) {
    throw httpError(400, 'Customer (contactId) is required')
  }

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
  })
  if (!contact) {
    throw httpError(404, 'Customer not found')
  }
  if (contact.type !== 'CUSTOMER') {
    throw httpError(400, 'Selected contact must be a CUSTOMER')
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw httpError(400, 'Invoice must contain at least one item row')
  }

  let subtotal = 0
  let totalTax = 0

  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    const qty = Number(it.quantity)
    if (isNaN(qty) || qty <= 0) {
      throw httpError(400, `Item #${i + 1}: Quantity must be greater than 0`)
    }
    const price = Number(it.unitPrice)
    if (isNaN(price) || price <= 0) {
      throw httpError(400, `Item #${i + 1}: Price must be greater than 0`)
    }
    const taxRate = Number(it.taxRate ?? 18)
    const lineTotal = qty * price
    const lineTax = lineTotal * (taxRate / 100)
    subtotal += lineTotal
    totalTax += lineTax
  }

  const numDiscount = Number(discount) || 0
  if (numDiscount < 0) {
    throw httpError(400, 'Discount cannot be negative')
  }

  const computedTotal = Math.round(subtotal + totalTax - numDiscount)
  const finalAmount = Number(grandTotal) > 0 ? Number(grandTotal) : computedTotal

  if (finalAmount <= 0) {
    throw httpError(400, 'Invoice total must be greater than 0')
  }

  const invoiceRef = reference?.trim() || `INV-${Math.floor(1000 + Math.random() * 9000)}`

  const tx = await createTransaction({
    type: 'SALE',
    reference: invoiceRef,
    contactId,
    amount: finalAmount,
    status: 'PENDING',
    transactionDate: date || new Date(),
  })

  return {
    id: tx.reference,
    dbId: tx.id,
    contactId,
    customerName: contact.name,
    customerEmail: contact.email,
    date: tx.transactionDate.toISOString().slice(0, 10),
    items,
    subtotal: Math.round(subtotal),
    tax: Math.round(totalTax),
    discount: numDiscount,
    grandTotal: finalAmount,
    amountPaid: 0,
    status: 'Pending',
    journalEntry: tx.journalEntry,
  }
}

export async function payInvoice(idOrRef, paymentData = {}) {
  return markTransactionPaid(idOrRef, paymentData)
}
