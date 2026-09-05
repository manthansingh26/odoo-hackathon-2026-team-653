import { prisma } from '../config/db.js'
import { recordPayment as createDirectPayment } from './transaction.service.js'

export async function listPayments(filters = {}) {
  const where = {
    status: 'PAID',
  }
  if (filters.contactId) {
    where.contactId = filters.contactId
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
    const isSale = tx.type === 'SALE'
    const dateStr = tx.transactionDate ? tx.transactionDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)

    return {
      id: `PAY-2026-${String(idx + 1).padStart(3, '0')}`,
      date: dateStr,
      reference: `NEFT-HDFC-${Math.floor(100000 + (idx * 37) % 900000)}`,
      type: isSale ? 'Customer Payment' : 'Vendor Payment',
      contactId: tx.contactId,
      contactName: tx.contact?.name || 'Contact',
      invoiceBillId: tx.reference,
      method: 'Bank Transfer',
      amount: amt,
      status: 'Completed',
      notes: `Settlement for ${tx.reference}`,
      journalEntry: tx.journalEntry,
    }
  })
}

export async function recordPayment(data) {
  return createDirectPayment(data)
}
