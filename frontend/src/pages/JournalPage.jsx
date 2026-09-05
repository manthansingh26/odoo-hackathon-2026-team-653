import React, { useState } from 'react'
import { Modal } from '../components/Modal'

export function JournalPage({ entries, loading, error, onAddEntry, isCreating }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formError, setFormError] = useState(null)
  const [formData, setFormData] = useState({
    reference: '',
    description: '',
    debitAccount: 'Cash',
    debitAmount: '',
    creditAccount: 'Sales Revenue',
    creditAmount: '',
  })

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    const debit = Number(formData.debitAmount)
    const credit = Number(formData.creditAmount)

    if (!formData.reference.trim() || !formData.description.trim()) {
      setFormError('Reference and Description are required')
      return
    }

    if (isNaN(debit) || debit <= 0 || isNaN(credit) || credit <= 0) {
      setFormError('Both debit and credit amounts must be greater than zero')
      return
    }

    try {
      await onAddEntry({
        reference: formData.reference.trim(),
        description: formData.description.trim(),
        lines: [
          { accountName: formData.debitAccount.trim(), debit },
          { accountName: formData.creditAccount.trim(), credit },
        ],
      })
      setFormData({
        reference: '',
        description: '',
        debitAccount: 'Cash',
        debitAmount: '',
        creditAccount: 'Sales Revenue',
        creditAmount: '',
      })
      setIsModalOpen(false)
    } catch (err) {
      setFormError(err.message || 'Failed to create journal entry')
    }
  }

  // Aggregate ledger statistics
  const totalDebitSum = entries.reduce((s, e) => s + (e.totalDebit || 0), 0)
  const totalCreditSum = entries.reduce((s, e) => s + (e.totalCredit || 0), 0)
  const allBalanced = entries.every((e) => e.balanced)

  return (
    <div className="page-wrapper">
      {/* Top Banner explaining the Accounting Engine */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid rgba(217, 119, 6, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px' }}>⚖️</span>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Double-Entry Ledger & Invariant Verification</h3>
            <span className="badge badge-balanced">
              {allBalanced ? '100% Balanced' : 'Check Entries'}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '780px' }}>
            Enforced by <code>postJournalEntry()</code>: Every financial transaction creates atomic Debit & Credit journal items. An entry where <code>SUM(debit) !== SUM(credit)</code> is strictly rejected by the backend.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Debit</div>
            <div className="mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatCurrency(totalDebitSum)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Credit</div>
            <div className="mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatCurrency(totalCreditSum)}
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setFormError(null)
              setIsModalOpen(true)
            }}
          >
            + Post Journal Entry
          </button>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">General Journal Entries</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Complete ledger audit trail with account-level lines
            </p>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {entries.length} journal records
          </span>
        </div>

        <div className="panel-body" style={{ padding: 0 }}>
          {loading && entries.length === 0 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <div className="state-title">Loading journal entries...</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📒</div>
              <div className="state-title">No journal entries found</div>
              <div className="state-desc">Transactions automatically generate journal entries.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    padding: '20px 24px',
                  }}
                >
                  {/* Entry Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-light)' }}>
                        {entry.reference}
                      </span>
                      <span style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {entry.description}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {new Date(entry.transactionDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {entry.balanced ? (
                        <span className="badge badge-balanced">✓ Balanced</span>
                      ) : (
                        <span className="badge badge-unbalanced">⚠ Unbalanced</span>
                      )}
                    </div>
                  </div>

                  {/* Lines Table */}
                  <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                    <table className="data-table" style={{ fontSize: '13px' }}>
                      <thead>
                        <tr>
                          <th>Account</th>
                          <th style={{ textAlign: 'right' }}>Debit (₹)</th>
                          <th style={{ textAlign: 'right' }}>Credit (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.items?.map((item) => (
                          <tr key={item.id}>
                            <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                              {item.accountName}
                            </td>
                            <td className="mono" style={{ textAlign: 'right', color: Number(item.debit) > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                              {Number(item.debit) > 0 ? formatCurrency(Number(item.debit)) : '—'}
                            </td>
                            <td className="mono" style={{ textAlign: 'right', color: Number(item.credit) > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                              {Number(item.credit) > 0 ? formatCurrency(Number(item.credit)) : '—'}
                            </td>
                          </tr>
                        ))}
                        {/* Totals row */}
                        <tr style={{ background: 'rgba(10, 13, 20, 0.4)', fontWeight: 600 }}>
                          <td style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '11.5px' }}>
                            Totals
                          </td>
                          <td className="mono" style={{ textAlign: 'right', color: 'var(--success)' }}>
                            {formatCurrency(entry.totalDebit || 0)}
                          </td>
                          <td className="mono" style={{ textAlign: 'right', color: 'var(--success)' }}>
                            {formatCurrency(entry.totalCredit || 0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manual Journal Entry Modal (for testing & demoing the invariant) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post Manual Journal Entry"
      >
        {formError && <div className="alert-error">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Reference *</label>
            <input
              type="text"
              className="form-control mono"
              placeholder="e.g. JE-ADJ-2026-001"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Month-end adjustment / Owner equity"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div style={{ marginTop: '16px', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Line 1: Debit Side
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Debit Account *</label>
              <select
                className="form-control"
                value={formData.debitAccount}
                onChange={(e) => setFormData({ ...formData, debitAccount: e.target.value })}
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="Accounts Receivable">Accounts Receivable</option>
                <option value="Inventory">Inventory</option>
                <option value="Office Equipment">Office Equipment</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Debit Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-control mono"
                placeholder="10000"
                value={formData.debitAmount}
                onChange={(e) => setFormData({ ...formData, debitAmount: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '8px', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Line 2: Credit Side
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Credit Account *</label>
              <select
                className="form-control"
                value={formData.creditAccount}
                onChange={(e) => setFormData({ ...formData, creditAccount: e.target.value })}
              >
                <option value="Sales Revenue">Sales Revenue</option>
                <option value="Accounts Payable">Accounts Payable</option>
                <option value="Owner Equity">Owner Equity</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Credit Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-control mono"
                placeholder="10000"
                value={formData.creditAmount}
                onChange={(e) => setFormData({ ...formData, creditAmount: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{
            background: 'var(--bg-elevated)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            border: '1px solid var(--border-subtle)',
          }}>
            ⚖️ <strong>Double-entry Rule:</strong> The backend will reject any entry where Debit amount ({formData.debitAmount || 0}) does not equal Credit amount ({formData.creditAmount || 0}).
          </div>

          <div className="modal-footer" style={{ margin: '24px -24px -24px', paddingBottom: 0 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCreating}
            >
              {isCreating ? 'Validating & Posting...' : 'Post Balanced Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
