import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Package, Receipt, ShoppingCart, CreditCard, BookOpen, ArrowRight, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const GlobalSearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, data, formatINR } = useAppContext();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Search across collections
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matches = [];

    // Contacts
    (data.contacts || []).forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.mobile.includes(q)) {
        matches.push({
          type: 'Contact',
          icon: Users,
          title: c.name,
          subtitle: `${c.type} • ${c.city} • Outstanding: ${formatINR(c.outstanding)}`,
          url: '/contacts'
        });
      }
    });

    // Products
    (data.products || []).forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
        matches.push({
          type: 'Product',
          icon: Package,
          title: p.name,
          subtitle: `${p.code} • ${formatINR(p.salesPrice)} • Stock: ${p.stock !== null ? p.stock : 'N/A'}`,
          url: '/products'
        });
      }
    });

    // Invoices
    (data.invoices || []).forEach(inv => {
      if (inv.id.toLowerCase().includes(q) || inv.customerName.toLowerCase().includes(q)) {
        matches.push({
          type: 'Invoice',
          icon: Receipt,
          title: `${inv.id} - ${inv.customerName}`,
          subtitle: `Amount: ${formatINR(inv.grandTotal)} • Status: ${inv.status}`,
          url: '/invoices'
        });
      }
    });

    // Bills
    (data.bills || []).forEach(b => {
      if (b.id.toLowerCase().includes(q) || b.vendorName.toLowerCase().includes(q)) {
        matches.push({
          type: 'Vendor Bill',
          icon: ShoppingCart,
          title: `${b.id} - ${b.vendorName}`,
          subtitle: `Amount: ${formatINR(b.total)} • Status: ${b.status}`,
          url: '/vendor-bills'
        });
      }
    });

    // Payments
    (data.payments || []).forEach(pay => {
      if (pay.id.toLowerCase().includes(q) || pay.contactName.toLowerCase().includes(q) || pay.reference.toLowerCase().includes(q)) {
        matches.push({
          type: 'Payment',
          icon: CreditCard,
          title: `${pay.id} - ${pay.contactName}`,
          subtitle: `${pay.reference} • ${formatINR(pay.amount)} via ${pay.method}`,
          url: '/payments'
        });
      }
    });

    // Journal Entries
    (data.journalEntries || []).forEach(je => {
      if (je.id.toLowerCase().includes(q) || je.journal.toLowerCase().includes(q) || je.description.toLowerCase().includes(q)) {
        matches.push({
          type: 'Journal Entry',
          icon: BookOpen,
          title: `${je.id} (${je.journal})`,
          subtitle: `${je.description} • ${formatINR(je.totalDebit)}`,
          url: '/journal-entries'
        });
      }
    });

    return matches.slice(0, 8);
  }, [query, data, formatINR]);

  if (!isSearchOpen) return null;

  const handleSelect = (url) => {
    setIsSearchOpen(false);
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-neutral-200">
          <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts, products, invoices, bills, ledger..."
            className="w-full py-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 border border-neutral-200 rounded-sm">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-xs text-neutral-400">
              Type anything to search across Urban Furniture ERP records...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              No results found for "<span className="font-semibold text-neutral-800">{query}</span>"
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res, i) => {
                const IconComponent = res.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(res.url)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-100 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-md bg-neutral-100 group-hover:bg-white text-neutral-700 border border-neutral-200 shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-neutral-900 group-hover:text-black truncate">
                            {res.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-neutral-200 text-neutral-700 uppercase font-mono">
                            {res.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {res.subtitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>Urban Accounting Quick Search</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
};
