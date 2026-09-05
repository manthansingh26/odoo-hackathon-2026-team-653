import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({
  className,
  type = 'text',
  error,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm text-neutral-900 shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Select = React.forwardRef(({
  className,
  children,
  error,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      <select
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm text-neutral-900 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          error && "border-red-500",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export const Textarea = React.forwardRef(({
  className,
  error,
  rows = 3,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-xs transition-colors placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
