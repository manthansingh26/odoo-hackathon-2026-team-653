import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const base = "inline-flex items-center gap-1 font-medium rounded-full px-2.5 py-0.5 text-xs transition-colors";

  const variants = {
    default: "bg-neutral-100 text-neutral-800 border border-neutral-200",
    dark: "bg-neutral-900 text-neutral-100 border border-neutral-800",
    outline: "bg-transparent text-neutral-700 border border-neutral-300",
    // Semantic profit/positive (subtle green)
    profit: "bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]",
    success: "bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]",
    paid: "bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]",
    // Semantic loss/negative (subtle red)
    loss: "bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]",
    danger: "bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]",
    overdue: "bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]",
    // Pending / warning (subtle warm neutral / amber)
    pending: "bg-amber-50 text-amber-800 border border-amber-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
    // Favorite
    favorite: "bg-[#fce4ec] text-[#e91e63] border border-[#f8bbd0]",
    info: "bg-blue-50 text-blue-800 border border-blue-200",
  };

  return (
    <span className={cn(base, variants[variant] || variants.default, className)} {...props}>
      {children}
    </span>
  );
};
