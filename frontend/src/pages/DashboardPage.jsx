import React from 'react'
import { MetricCard } from '../components/MetricCard'
import { StatusBadge } from '../components/StatusBadge'

export function DashboardPage({ summary, loading, error, onNavigate, onOpenNewTx, onOpenNewContact }) {
  if (loading && !summary) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <div className="state-title">Loading accounting overview...</div>
        <div className="state-desc">Querying PostgreSQL transactions and ledger metrics</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="alert-error">Failed to load dashboard data: {error}</div>
      </div>
    )
  }

  const {
    totalSales = 0,
    totalPurchases = 0,
    receivable = 0,
    payable = 0,
    netProfit = 0,
    recentTransactions = [],
  } = summary || {}

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="page-wrapper">
      {/* 5 Core Accounting Metric Cards */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Sales"
          value={totalSales}
          icon="📈"
          subtext="Total revenue generated"
          variant="sales"
        />
        <MetricCard
          title="Total Purchases"
          value={totalPurchases}
          icon="📦"
          subtext="Cost of materials & inventory"
          variant="purchases"
        />
        <MetricCard
          title="Accounts Receivable"
          value={receivable}
          icon="📥"
          subtext="Pending customer receipts"
          variant="receivable"
        />
        <MetricCard
          title="Accounts Payable"
          value={payable}
          icon="📤"
          subtext="Pending vendor payments"
          variant="payable"
        />
        <MetricCard
          title="Net Profit"
          value={netProfit}
          icon="✨"
          subtext="Sales minus purchases"
          variant="profit"
        />
      </div>

      {/* Main Dashboard Layout */}
      <div className="dashboard-grid">
        {/* Recent Transactions Panel */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Recent Transactions</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Live postings from PostgreSQL database
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('transactions')}
            >
              View All &rarr;
            </button>
          </div>

          <div className="panel-body" style={{ padding: 0 }}>
            {recentTransactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📂</div>
                <div className="state-title">No transactions recorded yet</div>
                <div className="state-desc">Create your first sale or purchase transaction.</div>
                <button className="btn btn-primary btn-sm" onClick={onOpenNewTx}>
                  + New Transaction
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ref</th>
                      <th>Type</th>
                      <th>Contact</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {tx.reference}
                        </td>
                        <td>
                          <StatusBadge type={tx.type} />
                        </td>
                        <td>{tx.contact?.name || '—'}</td>
                        <td style={{ fontSize: '12px' }}>
                          {new Date(tx.transactionDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {formatCurrency(Number(tx.amount))}
                        </td>
                        <td>
                          <StatusBadge status={tx.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions & Financial Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Actions Panel */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Quick Actions</h2>
            </div>
            <div className="panel-body">
              <div className="quick-action-grid">
                <div className="quick-action-btn" onClick={onOpenNewTx}>
                  <div className="quick-action-icon">💳</div>
                  <div className="quick-action-title">Post Transaction</div>
                  <div className="quick-action-desc">Record sale or purchase with balanced journal</div>
                </div>

                <div className="quick-action-btn" onClick={onOpenNewContact}>
                  <div className="quick-action-icon">👤</div>
                  <div className="quick-action-title">Add Contact</div>
                  <div className="quick-action-desc">Register customer or wood supplier</div>
                </div>

                <div className="quick-action-btn" onClick={() => onNavigate('products')}>
                  <div className="quick-action-icon">🪑</div>
                  <div className="quick-action-title">Products</div>
                  <div className="quick-action-desc">View inventory catalog & pricing</div>
                </div>

                <div className="quick-action-btn" onClick={() => onNavigate('journal-entries')}>
                  <div className="quick-action-icon">📒</div>
                  <div className="quick-action-title">Audit Ledger</div>
                  <div className="quick-action-desc">Inspect balanced double-entry journals</div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Balance Overview Panel */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Account Balance Overview</h2>
            </div>
            <div className="panel-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Operating Cash Margin</span>
                  <span className="mono" style={{ fontWeight: 600, color: 'var(--success)' }}>
                    {formatCurrency(totalSales - totalPurchases)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Pending Customer Inflow</span>
                  <span className="mono" style={{ fontWeight: 600, color: 'var(--info)' }}>
                    {formatCurrency(receivable)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Pending Supplier Outflow</span>
                  <span className="mono" style={{ fontWeight: 600, color: 'var(--warning)' }}>
                    {formatCurrency(payable)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Ledger Integrity Rule</span>
                  <span className="badge badge-balanced">Debit = Credit Enforced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
