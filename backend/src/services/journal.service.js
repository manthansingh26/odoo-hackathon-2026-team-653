// Journal service — THE accounting engine.
//
// RULE: every financial transaction produces a balanced journal entry
// (total debit === total credit). All flows — seed data, payments,
// bills, invoices — go through postJournalEntry(). No controller may
// create journal entries directly.
import { prisma } from '../config/db.js'

/**
 * Create a journal entry with its items inside one DB transaction.
 *
 * @param {Object} input
 * @param {string} input.reference         Unique reference, e.g. "JE-INV-2026-001"
 * @param {string} input.description       Human-readable explanation
 * @param {Date}   [input.transactionDate] Defaults to now
 * @param {string} [input.transactionId]   Optional link to a Transaction
 * @param {Array<{accountName: string, debit?: number|string, credit?: number|string}>} input.lines
 *        Each line touches exactly one side (debit OR credit).
 * @param {Prisma.TransactionClient} [tx] Optional outer Prisma transaction client,
 *        so the business document and its journal entry commit or roll back
 *        together.
 * @returns {Promise<{entry: object, totalDebit: number, totalCredit: number}>}
 */
export async function postJournalEntry(input, tx) {
  const db = tx ?? prisma

  const { reference, description, transactionDate, transactionId } = input
  const lines = input.lines ?? []

  // --- Validation: the accounting invariant ---
  if (!reference?.trim()) throw httpError(400, 'Journal entry reference is required')
  if (!description?.trim()) throw httpError(400, 'Journal entry description is required')
  if (lines.length < 2) {
    throw httpError(400, 'A journal entry needs at least two lines (a debit and a credit)')
  }

  const round2 = (n) => Math.round(Number(n) * 100) / 100

  const cleanLines = lines.map((l) => {
    const debit = round2(l.debit ?? 0)
    const credit = round2(l.credit ?? 0)
    if (!l.accountName?.trim()) throw httpError(400, 'Every journal line needs an accountName')
    if (debit < 0 || credit < 0) throw httpError(400, 'Debit/credit amounts cannot be negative')
    if (debit > 0 && credit > 0) {
      throw httpError(400, `Line "${l.accountName}" cannot have both debit and credit`)
    }
    if (debit === 0 && credit === 0) {
      throw httpError(400, `Line "${l.accountName}" must have a debit or a credit amount`)
    }
    return { accountName: l.accountName.trim(), debit, credit }
  })

  const totalDebit = round2(cleanLines.reduce((s, l) => s + l.debit, 0))
  const totalCredit = round2(cleanLines.reduce((s, l) => s + l.credit, 0))

  if (totalDebit !== totalCredit) {
    throw httpError(400, `Unbalanced entry rejected: debit ${totalDebit} != credit ${totalCredit}`)
  }

  // --- Create entry + items atomically ---
  const entry = await db.journalEntry.create({
    data: {
      reference: reference.trim(),
      description: description.trim(),
      transactionDate: transactionDate ?? new Date(),
      transactionId: transactionId ?? null,
      items: { create: cleanLines },
    },
    include: { items: true },
  })

  return { entry, totalDebit, totalCredit }
}

/** Fetch entries with items, newest first, including balance totals. */
export async function listJournalEntries() {
  const entries = await prisma.journalEntry.findMany({
    orderBy: { transactionDate: 'desc' },
    include: { items: true, transaction: { select: { reference: true, type: true } } },
  })
  return entries.map((e) => {
    const totalDebit = e.items.reduce((s, i) => s + Number(i.debit), 0)
    const totalCredit = e.items.reduce((s, i) => s + Number(i.credit), 0)
    return {
      ...e,
      totalDebit,
      totalCredit,
      balanced: Math.round(totalDebit * 100) === Math.round(totalCredit * 100),
    }
  })
}

/** Small helper: create an Error with an HTTP status attached. */
export function httpError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}
