import React from 'react'

export function Header({ title, subtitle, onRefresh, isRefreshing, onQuickAction }) {
  const currentDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date())

  return (
    <header className="top-header">
      <div className="header-title-box">
        <h1 className="header-page-title">{title}</h1>
        {subtitle && <span className="header-tag">{subtitle}</span>}
      </div>

      <div className="header-actions">
        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginRight: 8 }}>
          📅 {currentDate}
        </div>

        {onQuickAction && (
          <button
            className="btn btn-primary btn-sm"
            onClick={onQuickAction}
          >
            + New Record
          </button>
        )}

        <button
          className="btn btn-secondary btn-sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh data from PostgreSQL"
        >
          {isRefreshing ? '⏳ Syncing...' : '🔄 Refresh Data'}
        </button>
      </div>
    </header>
  )
}
