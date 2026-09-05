import React from 'react';
import { Boxes, Printer, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export const StockReport = () => {
  const { data, formatINR } = useAppContext();
  const products = data.products || [];

  // Valuation calculation
  const totalValuation = products.reduce((acc, p) => {
    if (p.stock === null) return acc;
    return acc + (p.stock * p.purchasePrice);
  }, 0);

  const totalRetailPotential = products.reduce((acc, p) => {
    if (p.stock === null) return acc;
    return acc + (p.stock * p.salesPrice);
  }, 0);

  const lowStockCount = products.filter(p => p.stock !== null && p.stock > 0 && p.stock <= (p.minStock || 5)).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">Stock Valuation & Inventory Report</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Finished furniture inventory tracking, cost valuation, and reorder alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <Button size="sm" variant="outline" onClick={() => window.print()} className="text-xs gap-1">
            <Printer className="w-3.5 h-3.5" />
            Print Stock Summary
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Inventory Asset Value</span>
          <div className="text-2xl font-bold font-mono text-neutral-950 mt-1">{formatINR(totalValuation)}</div>
          <span className="text-xs text-neutral-500 mt-1 block">Cost value of warehouse goods</span>
        </Card>

        <Card className="p-4 bg-white border border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Retail Potential</span>
          <div className="text-2xl font-bold font-mono text-neutral-950 mt-1">{formatINR(totalRetailPotential)}</div>
          <span className="text-xs text-neutral-500 mt-1 block">At full catalog sales price</span>
        </Card>

        <Card className="p-4 bg-white border border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Low Stock Alerts</span>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">{lowStockCount} SKUs</div>
          <span className="text-xs text-neutral-500 mt-1 block">Below safety reorder threshold</span>
        </Card>

        <Card className="p-4 bg-white border border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Out of Stock SKUs</span>
          <div className="text-2xl font-bold font-mono text-[#c62828] mt-1">{outOfStockCount} SKUs</div>
          <span className="text-xs text-neutral-500 mt-1 block">Immediate production needed</span>
        </Card>
      </div>

      {/* Stock Report Table (Section 24) */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product / SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Opening Stock</TableHead>
              <TableHead>Purchased Qty</TableHead>
              <TableHead>Sold Qty</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Stock Value (Cost)</TableHead>
              <TableHead>Stock Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const stockVal = p.stock !== null ? p.stock * p.purchasePrice : 0;
              let badgeVariant = 'paid';
              let statusText = 'In Stock';

              if (p.stock === 0) {
                badgeVariant = 'loss';
                statusText = 'Out of Stock';
              } else if (p.stock !== null && p.stock <= (p.minStock || 5)) {
                badgeVariant = 'warning';
                statusText = 'Low Stock';
              } else if (p.stock === null) {
                badgeVariant = 'outline';
                statusText = 'Service (N/A)';
              }

              return (
                <TableRow key={p.id}>
                  <TableCell className="font-semibold text-neutral-950 text-sm">
                    {p.name}
                    <div className="font-mono text-[10px] text-neutral-400 font-normal">{p.code}</div>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-700">{p.category}</TableCell>
                  <TableCell className="font-mono text-xs">{p.openingStock || '-'}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">+{p.purchasedQty || 0}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">-{p.soldQty || 0}</TableCell>
                  <TableCell className="font-mono font-bold text-neutral-900 text-sm">
                    {p.stock !== null ? p.stock : '-'}
                  </TableCell>
                  <TableCell className="font-mono font-bold text-neutral-950">
                    {p.stock !== null ? formatINR(stockVal) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant}>
                      {statusText}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
