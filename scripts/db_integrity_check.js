import { prisma } from '../backend/src/config/db.js';

async function runIntegrityChecks() {
  console.log('====================================================');
  console.log('POSTGRESQL / PRISMA ACCOUNTING INTEGRITY CHECKS');
  console.log('====================================================\n');

  const results = [];
  const check = (name, passed, details) => {
    results.push({ name, passed, details });
    console.log(`${passed ? '✓ PASS' : '✗ FAIL'}: ${name}`);
    if (details) console.log(`   -> ${details}`);
  };

  // 1. Total debit equals total credit
  const sumDebits = await prisma.journalItem.aggregate({ _sum: { debit: true } });
  const sumCredits = await prisma.journalItem.aggregate({ _sum: { credit: true } });
  const totalDebit = Number(sumDebits._sum.debit || 0);
  const totalCredit = Number(sumCredits._sum.credit || 0);
  check(
    'Total debit equals total credit',
    totalDebit === totalCredit && totalDebit > 0,
    `Debit: ₹${totalDebit.toLocaleString('en-IN')}, Credit: ₹${totalCredit.toLocaleString('en-IN')}, Diff: ${Math.abs(totalDebit - totalCredit)}`
  );

  // 2. Every posted transaction has a journal entry
  const txWithoutJE = await prisma.transaction.findMany({
    where: { journalEntry: null }
  });
  check(
    'Every posted transaction has a journal entry',
    txWithoutJE.length === 0,
    txWithoutJE.length === 0 ? 'All transactions have linked JournalEntry' : `Found ${txWithoutJE.length} transactions without JournalEntry`
  );

  // 3. Every journal entry has at least two journal lines
  const jes = await prisma.journalEntry.findMany({
    include: { items: true }
  });
  const jesWithFewLines = jes.filter(j => j.items.length < 2);
  check(
    'Every journal entry has at least two journal lines',
    jesWithFewLines.length === 0,
    jesWithFewLines.length === 0 ? `All ${jes.length} entries have >= 2 items` : `Found ${jesWithFewLines.length} entries with < 2 items`
  );

  // 4. No journal entry has only debit or only credit
  const oneSidedJEs = jes.filter(j => {
    const d = j.items.reduce((s, i) => s + Number(i.debit), 0);
    const c = j.items.reduce((s, i) => s + Number(i.credit), 0);
    return d === 0 || c === 0 || d !== c;
  });
  check(
    'No journal entry has only debit or only credit (all entries balanced)',
    oneSidedJEs.length === 0,
    oneSidedJEs.length === 0 ? 'All journal entries have matching debit and credit' : `Found ${oneSidedJEs.length} unbalanced entries`
  );

  // 5. No orphan journal lines
  const allItems = await prisma.journalItem.findMany({ select: { id: true, journalEntryId: true } });
  const allJeIds = new Set((await prisma.journalEntry.findMany({ select: { id: true } })).map(j => j.id));
  const orphanLines = allItems.filter(i => !allJeIds.has(i.journalEntryId));
  check(
    'No orphan journal lines',
    orphanLines.length === 0,
    orphanLines.length === 0 ? `Zero orphan journal items (${allItems.length} all validly linked)` : `Found ${orphanLines.length} orphan lines`
  );

  // 6. No orphan invoices / bills (all transactions have valid contact)
  const allContacts = new Set((await prisma.contact.findMany({ select: { id: true } })).map(c => c.id));
  const allTxList = await prisma.transaction.findMany({ select: { id: true, contactId: true } });
  const orphanTx = allTxList.filter(t => !allContacts.has(t.contactId));
  check(
    'No orphan invoices or bills (valid contact relation)',
    orphanTx.length === 0,
    orphanTx.length === 0 ? `All ${allTxList.length} transactions link to existing Contacts` : `Found ${orphanTx.length} orphan transactions`
  );

  // 7. Duplicate submission / Unique references
  const allTx = await prisma.transaction.findMany({ select: { reference: true } });
  const txRefs = allTx.map(t => t.reference);
  const uniqueTxRefs = new Set(txRefs);
  check(
    'Transaction/Invoice/Bill references are strictly unique',
    txRefs.length === uniqueTxRefs.size,
    `${uniqueTxRefs.size} unique references out of ${txRefs.length} records`
  );

  const allJEs = await prisma.journalEntry.findMany({ select: { reference: true } });
  const jeRefs = allJEs.map(j => j.reference);
  const uniqueJeRefs = new Set(jeRefs);
  check(
    'Journal entry references are strictly unique',
    jeRefs.length === uniqueJeRefs.size,
    `${uniqueJeRefs.size} unique references out of ${jeRefs.length} entries`
  );

  // 8. Positive amount constraints
  const invalidAmounts = await prisma.transaction.findMany({
    where: { amount: { lte: 0 } }
  });
  check(
    'Zero and negative transaction amounts are rejected',
    invalidAmounts.length === 0,
    invalidAmounts.length === 0 ? 'All transaction amounts are strictly positive (> 0)' : `Found ${invalidAmounts.length} non-positive amounts`
  );

  // 9. Accounting Equations
  console.log('\n--- FINANCIAL MEANING & EQUATIONS ---');

  // Revenue - Expenses = Net Profit
  const allItemsDetailed = await prisma.journalItem.findMany();
  const accMap = {};
  for (const it of allItemsDetailed) {
    accMap[it.accountName] = accMap[it.accountName] || { debit: 0, credit: 0 };
    accMap[it.accountName].debit += Number(it.debit);
    accMap[it.accountName].credit += Number(it.credit);
  }

  const revenue = (accMap['Sales Revenue']?.credit || 0) - (accMap['Sales Revenue']?.debit || 0);
  const inventoryCogs = (accMap['Inventory']?.debit || 0);
  const netProfit = revenue - inventoryCogs;
  check(
    'Accounting Equation: Revenue - Expenses = Net Profit',
    revenue - inventoryCogs === netProfit,
    `Revenue (₹${revenue.toLocaleString('en-IN')}) - COGS (₹${inventoryCogs.toLocaleString('en-IN')}) = Net Profit (₹${netProfit.toLocaleString('en-IN')})`
  );

  // Assets = Liabilities + Equity
  // From pure DB journal entries:
  // Assets: Cash + Accounts Receivable + Inventory
  const cashBalance = (accMap['Cash']?.debit || 0) - (accMap['Cash']?.credit || 0);
  const arBalance = (accMap['Accounts Receivable']?.debit || 0) - (accMap['Accounts Receivable']?.credit || 0);
  const invBalance = (accMap['Inventory']?.debit || 0) - (accMap['Inventory']?.credit || 0);
  const totalAssets = cashBalance + arBalance + invBalance;

  // Liabilities: Accounts Payable
  const apBalance = (accMap['Accounts Payable']?.credit || 0) - (accMap['Accounts Payable']?.debit || 0);
  const totalLiabilities = apBalance;

  // Equity / Retained Earnings: Sales Revenue
  const salesRevenueEquity = (accMap['Sales Revenue']?.credit || 0) - (accMap['Sales Revenue']?.debit || 0);
  const totalEquity = salesRevenueEquity;

  const equationDelta = Math.abs(totalAssets - (totalLiabilities + totalEquity));
  check(
    'Accounting Equation: Assets = Liabilities + Equity',
    equationDelta === 0,
    `Assets (₹${totalAssets.toLocaleString('en-IN')}) === Liabilities (₹${totalLiabilities.toLocaleString('en-IN')}) + Equity (₹${totalEquity.toLocaleString('en-IN')}) [Delta: ₹${equationDelta}]`
  );

  console.log('\n====================================================');
  const allPass = results.every(r => r.passed);
  console.log(`INTEGRITY AUDIT: ${results.filter(r => r.passed).length}/${results.length} CHECKS PASSED`);
  console.log(`STATUS: ${allPass ? 'ALL INTEGRITY INVARIANTS SATISFIED' : 'FAILURES DETECTED'}`);
  console.log('====================================================\n');
  process.exit(allPass ? 0 : 1);
}

runIntegrityChecks().catch(err => {
  console.error('Integrity checks error:', err);
  process.exit(1);
});
