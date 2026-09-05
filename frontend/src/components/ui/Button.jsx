import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer rounded-md";

  const variants = {
    primary: "bg-neutral-950 text-white hover:bg-neutral-800 active:bg-neutral-900 shadow-xs border border-transparent",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 border border-neutral-200",
    outline: "bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 shadow-xs",
    ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
    destructive: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 active:bg-red-200",
    profit: "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100",
    link: "text-neutral-900 underline-offset-4 hover:underline p-0 h-auto"
  };

  const sizes = {
    xs: "text-xs px-2 py-1 h-7 gap-1",
    sm: "text-xs px-3 py-1.5 h-8 gap-1.5",
    md: "text-sm px-4 py-2 h-9 gap-2",
    lg: "text-base px-5 py-2.5 h-11 gap-2.5",
    icon: "h-9 w-9 p-0"
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
