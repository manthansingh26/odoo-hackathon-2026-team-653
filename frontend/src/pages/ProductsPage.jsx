import React, { useState } from 'react'
import { Modal } from '../components/Modal'

export function ProductsPage({ products, loading, error, onAddProduct, isCreating }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
  })
  const [formError, setFormError] = useState(null)

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  const totalInventoryValue = products.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0),
    0
  )
  const lowStockCount = products.filter((p) => p.stock <= 10).length

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.name.trim() || !formData.sku.trim() || !formData.price) {
      setFormError('Name, SKU, and Price are required')
      return
    }

    try {
      await onAddProduct({
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        price: Number(formData.price),
        stock: formData.stock ? parseInt(formData.stock, 10) : 0,
      })
      setFormData({ name: '', sku: '', price: '', stock: '' })
      setIsModalOpen(false)
    } catch (err) {
      setFormError(err.message || 'Failed to create product')
    }
  }

  return (
    <div className="page-wrapper">
      {/* Top summary metrics */}
      <div className="metrics-grid">
        <div className="metric-card metric-sales">
          <div className="metric-top">
            <span className="metric-label">Total Catalog Items</span>
            <div className="metric-icon-box">🪑</div>
          </div>
          <div className="metric-value">{products.length}</div>
          <div className="metric-sub">Furniture models in database</div>
        </div>

        <div className="metric-card metric-profit">
          <div className="metric-top">
            <span className="metric-label">Total Inventory Valuation</span>
            <div className="metric-icon-box">💎</div>
          </div>
          <div className="metric-value">{formatCurrency(totalInventoryValue)}</div>
          <div className="metric-sub">Asset valuation at cost price</div>
        </div>

        <div className="metric-card metric-payable">
          <div className="metric-top">
            <span className="metric-label">Low Stock Alerts</span>
            <div className="metric-icon-box">⚠️</div>
          </div>
          <div className="metric-value" style={{ color: lowStockCount > 0 ? 'var(--warning)' : 'var(--success)' }}>
            {lowStockCount} items
          </div>
          <div className="metric-sub">Units with 10 or fewer in stock</div>
        </div>
      </div>

      <div className="filter-bar">
        <div>
          <h2 className="panel-title" style={{ fontSize: '18px' }}>Furniture Inventory</h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Track SKUs, retail pricing, and warehouse quantities
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setFormError(null)
            setIsModalOpen(true)
          }}
        >
          + Add Product
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Product Catalog</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {products.length} registered products
          </span>
        </div>

        <div className="panel-body" style={{ padding: 0 }}>
          {loading && products.length === 0 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <div className="state-title">Loading inventory...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🪑</div>
              <div className="state-title">No products in inventory</div>
              <div className="state-desc">Add your first furniture item to start recording stock.</div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsModalOpen(true)}
              >
                + Add Product
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product Name</th>
                    <th>Unit Price</th>
                    <th>In Stock</th>
                    <th>Status</th>
                    <th>Inventory Value</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const price = Number(p.price) || 0
                    const stock = Number(p.stock) || 0
                    const isLow = stock <= 10

                    return (
                      <tr key={p.id}>
                        <td className="mono" style={{ fontWeight: 600, color: 'var(--accent-light)' }}>
                          {p.sku}
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {p.name}
                        </td>
                        <td className="mono" style={{ fontWeight: 500 }}>
                          {formatCurrency(price)}
                        </td>
                        <td className="mono" style={{ fontWeight: 600 }}>
                          {stock} units
                        </td>
                        <td>
                          {isLow ? (
                            <span className="badge badge-pending">Low Stock</span>
                          ) : (
                            <span className="badge badge-paid">In Stock</span>
                          )}
                        </td>
                        <td className="mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {formatCurrency(price * stock)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Furniture Product"
      >
        {formError && <div className="alert-error">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Teak Wood Coffee Table"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">SKU (Stock Keeping Unit) *</label>
            <input
              type="text"
              className="form-control mono"
              placeholder="e.g. FUR-TBL-008"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Unit Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control mono"
                placeholder="15999"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Stock Quantity</label>
              <input
                type="number"
                min="0"
                className="form-control mono"
                placeholder="20"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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
              {isCreating ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
