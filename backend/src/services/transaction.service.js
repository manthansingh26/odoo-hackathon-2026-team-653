import { prisma } from '../config/db.js'
import { postJournalEntry, httpError } from './journal.service.js'

export async function listTransactions() {
  return prisma.transaction.findMany({
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
