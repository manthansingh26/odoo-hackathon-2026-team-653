import { prisma } from '../config/db.js'

export async function getDashboardSummary() {
  // Fetch all transactions to compute aggregated metrics
  const transactions = await prisma.transaction.findMany({
    include: {
      contact: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
    orderBy: {
      transactionDate: 'desc',
    },
  })

  let totalSales = 0
  let totalPurchases = 0
  let receivable = 0
  let payable = 0

  for (const t of transactions) {
    const amount = Number(t.amount) || 0
    if (t.type === 'SALE') {
      totalSales += amount
      if (t.status === 'PENDING') {
        receivable += amount
      }
    } else if (t.type === 'PURCHASE') {
      totalPurchases += amount
      if (t.status === 'PENDING') {
        payable += amount
      }
    }
  }

  const round2 = (n) => Math.round(n * 100) / 100

  return {
    totalSales: round2(totalSales),
    totalPurchases: round2(totalPurchases),
    receivable: round2(receivable),
    payable: round2(payable),
    netProfit: round2(totalSales - totalPurchases),
    recentTransactions: transactions.slice(0, 8),
  }
}
