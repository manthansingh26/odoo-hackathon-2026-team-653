import React from 'react';
import { cn } from '../../lib/utils';

export const Table = ({ className, children, ...props }) => (
  <div className="w-full overflow-x-auto rounded-md border border-neutral-200 bg-white">
    <table className={cn("w-full caption-bottom text-sm text-left", className)} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ className, children, ...props }) => (
  <thead className={cn("bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 uppercase text-[11px] font-semibold tracking-wider", className)} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ className, children, ...props }) => (
  <tbody className={cn("divide-y divide-neutral-100 text-neutral-800", className)} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ className, children, ...props }) => (
  <tr className={cn("hover:bg-neutral-50/70 transition-colors group", className)} {...props}>
    {children}
  </tr>
);

export const TableHead = ({ className, children, ...props }) => (
  <th className={cn("h-10 px-4 py-2 font-medium text-neutral-600 align-middle", className)} {...props}>
    {children}
  </th>
);

export const TableCell = ({ className, children, ...props }) => (
  <td className={cn("p-4 align-middle text-neutral-800 text-sm", className)} {...props}>
    {children}
  </td>
);
