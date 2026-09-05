// Seed script — fills the database with realistic demo data.
// Run with: npm run seed  (wired as "prisma": {"seed": ...} in package.json)
// Safe to re-run: clears the demo tables first (idempotent), then
// inserts a fresh, consistent dataset. users table is untouched.

import { PrismaClient, ContactType, TransactionType, TransactionStatus } from '@prisma/client'

const prisma = new PrismaClient()

// Reuses the same postJournalEntry() rules the API enforces, so seeded
// data obeys the identical balanced-entry invariant.
import { postJournalEntry } from '../src/services/journal.service.js'

async function main() {
  console.log('Seeding demo data…')

  // --- Clear in FK-safe order (demo data only; users table untouched) ---
  await prisma.journalItem.deleteMany()
  await prisma.journalEntry.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.product.deleteMany()
  await prisma.contact.deleteMany()

  // --- Contacts ---
  const [royal, urban, classic, modern] = await Promise.all([
    prisma.contact.create({ data: { name: 'Royal Furniture Store', type: ContactType.CUSTOMER, email: 'royal@example.com', phone: '+91 98200 11111' } }),
    prisma.contact.create({ data: { name: 'Urban Living Interiors', type: ContactType.CUSTOMER, email: 'urban@example.com', phone: '+91 98200 22222' } }),
    prisma.contact.create({ data: { name: 'Classic Wood Suppliers', type: ContactType.VENDOR, email: 'classic@example.com', phone: '+91 98200 33333' } }),
    prisma.contact.create({ data: { name: 'Modern Home Decor', type: ContactType.VENDOR, email: 'modern@example.com', phone: '+91 98200 44444' } }),
  ])
  console.log('  contacts: 4')

  // --- Products ---
  await prisma.product.createMany({
    data: [
      { name: 'Wooden Dining Table', sku: 'FUR-DIN-001', price: 24999.0, stock: 12 },
      { name: 'Office Chair', sku: 'FUR-CHR-002', price: 6499.0, stock: 40 },
      { name: 'Modular Sofa', sku: 'FUR-SOF-003', price: 45999.0, stock: 8 },
      { name: 'Bookshelf', sku: 'FUR-BKS-004', price: 8999.0, stock: 25 },
      { name: 'King Size Bed', sku: 'FUR-BED-005', price: 32999.0, stock: 10 },
    ],
  })
  console.log('  products: 5')

  // --- Transactions + balanced journal entries ---
  // Sales:   debit Cash / Accounts Receivable, credit Sales Revenue.
  // Purchase: debit Inventory, credit Cash / Accounts Payable.
  const demoTransactions = [
    { type: TransactionType.SALE, reference: 'INV-2026-001', contactId: royal.id, amount: 74997.0, status: TransactionStatus.PAID, date: new Date('2026-08-28'),
      desc: 'Sale to Royal Furniture Store', lines: [{ accountName: 'Cash', debit: 74997 }, { accountName: 'Sales Revenue', credit: 74997 }] },
    { type: TransactionType.SALE, reference: 'INV-2026-002', contactId: urban.id, amount: 45999.0, status: TransactionStatus.PENDING, date: new Date('2026-09-01'),
      desc: 'Sale to Urban Living Interiors', lines: [{ accountName: 'Accounts Receivable', debit: 45999 }, { accountName: 'Sales Revenue', credit: 45999 }] },
    { type: TransactionType.PURCHASE, reference: 'BILL-2026-001', contactId: classic.id, amount: 51200.0, status: TransactionStatus.PENDING, date: new Date('2026-09-02'),
      desc: 'Lumber & materials from Classic Wood Suppliers', lines: [{ accountName: 'Inventory', debit: 51200 }, { accountName: 'Accounts Payable', credit: 51200 }] },
    { type: TransactionType.PURCHASE, reference: 'BILL-2026-002', contactId: modern.id, amount: 18400.0, status: TransactionStatus.PAID, date: new Date('2026-09-03'),
      desc: 'Decor stock from Modern Home Decor', lines: [{ accountName: 'Inventory', debit: 18400 }, { accountName: 'Cash', credit: 18400 }] },
    { type: TransactionType.SALE, reference: 'INV-2026-003', contactId: royal.id, amount: 32999.0, status: TransactionStatus.PAID, date: new Date('2026-09-04'),
      desc: 'King beds for Royal Furniture Store', lines: [{ accountName: 'Cash', debit: 32999 }, { accountName: 'Sales Revenue', credit: 32999 }] },
  ]

  let txCount = 0
  for (const t of demoTransactions) {
    await prisma.$transaction(async (tx) => {
      const record = await tx.transaction.create({
        data: {
          type: t.type,
          reference: t.reference,
          contactId: t.contactId,
          amount: t.amount,
          status: t.status,
          transactionDate: t.date,
        },
      })
      // Every seeded transaction gets a balanced journal entry via the
      // shared service — same rule the API enforces.
      await postJournalEntry(
        {
          reference: `JE-${t.reference}`,
          description: t.desc,
          transactionDate: t.date,
          transactionId: record.id,
          lines: t.lines,
        },
        tx,
      )
    })
    txCount++
  }
  console.log(`  transactions: ${txCount} (each with a balanced journal entry)`)

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
