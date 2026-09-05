import { prisma } from '../config/db.js'
import { postJournalEntry, httpError } from './journal.service.js'

export async function listTransactions(filters = {}) {
  const where = {}
  if (filters.type) {
    where.type = filters.type.toUpperCase()
  }
  if (filters.status) {
    where.status = filters.status.toUpperCase()
  }
  if (filters.contactId) {
    where.contactId = filters.contactId
  }

  return prisma.transaction.findMany({
    where,
    orderBy: {
      transactionDate: 'desc',
    },
    include: {
      contact: true,
      journalEntry: {
        include: {
          items: true,
        },
      },
    },
  })
}

export async function getTransaction(idOrRef) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      OR: [{ id: idOrRef }, { reference: idOrRef }],
    },
    include: {
      contact: true,
      journalEntry: {
        include: {
          items: true,
        },
      },
    },
  })

  if (!transaction) {
    throw httpError(404, `Transaction "${idOrRef}" not found`)
  }

  return transaction
}

export async function createTransaction(data) {
  const { type, reference, contactId, amount, status, transactionDate } = data

  if (!type || !['SALE', 'PURCHASE'].includes(type.toUpperCase())) {
    throw httpError(400, 'Transaction type must be SALE or PURCHASE')
  }

  if (!contactId) {
    throw httpError(400, 'Contact ID is required')
  }

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
  })
  if (!contact) {
    throw httpError(404, 'Contact not found')
  }

  const numAmount = Number(amount)
  if (isNaN(numAmount) || numAmount <= 0) {
    throw httpError(400, 'Amount must be greater than 0')
  }

  const txStatus = status && ['PAID', 'PENDING'].includes(status.toUpperCase())
    ? status.toUpperCase()
    : 'PENDING'

  const txType = type.toUpperCase()
  const txDate = transactionDate ? new Date(transactionDate) : new Date()

  // Generate reference if not supplied
  const ref = reference?.trim() || `${txType === 'SALE' ? 'INV' : 'BILL'}-${Date.now().toString().slice(-6)}`

  // Check unique reference
  const existingTx = await prisma.transaction.findUnique({
    where: { reference: ref },
  })
  if (existingTx) {
    throw httpError(409, `Transaction reference "${ref}" already exists`)
  }

  // Create Transaction and its Balanced Journal Entry in one atomic operation
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        type: txType,
        reference: ref,
        contactId,
        amount: numAmount,
        status: txStatus,
        transactionDate: txDate,
      },
      include: {
        contact: true,
      },
    })

    // Construct balanced journal lines
    let lines = []
    const desc = `${txType === 'SALE' ? 'Sale to' : 'Purchase from'} ${contact.name} (${ref})`

    if (txType === 'SALE') {
      const debitAccount = txStatus === 'PAID' ? 'Cash' : 'Accounts Receivable'
      lines = [
        { accountName: debitAccount, debit: numAmount },
        { accountName: 'Sales Revenue', credit: numAmount },
      ]
    } else {
      const creditAccount = txStatus === 'PAID' ? 'Cash' : 'Accounts Payable'
      lines = [
        { accountName: 'Inventory', debit: numAmount },
        { accountName: creditAccount, credit: numAmount },
      ]
    }

    const { entry } = await postJournalEntry(
      {
        reference: `JE-${ref}`,
        description: desc,
        transactionDate: txDate,
        transactionId: transaction.id,
        lines,
      },
      tx,
    )

    return {
      ...transaction,
      journalEntry: entry,
    }
  })
}

/**
 * Marks an existing transaction as PAID and creates a balanced settlement JournalEntry.
 * SALE: Debit Cash, Credit Accounts Receivable
 * PURCHASE: Debit Accounts Payable, Credit Cash
 */
export async function markTransactionPaid(idOrRef, paymentDetails = {}) {
  const transaction = await getTransaction(idOrRef)

  if (transaction.status === 'PAID') {
    return {
      transaction,
      message: `Transaction ${transaction.reference} is already marked as PAID`,
    }
  }

  const numAmount = Number(paymentDetails.amount || transaction.amount)
  if (isNaN(numAmount) || numAmount <= 0) {
    throw httpError(400, 'Payment amount must be greater than 0')
  }

  if (numAmount > Number(transaction.amount)) {
    throw httpError(400, `Payment amount (₹${numAmount}) exceeds outstanding transaction amount (₹${transaction.amount})`)
  }

  const payDate = paymentDetails.date ? new Date(paymentDetails.date) : new Date()
  const payMethod = paymentDetails.method || 'Bank'
  const payRef = paymentDetails.reference || `PAY-${transaction.reference}-${Date.now().toString().slice(-4)}`

  return prisma.$transaction(async (tx) => {
    // 1. Update transaction status
    const updatedTx = await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'PAID',
      },
      include: {
        contact: true,
      },
    })

    // 2. Post balanced settlement journal entry
    let lines = []
    let desc = ''

    if (transaction.type === 'SALE') {
      desc = `Payment received from ${transaction.contact.name} for ${transaction.reference} (${payMethod})`
      lines = [
        { accountName: payMethod.toLowerCase().includes('cash') ? 'Cash' : 'Cash', debit: numAmount },
        { accountName: 'Accounts Receivable', credit: numAmount },
      ]
    } else {
      desc = `Payment disbursed to ${transaction.contact.name} for ${transaction.reference} (${payMethod})`
      lines = [
        { accountName: 'Accounts Payable', debit: numAmount },
        { accountName: payMethod.toLowerCase().includes('cash') ? 'Cash' : 'Cash', credit: numAmount },
      ]
    }

    const { entry } = await postJournalEntry(
      {
        reference: `JE-${payRef}`,
        description: desc,
        transactionDate: payDate,
        lines,
      },
      tx,
    )

    return {
      transaction: updatedTx,
      paymentJournalEntry: entry,
    }
  })
}

/**
 * Record a direct customer or vendor payment and post balanced settlement journal entry.
 */
export async function recordPayment(data) {
  const { type, contactId, amount, date, method, reference, invoiceBillId, notes } = data

  if (!contactId) {
    throw httpError(400, 'Contact party is required')
  }

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
  })
  if (!contact) {
    throw httpError(404, 'Contact not found')
  }

  const numAmount = Number(amount)
  if (isNaN(numAmount) || numAmount <= 0) {
    throw httpError(400, 'Payment amount must be greater than 0')
  }

  if (!method || typeof method !== 'string' || !method.trim()) {
    throw httpError(400, 'Payment method is required')
  }

  if (!reference || typeof reference !== 'string' || !reference.trim()) {
    throw httpError(400, 'Payment reference is required')
  }

  const cleanRef = reference.trim()
  const isCustomerPayment = type?.toLowerCase().includes('customer') || contact.type === 'CUSTOMER'
  const payDate = date ? new Date(date) : new Date()

  // If linked to an invoice or bill, update that transaction
  let targetTx = null
  if (invoiceBillId) {
    targetTx = await prisma.transaction.findFirst({
      where: {
        OR: [{ id: invoiceBillId }, { reference: invoiceBillId }],
      },
    })
    if (targetTx && numAmount > Number(targetTx.amount)) {
      throw httpError(400, `Payment amount (₹${numAmount}) exceeds document amount (₹${targetTx.amount})`)
    }
  }

  return prisma.$transaction(async (tx) => {
    if (targetTx && targetTx.status !== 'PAID') {
      await tx.transaction.update({
        where: { id: targetTx.id },
        data: { status: 'PAID' },
      })
    }

    let lines = []
    const desc = notes?.trim() || `${isCustomerPayment ? 'Customer payment received from' : 'Vendor payment to'} ${contact.name} (${cleanRef})`

    if (isCustomerPayment) {
      lines = [
        { accountName: 'Cash', debit: numAmount },
        { accountName: 'Accounts Receivable', credit: numAmount },
      ]
    } else {
      lines = [
        { accountName: 'Accounts Payable', debit: numAmount },
        { accountName: 'Cash', credit: numAmount },
      ]
    }

    const { entry } = await postJournalEntry(
      {
        reference: `JE-${cleanRef}`,
        description: desc,
        transactionDate: payDate,
        lines,
      },
      tx,
    )

    return {
      payment: {
        id: cleanRef,
        reference: cleanRef,
        date: payDate.toISOString().slice(0, 10),
        type: isCustomerPayment ? 'Customer Payment' : 'Vendor Payment',
        contactId,
        contactName: contact.name,
        amount: numAmount,
        method: method.trim(),
        status: 'Completed',
        notes: desc,
        invoiceBillId: targetTx?.reference || invoiceBillId || null,
      },
      journalEntry: entry,
    }
  })
}
