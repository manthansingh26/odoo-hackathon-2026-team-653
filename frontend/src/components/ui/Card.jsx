import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ className, children, ...props }) => (
  <div
    className={cn(
      "bg-white border border-neutral-200 rounded-lg shadow-xs overflow-hidden transition-all",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("p-5 pb-3 border-b border-neutral-100 flex flex-col space-y-1.5", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn("text-base font-semibold leading-none tracking-tight text-neutral-900", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }) => (
  <p className={cn("text-xs text-neutral-500", className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn("p-5", className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn("p-4 pt-0 flex items-center border-t border-neutral-100 bg-neutral-50/50", className)} {...props}>
    {children}
  </div>
);
