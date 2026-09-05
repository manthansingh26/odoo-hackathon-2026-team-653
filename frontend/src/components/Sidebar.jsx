import React from 'react'

export function Sidebar({ activeTab, onSelectTab, counts = {} }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', section: 'CORE' },
    { id: 'contacts', label: 'Contacts', icon: '👥', section: 'CORE', count: counts.contacts },
    { id: 'products', label: 'Products', icon: '🪑', section: 'CORE', count: counts.products },
    { id: 'transactions', label: 'Transactions', icon: '💳', section: 'FINANCE', count: counts.transactions },
    { id: 'purchases', label: 'Purchases', icon: '📥', section: 'FINANCE' },
    { id: 'sales', label: 'Sales', icon: '📤', section: 'FINANCE' },
    { id: 'invoices', label: 'Invoices', icon: '📄', section: 'FINANCE' },
    { id: 'payments', label: 'Payments', icon: '💰', section: 'FINANCE' },
    { id: 'journal-entries', label: 'Journal Entries', icon: '📒', section: 'ACCOUNTING', count: counts.journalEntries },
    { id: 'reports', label: 'Reports', icon: '📈', section: 'ACCOUNTING' },
    { id: 'settings', label: 'Settings', icon: '⚙️', section: 'SYSTEM' },
  ]

  let currentSection = null

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">🛋️</div>
        <div>
          <div className="brand-title">Urban Furniture</div>
          <div className="brand-subtitle">Accounting System</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const showSection = item.section !== currentSection
          currentSection = item.section

          const isActive = activeTab === item.id

          return (
            <React.Fragment key={item.id}>
              {showSection && (
                <div className="nav-section-label">{item.section}</div>
              )}
              <div
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(item.id)}
              >
                <div className="nav-item-content">
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`nav-badge-pill ${isActive ? 'active-pill' : ''}`}>
                    {item.count}
                  </span>
                )}
              </div>
            </React.Fragment>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status-box">
          <div className="status-row">
            <span>
              <span className="status-dot"></span>
              PostgreSQL 16 (Docker)
            </span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
