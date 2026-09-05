import React from 'react'

export function MetricCard({ title, value, icon, subtext, variant = 'sales' }) {
  const formattedValue = typeof value === 'number'
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
    : value

  return (
    <div className={`metric-card metric-${variant}`}>
      <div className="metric-top">
        <span className="metric-label">{title}</span>
        <div className="metric-icon-box">{icon}</div>
      </div>
      <div className="metric-value">{formattedValue}</div>
      {subtext && <div className="metric-sub">{subtext}</div>}
    </div>
  )
}
