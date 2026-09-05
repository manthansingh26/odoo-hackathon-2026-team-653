import React, { useState } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import { Modal } from '../components/Modal'

export function ContactsPage({ contacts, loading, error, onAddContact, isCreating, isModalOpen, setIsModalOpen }) {
  const [filter, setFilter] = useState('ALL')
  const [formData, setFormData] = useState({
    name: '',
    type: 'CUSTOMER',
    email: '',
    phone: '',
  })
  const [formError, setFormError] = useState(null)

  const filteredContacts = contacts.filter((c) => {
    if (filter === 'ALL') return true
    return c.type === filter
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.name.trim()) {
      setFormError('Name is required')
      return
    }

    try {
      await onAddContact({
        name: formData.name.trim(),
        type: formData.type,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
      })
      setFormData({ name: '', type: 'CUSTOMER', email: '', phone: '' })
      setIsModalOpen(false)
    } catch (err) {
      setFormError(err.message || 'Failed to create contact')
    }
  }

  return (
    <div className="page-wrapper">
      <div className="filter-bar">
        <div className="tab-group">
          <button
            className={`tab-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Contacts ({contacts.length})
          </button>
          <button
            className={`tab-btn ${filter === 'CUSTOMER' ? 'active' : ''}`}
            onClick={() => setFilter('CUSTOMER')}
          >
            Customers ({contacts.filter((c) => c.type === 'CUSTOMER').length})
          </button>
          <button
            className={`tab-btn ${filter === 'VENDOR' ? 'active' : ''}`}
            onClick={() => setFilter('VENDOR')}
          >
            Vendors ({contacts.filter((c) => c.type === 'VENDOR').length})
          </button>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setFormError(null)
            setIsModalOpen(true)
          }}
        >
          + Add New Contact
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Directory of Contacts</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Customers & Vendors stored in PostgreSQL
            </p>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {filteredContacts.length} contacts
          </span>
        </div>

        <div className="panel-body" style={{ padding: 0 }}>
          {loading && contacts.length === 0 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <div className="state-title">Loading contacts...</div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <div className="state-title">No contacts found</div>
              <div className="state-desc">
                {filter === 'ALL'
                  ? 'No contacts in the database yet.'
                  : `No ${filter.toLowerCase()}s found.`}
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsModalOpen(true)}
              >
                + Add Contact
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Relationship</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Transactions</th>
                    <th>Added On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {c.name}
                      </td>
                      <td>
                        <StatusBadge type={c.type} />
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {c.email || '—'}
                      </td>
                      <td className="mono" style={{ fontSize: '12.5px' }}>
                        {c.phone || '—'}
                      </td>
                      <td>
                        <span className="nav-badge-pill" style={{ fontSize: '11px' }}>
                          {c._count?.transactions ?? 0} records
                        </span>
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Business Contact"
      >
        {formError && <div className="alert-error">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Contact / Business Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Amber Wood Interiors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Type *</label>
            <select
              className="form-control"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="CUSTOMER">Customer (Buyer)</option>
              <option value="VENDOR">Vendor (Supplier)</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="contact@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98000 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
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
              {isCreating ? 'Saving...' : 'Save to PostgreSQL'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
