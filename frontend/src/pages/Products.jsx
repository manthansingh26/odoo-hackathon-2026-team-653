import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Eye,
  Edit2,
  Archive,
  Trash2,
  Tag,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FavoriteButton } from '../components/ui/FavoriteButton';

import { validateProductForm } from '../utils/validation';

export const Products = () => {
  const {
    data,
    addRecord,
    updateRecord,
    deleteRecord,
    toggleFavorite,
    addToast,
    formatINR
  } = useAppContext();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Goods',
    category: 'Seating',
    salesPrice: 15000,
    purchasePrice: 9000,
    stock: 20,
    minStock: 5,
    status: 'Active',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingProduct(null);
    setErrors({});
    setIsSubmitting(false);
    setFormData({
      name: '',
      code: `FURN-${Math.floor(100 + Math.random() * 900)}`,
      type: 'Goods',
      category: 'Seating',
      salesPrice: 15000,
      purchasePrice: 9000,
      stock: 20,
      minStock: 5,
      status: 'Active',
      description: ''
    });
    setIsFormOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setErrors({});
    setIsSubmitting(false);
    setFormData({
      name: p.name,
      code: p.code,
      type: p.type,
      category: p.category,
      salesPrice: p.salesPrice,
      purchasePrice: p.purchasePrice,
      stock: p.stock !== null ? p.stock : 0,
      minStock: p.minStock || 5,
      status: p.status || 'Active',
      description: p.description || ''
    });
    setIsFormOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    const valResult = validateProductForm(formData, data.products || [], editingProduct?.id);
    if (!valResult.isValid) {
      setErrors(valResult.errors);
      addToast?.({
        title: "Validation Error",
        message: Object.values(valResult.errors)[0] || "Please correct the highlighted errors.",
        type: "error"
      });
      return;
    }

    setIsSubmitting(true);
    const stockVal = formData.type === 'Service' ? null : Number(formData.stock);
    let derivedStatus = formData.status;
    if (formData.type !== 'Service') {
      if (stockVal === 0) derivedStatus = 'Out of Stock';
      else if (stockVal <= (formData.minStock || 5)) derivedStatus = 'Low Stock';
      else derivedStatus = 'Active';
    }

    const cleanData = {
      ...formData,
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      sku: formData.code.trim().toUpperCase(),
      salesPrice: Number(formData.salesPrice),
      purchasePrice: Number(formData.purchasePrice) || 0,
      stock: stockVal,
      minStock: Number(formData.minStock) || 5,
      status: derivedStatus
    };

    if (editingProduct) {
      updateRecord('products', editingProduct.id, cleanData);
    } else {
      addRecord('products', {
        ...cleanData,
        favorite: false
      });
    }
    setIsFormOpen(false);
    setIsSubmitting(false);
  };

  const handleToggleArchive = (p) => {
    const newStatus = p.status === 'Archived' ? 'Active' : 'Archived';
    updateRecord('products', p.id, { status: newStatus });
  };

  const categories = useMemo(() => {
    const set = new Set((data.products || []).map(p => p.category));
    return ['All', ...Array.from(set)];
  }, [data.products]);

  const filteredProducts = useMemo(() => {
    return (data.products || []).filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        (p.name || '').toLowerCase().includes(q) ||
        (p.code || p.sku || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [data.products, activeCategory, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">Product Master</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Catalogue of manufactured furniture, combo workstations, and assembly services.
          </p>
        </div>
        <Button onClick={openAddModal} size="sm" variant="primary" className="shadow-xs">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Product
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-neutral-200">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products or SKU..."
            className="pl-9 text-xs h-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">Fav</TableHead>
              <TableHead>Product / SKU</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sales Price</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                let badgeVariant = 'default';
                if (p.status === 'Active') badgeVariant = 'paid';
                else if (p.status === 'Low Stock') badgeVariant = 'warning';
                else if (p.status === 'Out of Stock' || p.status === 'Archived') badgeVariant = 'loss';

                return (
                  <TableRow key={p.id}>
                    <TableCell className="w-10">
                      <FavoriteButton
                        isFavorite={p.favorite}
                        onToggle={() => toggleFavorite('products', p.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-neutral-950 text-sm">{p.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{p.code}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.type === 'Goods' ? 'dark' : p.type === 'Service' ? 'outline' : 'default'}>
                        {p.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-neutral-700 font-medium">
                      {p.category}
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-neutral-950">
                      {formatINR(p.salesPrice)}
                    </TableCell>
                    <TableCell className="font-mono text-neutral-500">
                      {formatINR(p.purchasePrice)}
                    </TableCell>
                    <TableCell>
                      {p.stock !== null ? (
                        <div className="font-mono font-semibold text-neutral-900">
                          {p.stock} <span className="text-[10px] text-neutral-400 font-normal">units</span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400 italic">Service (N/A)</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setViewingProduct(p)}
                          title="View product"
                        >
                          <Eye className="w-4 h-4 text-neutral-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditModal(p)}
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4 text-neutral-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleToggleArchive(p)}
                          title={p.status === 'Archived' ? 'Unarchive' : 'Archive'}
                        >
                          <Archive className="w-4 h-4 text-neutral-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeletingProductId(p.id)}
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4 text-neutral-400 hover:text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-neutral-400">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingProduct ? 'Edit Product Record' : 'Add New Furniture Product'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Product Name *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                }}
                error={errors.name}
                placeholder="e.g. Ergonomic Office Chair"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Item SKU / Code *</label>
              <Input
                required
                value={formData.code}
                onChange={(e) => {
                  setFormData({ ...formData, code: e.target.value });
                  if (errors.code) setErrors(prev => ({ ...prev, code: null }));
                }}
                error={errors.code}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Classification *</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Goods">Goods</option>
                <option value="Service">Service</option>
                <option value="Combo">Combo / Bundle</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Category *</label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Seating">Seating</option>
                <option value="Desks">Desks</option>
                <option value="Tables">Tables</option>
                <option value="Lounge">Lounge</option>
                <option value="Storage">Storage</option>
                <option value="Acoustics">Acoustics</option>
                <option value="Service">Service</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Sales Price (₹) *</label>
              <Input
                type="number"
                min="0"
                required
                value={formData.salesPrice}
                onChange={(e) => {
                  setFormData({ ...formData, salesPrice: e.target.value });
                  if (errors.salesPrice) setErrors(prev => ({ ...prev, salesPrice: null }));
                }}
                error={errors.salesPrice}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Cost / Purchase (₹)</label>
              <Input
                type="number"
                min="0"
                value={formData.purchasePrice}
                onChange={(e) => {
                  setFormData({ ...formData, purchasePrice: e.target.value });
                  if (errors.purchasePrice) setErrors(prev => ({ ...prev, purchasePrice: null }));
                }}
                error={errors.purchasePrice}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Stock Count</label>
              <Input
                type="number"
                min="0"
                disabled={formData.type === 'Service'}
                value={formData.stock}
                onChange={(e) => {
                  setFormData({ ...formData, stock: e.target.value });
                  if (errors.stock) setErrors(prev => ({ ...prev, stock: null }));
                }}
                error={errors.stock}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Specifications & Description</label>
            <Textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Material, finish, ergonomic specifications"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save Product')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Product Details Modal */}
      {viewingProduct && (
        <Modal
          isOpen={true}
          onClose={() => setViewingProduct(null)}
          title="Product Specifications"
          subtitle={`Catalog overview for ${viewingProduct.code}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-[10px] font-mono text-neutral-400 uppercase">{viewingProduct.code}</span>
              <h3 className="text-base font-bold text-neutral-950 mt-0.5">{viewingProduct.name}</h3>
              <p className="text-neutral-600 mt-2 leading-relaxed">{viewingProduct.description || 'No description provided.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-neutral-200 rounded-md bg-white">
                <span className="text-neutral-400 text-[10px] uppercase font-bold block">Selling Price</span>
                <span className="text-lg font-bold font-mono text-neutral-900">{formatINR(viewingProduct.salesPrice)}</span>
              </div>
              <div className="p-3 border border-neutral-200 rounded-md bg-white">
                <span className="text-neutral-400 text-[10px] uppercase font-bold block">Production Cost</span>
                <span className="text-lg font-bold font-mono text-neutral-500">{formatINR(viewingProduct.purchasePrice)}</span>
              </div>
            </div>

            {/* Profit / Loss Dynamic Indicator Box */}
            {(() => {
              const unitMargin = viewingProduct.salesPrice - (Number(viewingProduct.purchasePrice) || 0);
              const isProfit = unitMargin >= 0;
              const marginPct = viewingProduct.salesPrice > 0 
                ? ((unitMargin / viewingProduct.salesPrice) * 100).toFixed(1)
                : 0;

              return (
                <div
                  className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${
                    isProfit
                      ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]'
                      : 'bg-[#ffebee] text-[#c62828] border-[#ffcdd2]'
                  }`}
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider block opacity-90">
                      {isProfit ? 'Unit Gross Profit' : 'Unit Operating Loss'}
                    </span>
                    <span className="text-base font-bold font-mono">
                      {isProfit ? `+${formatINR(unitMargin)}` : `-${formatINR(Math.abs(unitMargin))}`}
                      <span className="text-xs font-semibold ml-1.5 opacity-80">
                        ({marginPct}% {isProfit ? 'Profit Margin' : 'Negative Margin'})
                      </span>
                    </span>
                  </div>
                  <Badge variant={isProfit ? 'profit' : 'loss'} className="text-[11px] font-bold">
                    {isProfit ? 'PROFIT' : 'LOSS'}
                  </Badge>
                </div>
              );
            })()}

            <div className="p-3 border border-neutral-200 rounded-md bg-white flex items-center justify-between">
              <div>
                <span className="text-neutral-400 text-[10px] uppercase font-bold block">Warehouse Stock</span>
                <span className="font-mono font-bold text-neutral-900 text-sm">
                  {viewingProduct.stock !== null ? `${viewingProduct.stock} Units In Stock` : 'Service item'}
                </span>
              </div>
              <Badge variant={viewingProduct.status === 'Active' ? 'paid' : 'warning'}>
                {viewingProduct.status}
              </Badge>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setViewingProduct(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingProductId}
        onClose={() => setDeletingProductId(null)}
        onConfirm={() => deleteRecord('products', deletingProductId)}
        title="Delete Product SKU"
        message="Are you sure you want to delete this product? Historical invoices referencing this SKU will keep their snapshot."
      />
    </div>
  );
};
