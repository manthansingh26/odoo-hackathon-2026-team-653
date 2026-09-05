import React from 'react'

export function StatusBadge({ status, type }) {
  if (!status && !type) return null

  const value = (status || type).toUpperCase()

  let badgeClass = 'badge'
  let label = value

  switch (value) {
    case 'PAID':
      badgeClass += ' badge-paid'
      label = 'Paid'
      break
    case 'PENDING':
      badgeClass += ' badge-pending'
      label = 'Pending'
      break
    case 'CUSTOMER':
      badgeClass += ' badge-customer'
      label = 'Customer'
      break
    case 'VENDOR':
      badgeClass += ' badge-vendor'
      label = 'Vendor'
      break
    case 'SALE':
      badgeClass += ' badge-sale'
      label = 'Sale'
      break
    case 'PURCHASE':
      badgeClass += ' badge-purchase'
      label = 'Purchase'
      break
    case 'BALANCED':
    case 'TRUE':
      badgeClass += ' badge-balanced'
      label = 'Balanced'
      break
    case 'UNBALANCED':
    case 'FALSE':
      badgeClass += ' badge-unbalanced'
      label = 'Unbalanced'
      break
    default:
      badgeClass += ' badge-pending'
      label = value
  }

  return <span className={badgeClass}>{label}</span>
}
