import React from 'react'

export function PlaceholderPage({ title, icon, milestone, description, features = [], onNavigate }) {
  return (
    <div className="page-wrapper">
      <div className="panel" style={{ maxWidth: '800px', margin: '30px auto' }}>
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{icon}</span>
            <div>
              <h2 className="panel-title">{title} Module</h2>
              <span className="header-tag">{milestone}</span>
            </div>
          </div>
        </div>

        <div className="panel-body">
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
            {description}
          </p>

          <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Roadmap Features in this Module:
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {features.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                }}
              >
                <span style={{ color: 'var(--accent-light)' }}>🔹</span>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--accent-glow)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}>
            💡 <strong>Mentor Demo Note:</strong> The core accounting vertical slice is currently live across <strong>Dashboard</strong>, <strong>Contacts</strong>, <strong>Products</strong>, <strong>Transactions</strong>, and <strong>Journal Entries</strong>, backed by real PostgreSQL 16 database tables and migrations.
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('dashboard')}>
              &larr; Back to Dashboard
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('transactions')}>
              View Active Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
