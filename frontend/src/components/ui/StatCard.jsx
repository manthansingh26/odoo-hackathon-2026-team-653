import React from 'react';
import { ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const StatCard = ({
  title,
  amount,
  change,
  isPositive,
  subtitle,
  icon: Icon,
  variant = 'default', // 'profit' | 'loss' | 'warning' | 'default'
  className
}) => {
  return (
    <div
      className={cn(
        "bg-white border border-neutral-200 rounded-xl p-5 shadow-xs transition-all hover:border-neutral-300 relative overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800 border border-neutral-200">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 font-mono">
          {amount}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs flex-wrap">
        {change && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-medium border",
              isPositive === true
                ? "bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]"
                : isPositive === false
                ? "bg-[#ffebee] text-[#c62828] border-[#ffcdd2]"
                : "bg-neutral-100 text-neutral-700 border-neutral-200"
            )}
          >
            {isPositive === true ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : isPositive === false ? (
              <ArrowDownRight className="w-3 h-3" />
            ) : null}
            {change}
          </span>
        )}

        {subtitle && (
          <span
            className={cn(
              "text-xs",
              variant === 'warning'
                ? "text-amber-700 font-medium inline-flex items-center gap-1"
                : "text-neutral-500"
            )}
          >
            {variant === 'warning' && <AlertCircle className="w-3 h-3 text-amber-600" />}
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
