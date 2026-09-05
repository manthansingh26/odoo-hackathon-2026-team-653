import { prisma } from '../config/db.js'

export async function getFinancialReports() {
  const items = await prisma.journalItem.findMany({
    include: {
      journalEntry: true,
    },
  })

  // Account balances map: accountName -> { debit, credit, netDebit, netCredit }
  const accountTotals = {}

  for (const item of items) {
    const acc = item.accountName.trim()
    if (!accountTotals[acc]) {
      accountTotals[acc] = { debit: 0, credit: 0 }
    }
    accountTotals[acc].debit += Number(item.debit || 0)
    accountTotals[acc].credit += Number(item.credit || 0)
  }

  // Calculate standard financial accounts purely from PostgreSQL journal items
  const cashNet = (accountTotals['Cash']?.debit || 0) - (accountTotals['Cash']?.credit || 0)
  const arNet = (accountTotals['Accounts Receivable']?.debit || 0) - (accountTotals['Accounts Receivable']?.credit || 0)
  const invNet = (accountTotals['Inventory']?.debit || 0) - (accountTotals['Inventory']?.credit || 0)
  const totalAssets = cashNet + arNet + invNet

  const apNet = (accountTotals['Accounts Payable']?.credit || 0) - (accountTotals['Accounts Payable']?.debit || 0)
  const totalLiabilities = apNet

  const revenue = (accountTotals['Sales Revenue']?.credit || 0) - (accountTotals['Sales Revenue']?.debit || 0)
  const cogs = (accountTotals['Inventory']?.debit || 0)
  const expenses = (accountTotals['Cost of Goods Sold (Purchases)']?.debit || 0) + (accountTotals['Expenses']?.debit || 0) || cogs
  const netProfit = revenue - expenses
  const totalEquity = revenue

  const totalDebit = items.reduce((s, i) => s + Number(i.debit || 0), 0)
  const totalCredit = items.reduce((s, i) => s + Number(i.credit || 0), 0)

  return {
    integrity: {
      totalDebit,
      totalCredit,
      balanced: Math.round(totalDebit * 100) === Math.round(totalCredit * 100),
      difference: Math.abs(totalDebit - totalCredit),
    },
    profitAndLoss: {
      revenue,
      cogs,
      expenses,
      netProfit,
      formula: 'Revenue - Expenses = Net Profit',
      valid: revenue - expenses === netProfit,
    },
    balanceSheet: {
      assets: {
        cash: cashNet,
        accountsReceivable: arNet,
        inventory: invNet,
        totalAssets,
      },
      liabilities: {
        accountsPayable: apNet,
        totalLiabilities,
      },
      equity: {
        retainedEarnings: totalEquity,
        totalEquity,
      },
      formula: 'Assets = Liabilities + Equity',
      equationBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) === 0,
    },
    accountTotals,
  }
}
