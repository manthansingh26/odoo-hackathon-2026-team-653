import { prisma } from '../config/db.js'
import { createTransaction } from './transaction.service.js'
import { httpError } from './journal.service.js'

export async function listSalesOrders(filters = {}) {
  const where = { type: 'SALE' }
  if (filters.contactId) where.contactId = filters.contactId

  const txs = await prisma.transaction.findMany({
    where,
    orderBy: { transactionDate: 'desc' },
    include: { contact: true },
  })

  return txs.map((tx, idx) => {
    const amt = Number(tx.amount || 0)
    const dateStr = tx.transactionDate ? tx.transactionDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
    const deliveryDate = new Date(new Date(dateStr).getTime() + 7 * 86400000).toISOString().slice(0, 10)
    const subtotal = Math.round((amt / 1.18) * 100) / 100
    const tax = Math.round((amt - subtotal) * 100) / 100

    return {
      id: `SO-2026-${String(idx + 1).padStart(3, '0')}`,
      date: dateStr,
      contactId: tx.contactId,
      customerName: tx.contact?.name || 'Commercial Client',
      expectedDelivery: deliveryDate,
      items: [
        {
          productId: 'FUR-COMM',
          productName: `Furniture Specification Order (${tx.reference})`,
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
      status: tx.status === 'PAID' ? 'Delivered' : 'Confirmed',
    }
  })
}

export async function createSalesOrder(data) {
  const { contactId, items, amount, date, reference } = data
  if (!contactId) throw httpError(400, 'Customer (contactId) is required')

  const contact = await prisma.contact.findUnique({ where: { id: contactId } })
  if (!contact) throw httpError(404, 'Customer not found')

  const numAmount = Number(amount || (items && items.reduce((s, it) => s + (it.quantity * it.unitPrice), 0)) || 0)
  if (numAmount <= 0) throw httpError(400, 'Order amount must be greater than 0')

  const ref = reference?.trim() || `SO-${Math.floor(1000 + Math.random() * 9000)}`

  const tx = await createTransaction({
    type: 'SALE',
    reference: ref,
    contactId,
    amount: numAmount,
    status: 'PENDING',
    transactionDate: date || new Date(),
  })

  return {
    id: tx.reference,
    dbId: tx.id,
    contactId,
    customerName: contact.name,
    date: tx.transactionDate.toISOString().slice(0, 10),
    items: items || [],
    grandTotal: numAmount,
    status: 'Confirmed',
  }
}

export async function listPurchaseOrders(filters = {}) {
  const where = { type: 'PURCHASE' }
  if (filters.contactId || filters.vendorId) where.contactId = filters.contactId || filters.vendorId

  const txs = await prisma.transaction.findMany({
    where,
    orderBy: { transactionDate: 'desc' },
    include: { contact: true },
  })

  return txs.map((tx, idx) => {
    const amt = Number(tx.amount || 0)
    const dateStr = tx.transactionDate ? tx.transactionDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
    const expectedDate = new Date(new Date(dateStr).getTime() + 10 * 86400000).toISOString().slice(0, 10)

    return {
      id: `PO-2026-${String(idx + 1).padStart(3, '0')}`,
      date: dateStr,
      vendorId: tx.contactId,
      vendorName: tx.contact?.name || 'Raw Material Supplier',
      expectedDate,
      items: [
        {
          productId: 'MAT-RAW',
          productName: `Raw Materials & Hardware Consignment (${tx.reference})`,
          quantity: 1,
          unitPrice: amt,
          total: amt,
        },
      ],
      totalAmount: amt,
      status: tx.status === 'PAID' ? 'Received' : 'Confirmed',
    }
  })
}

export async function createPurchaseOrder(data) {
  const { vendorId, contactId, items, amount, date, reference } = data
  const finalVendorId = vendorId || contactId
  if (!finalVendorId) throw httpError(400, 'Vendor (contactId) is required')

  const vendor = await prisma.contact.findUnique({ where: { id: finalVendorId } })
  if (!vendor) throw httpError(404, 'Vendor not found')

  const numAmount = Number(amount || (items && items.reduce((s, it) => s + (it.quantity * it.unitPrice), 0)) || 0)
  if (numAmount <= 0) throw httpError(400, 'Order amount must be greater than 0')

  const ref = reference?.trim() || `PO-${Math.floor(1000 + Math.random() * 9000)}`

  const tx = await createTransaction({
    type: 'PURCHASE',
    reference: ref,
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
    date: tx.transactionDate.toISOString().slice(0, 10),
    items: items || [],
    totalAmount: numAmount,
    status: 'Confirmed',
  }
}
