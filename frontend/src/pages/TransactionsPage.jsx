import React, { useState } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import { Modal } from '../components/Modal'

export function TransactionsPage({
  transactions,
  contacts,
  loading,
  error,
  onAddTransaction,
  isCreating,
  isModalOpen,
  setIsModalOpen,
  initialFilter = 'ALL',
}) {
  const [filter, setFilter] = useState(initialFilter)
  const [formData, setFormData] = useState({
    type: 'SALE',
    reference: '',
    contactId: '',
    amount: '',
    status: 'PAID',
    transactionDate: new Date().toISOString().split('T')[0],
  })
  const [formError, setFormError] = useState(null)

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'ALL') return true
    if (filter === 'SALE') return t.type === 'SALE'
    if (filter === 'PURCHASE') return t.type === 'PURCHASE'
    if (filter === 'PAID') return t.status === 'PAID'
    if (filter === 'PENDING') return t.status === 'PENDING'
    return true
  })

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.contactId) {
      setFormError('Please select a contact')
      return
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setFormError('Please enter a valid positive amount')
      return
    }

    try {
      await onAddTransaction({
        type: formData.type,
        reference: formData.reference.trim() || undefined,
        contactId: formData.contactId,
        amount: Number(formData.amount),
        status: formData.status,
        transactionDate: formData.transactionDate ? new Date(formData.transactionDate) : new Date(),
      })
      setFormData({
        type: 'SALE',
        reference: '',
        contactId: '',
        amount: '',
        status: 'PAID',
        transactionDate: new Date().toISOString().split('T')[0],
      })
      setIsModalOpen(false)
    } catch (err) {
      setFormError(err.message || 'Failed to post transaction')
    }
  }

  // Filter contacts by type to assist user
  const relevantContacts = contacts.filter((c) =>
    formData.type === 'SALE' ? c.type === 'CUSTOMER' : c.type === 'VENDOR'
  )

  return (
    <div className="page-wrapper">
      <div className="filter-bar">
        <div className="tab-group">
          <button
            className={`tab-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All ({transactions.length})
          </button>
          <button
            className={`tab-btn ${filter === 'SALE' ? 'active' : ''}`}
            onClick={() => setFilter('SALE')}
          >
            Sales ({transactions.filter((t) => t.type === 'SALE').length})
          </button>
          <button
            className={`tab-btn ${filter === 'PURCHASE' ? 'active' : ''}`}
            onClick={() => setFilter('PURCHASE')}
          >
            Purchases ({transactions.filter((t) => t.type === 'PURCHASE').length})
          </button>
          <button
            className={`tab-btn ${filter === 'PAID' ? 'active' : ''}`}
            onClick={() => setFilter('PAID')}
          >
            Settled / Paid ({transactions.filter((t) => t.status === 'PAID').length})
          </button>
          <button
            className={`tab-btn ${filter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setFilter('PENDING')}
          >
            Pending ({transactions.filter((t) => t.status === 'PENDING').length})
          </button>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setFormError(null)
            setIsModalOpen(true)
          }}
        >
          + Post New Transaction
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Transaction Journal Log</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Every transaction automatically produces a balanced double-entry journal item in PostgreSQL
            </p>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {filteredTransactions.length} transactions
          </span>
        </div>

        <div className="panel-body" style={{ padding: 0 }}>
          {loading && transactions.length === 0 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <div className="state-title">Loading transactions...</div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <div className="state-title">No transactions found</div>
              <div className="state-desc">Try changing the filter or record a new transaction.</div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsModalOpen(true)}
              >
                + Post Transaction
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Type</th>
                    <th>Contact</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Ledger Entry</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {tx.reference}
                      </td>
                      <td>
                        <StatusBadge type={tx.type} />
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {tx.contact?.name || '—'}
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        {new Date(tx.transactionDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatCurrency(Number(tx.amount))}
                      </td>
                      <td>
                        <StatusBadge status={tx.status} />
                      </td>
                      <td>
                        <span className="badge badge-balanced" title="Double-entry journal verified">
                          ✓ {tx.journalEntry?.reference || `JE-${tx.reference}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post New Transaction"
      >
        {formError && <div className="alert-error">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Transaction Type *</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => {
                  const newType = e.target.value
                  setFormData({
                    ...formData,
                    type: newType,
                    contactId: '', // reset selected contact
                  })
                }}
              >
                <option value="SALE">Sale (Customer Invoice)</option>
                <option value="PURCHASE">Purchase (Vendor Bill)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Status *</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="PAID">Paid (Immediate Cash Settlement)</option>
                <option value="PENDING">Pending (On Credit - A/R or A/P)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {formData.type === 'SALE' ? 'Select Customer *' : 'Select Vendor *'}
            </label>
            <select
              className="form-control"
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
              required
            >
              <option value="">-- Choose a contact --</option>
              {(relevantContacts.length > 0 ? relevantContacts : contacts).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="1"
                className="form-control mono"
                placeholder="25000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reference (Optional)</label>
              <input
                type="text"
                className="form-control mono"
                placeholder={formData.type === 'SALE' ? 'INV-2026-...' : 'BILL-2026-...'}
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Transaction Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.transactionDate}
              onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
            />
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
            ℹ️ <strong>Accounting Invariant:</strong> A balanced journal entry with matching Debit and Credit lines will be automatically recorded in PostgreSQL using <code>postJournalEntry()</code>.
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
              {isCreating ? 'Posting...' : 'Post Transaction & Journal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
