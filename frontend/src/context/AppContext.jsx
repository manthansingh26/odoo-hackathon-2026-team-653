import React, { createContext, useState, useContext, useEffect } from 'react';
import { initialMockData } from '../data/mockData';
import { api } from '../services/api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('urban_furniture_data_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If stored entries have empty lines or 0 totals from previous buggy mappings, restore valid default mock entries
        if (parsed.journalEntries && parsed.journalEntries.some(e => (!e.lines || e.lines.length === 0) && (!e.items || e.items.length === 0))) {
          parsed.journalEntries = initialMockData.journalEntries;
        }
        return parsed;
      } catch (e) {
        console.error("Could not parse saved local data", e);
      }
    }
    return initialMockData;
  });

  // Pre-configured Demo Personas for instant testing
  const demoUsers = {
    Admin: {
      id: 'usr-admin',
      name: 'Aarav Mehta',
      email: 'admin@urbanfurniture.in',
      role: 'Admin',
      title: 'Managing Director & ERP Administrator',
      company: 'Urban Furniture Pvt. Ltd.'
    },
    Accountant: {
      id: 'usr-acct',
      name: 'Priya Sharma',
      email: 'accounts@urbanfurniture.in',
      role: 'Accountant',
      title: 'Senior Chartered Accountant',
      company: 'Urban Furniture Pvt. Ltd.'
    },
    'Contact User': {
      id: 'usr-client',
      name: 'Nimesh Pathak',
      email: 'nimesh.pathak@techcraft.io',
      role: 'Contact User',
      title: 'Key Client / Procurement Head',
      company: 'TechCraft Solutions',
      contactId: 'C-101'
    }
  };

  // Clean up legacy v1 auto-auth keys that forced Admin login
  try {
    if (localStorage.getItem('urban_furniture_auth_v1')) {
      localStorage.removeItem('urban_furniture_auth_v1');
      localStorage.removeItem('urban_furniture_user_v1');
    }
  } catch (_e) {
    // ignore
  }

  // Deterministic synchronous auth hydration from localStorage
  const getInitialAuth = () => {
    try {
      const isAuth = localStorage.getItem('urban_furniture_auth_v2') === 'true';
      const savedUser = localStorage.getItem('urban_furniture_user_v2');
      if (isAuth && savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && (parsed.id || parsed.email)) {
          return {
            currentUser: parsed,
            isAuthenticated: true,
            userRole: parsed.role || 'Admin',
            activeContactId: parsed.contactId || 'C-101',
            authInitialized: true
          };
        }
      }
    } catch (e) {
      console.error("Could not parse saved auth state", e);
    }
    return {
      currentUser: null,
      isAuthenticated: false,
      userRole: 'Admin',
      activeContactId: 'C-101',
      authInitialized: true
    };
  };

  const initialAuth = getInitialAuth();
  const [currentUser, setCurrentUser] = useState(initialAuth.currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth.isAuthenticated);
  const [userRole, setUserRoleState] = useState(initialAuth.userRole);
  const [activeContactId, setActiveContactId] = useState(initialAuth.activeContactId);
  const [authInitialized] = useState(initialAuth.authInitialized);

  // Command palette & notification popover states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active quick action modal: { type: string, payload?: any } | null
  const [activeModal, setActiveModal] = useState(null);

  // Toast notifications array: [{ id, title, message, type: 'success'|'error'|'info' }]
  const [toasts, setToasts] = useState([]);

  // Persist data locally so reloads don't wipe newly created invoices/entries
  useEffect(() => {
    localStorage.setItem('urban_furniture_data_v1', JSON.stringify(data));
  }, [data]);

  // Live PostgreSQL integration via Express backend API
  useEffect(() => {
    let isMounted = true;

    async function loadBackendData() {
      try {
        let token = localStorage.getItem('urban_furniture_jwt_token');
        if (!token) {
          const authUser = currentUser || demoUsers[userRole] || demoUsers['Admin'];
          const authRes = await api.login({
            email: authUser.email || 'admin@urbanfurniture.in',
            role: authUser.role || 'Admin',
          });
          if (authRes?.token) {
            localStorage.setItem('urban_furniture_jwt_token', authRes.token);
          }
        }
      } catch (_authErr) {
        // continue
      }

      try {
        const health = await api.getHealth();
        if (health?.status === 'ok') {
          console.log('[API] Connected to Urban Furniture Backend:', health.message);
        }
      } catch (err) {
        console.warn('[API] Health check warning:', err.message);
      }

      try {
        const summary = await api.getDashboardSummary();
        if (isMounted && summary) {
          setData(prev => ({
            ...prev,
            kpi: {
              ...prev.kpi,
              totalSales: summary.totalSales ?? prev.kpi?.totalSales,
              totalPurchases: summary.totalPurchases ?? prev.kpi?.totalPurchases,
              netProfit: summary.netProfit ?? prev.kpi?.netProfit,
              outstandingReceivables: summary.receivable ?? prev.kpi?.outstandingReceivables,
            },
            recentTransactions: summary.recentTransactions && summary.recentTransactions.length > 0
              ? summary.recentTransactions.map(tx => ({
                id: tx.id,
                date: tx.transactionDate ? tx.transactionDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
                reference: tx.reference,
                contact: tx.contact?.name || 'Contact',
                type: tx.type === 'SALE' ? 'Sales' : tx.type === 'PURCHASE' ? 'Purchase' : tx.type,
                amount: Number(tx.amount || 0),
                status: tx.status === 'PAID' ? 'Paid' : tx.status === 'PENDING' ? 'Pending' : tx.status,
                paymentMethod: 'Bank'
              }))
              : prev.recentTransactions
          }));
        }
      } catch (err) {
        console.warn('[API] Dashboard summary warning:', err.message);
      }

      try {
        const contacts = await api.getContacts();
        if (isMounted && Array.isArray(contacts) && contacts.length > 0) {
          const mappedContacts = contacts.map(c => ({
            id: c.id,
            name: c.name,
            type: c.type === 'CUSTOMER' ? 'Customer' : c.type === 'VENDOR' ? 'Vendor' : (c.type || 'Customer'),
            email: c.email || '',
            mobile: c.phone || '',
            phone: c.phone || '',
            address: 'Commercial Hub',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            outstanding: 0,
            status: 'Active',
            favorite: false,
            createdAt: c.createdAt ? c.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10)
          }));
          setData(prev => ({
            ...prev,
            contacts: mappedContacts
          }));

          const nimesh = contacts.find(c => c.email === 'nimesh.pathak@techcraft.io');
          if (nimesh) {
            setActiveContactId(nimesh.id);
          }
        }
      } catch (err) {
        console.warn('[API] Contacts fetch warning:', err.message);
      }

      try {
        const products = await api.getProducts();
        if (isMounted && Array.isArray(products) && products.length > 0) {
          const mappedProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            code: p.sku || 'FUR-001',
            sku: p.sku || 'FUR-001',
            type: 'Goods',
            category: p.sku?.includes('CHR') ? 'Seating' : p.sku?.includes('DSK') ? 'Desks' : p.sku?.includes('TBL') ? 'Tables' : p.sku?.includes('SOF') ? 'Lounge' : p.sku?.includes('BED') ? 'Beds' : p.sku?.includes('WRD') ? 'Wardrobes' : 'Storage',
            salesPrice: Number(p.price || 0),
            purchasePrice: Math.round(Number(p.price || 0) * 0.65),
            stock: Number(p.stock || 0),
            minStock: 10,
            status: Number(p.stock || 0) <= 5 ? 'Low Stock' : 'Active',
            favorite: false,
            description: p.name
          }));
          setData(prev => ({
            ...prev,
            products: mappedProducts
          }));
        }
      } catch (err) {
        console.warn('[API] Products fetch warning:', err.message);
      }

      try {
        const transactions = await api.getTransactions();
        if (isMounted && Array.isArray(transactions) && transactions.length > 0) {
          const mappedTx = transactions.map(tx => ({
            id: tx.id,
            date: tx.transactionDate ? tx.transactionDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
            reference: tx.reference,
            contact: tx.contact?.name || 'Contact',
            contactId: tx.contactId,
            type: tx.type === 'SALE' ? 'Sales' : tx.type === 'PURCHASE' ? 'Purchase' : tx.type,
            amount: Number(tx.amount || 0),
            status: tx.status === 'PAID' ? 'Paid' : tx.status === 'PENDING' ? 'Pending' : tx.status,
            paymentMethod: 'Bank'
          }));

          const salesTx = transactions.filter(t => t.type === 'SALE');
          const purchaseTx = transactions.filter(t => t.type === 'PURCHASE');
          const paidTx = transactions.filter(t => t.status === 'PAID');

          const mappedInvoices = salesTx.map((tx, idx) => {
            const amt = Number(tx.amount || 0);
            const isPaid = tx.status === 'PAID';
            const dateStr = tx.transactionDate ? tx.transactionDate.slice(0, 10) : new Date().toISOString().slice(0, 10);
            const dueDate = new Date(new Date(dateStr).getTime() + 14 * 86400000).toISOString().slice(0, 10);
            const subtotal = Math.round((amt / 1.18) * 100) / 100;
            const tax = Math.round((amt - subtotal) * 100) / 100;

            return {
              id: tx.reference,
              orderId: `SO-2026-${String(idx + 1).padStart(3, '0')}`,
              contactId: tx.contactId,
              customerName: tx.contact?.name || 'Commercial Client',
              customerEmail: tx.contact?.email || '',
              customerAddress: 'Commercial Hub',
              date: dateStr,
              dueDate,
              items: [
                {
                  productId: 'FUR-COMM',
                  productName: `Commercial Furniture Order (${tx.reference})`,
                  quantity: 1,
                  unitPrice: subtotal,
                  taxRate: 18,
                  total: amt
                }
              ],
              subtotal,
              tax,
              discount: 0,
              grandTotal: amt,
              amountPaid: isPaid ? amt : 0,
              status: isPaid ? 'Paid' : 'Pending',
              paymentMethod: isPaid ? 'Bank Transfer' : 'Pending',
              notes: `Invoice ${tx.reference} for ${tx.contact?.name || 'Customer'}`
            };
          });

          const mappedSalesOrders = salesTx.map((tx, idx) => {
            const amt = Number(tx.amount || 0);
            const dateStr = tx.transactionDate ? tx.transactionDate.slice(0, 10) : new Date().toISOString().slice(0, 10);
            const deliveryDate = new Date(new Date(dateStr).getTime() + 7 * 86400000).toISOString().slice(0, 10);
            const subtotal = Math.round((amt / 1.18) * 100) / 100;
            const tax = Math.round((amt - subtotal) * 100) / 100;

            return {
              id: `SO-2026-${String(idx + 1).padStart(3, '0')}`,
              date: dateStr,
              contactId: tx.contactId,
              customerName: tx.contact?.name || 'Commercial Client',
              expectedDelivery: deliveryDate,
              items: [
                {
                  productId: 'FUR-COMM',
                  productName: `Furniture Specification Order (${tx.reference})`,
                  quantity: 1,
                  unitPrice: subtotal,
                  taxRate: 18,
                  total: amt
                }
              ],
              subtotal,
              tax,
              discount: 0,
              grandTotal: amt,
              status: 'Confirmed'
            };
          });

          const mappedBills = purchaseTx.map((tx, idx) => {
            const amt = Number(tx.amount || 0);
            const isPaid = tx.status === 'PAID';
            const dateStr = tx.transactionDate ? tx.transactionDate.slice(0, 10) : new Date().toISOString().slice(0, 10);
            const dueDate = new Date(new Date(dateStr).getTime() + 30 * 86400000).toISOString().slice(0, 10);

            return {
              id: tx.reference,
              poReference: `PO-2026-${String(idx + 1).padStart(3, '0')}`,
              vendorId: tx.contactId,
              vendorName: tx.contact?.name || 'Raw Material Supplier',
              vendorInvoiceNumber: `VN-${String(idx + 1001)}`,
              date: dateStr,
              dueDate,
              items: [
                {
                  description: `Procurement Consignment (${tx.reference})`,
                  quantity: 1,
                  unitPrice: amt,
                  total: amt
                }
              ],
              subtotal: amt,
              tax: 0,
              total: amt,
              amountPaid: isPaid ? amt : 0,
              status: isPaid ? 'Paid' : 'Pending'
            };
          });

          const mappedPurchaseOrders = purchaseTx.map((tx, idx) => {
            const amt = Number(tx.amount || 0);
            const dateStr = tx.transactionDate ? tx.transactionDate.slice(0, 10) : new Date().toISOString().slice(0, 10);
            const expectedDate = new Date(new Date(dateStr).getTime() + 10 * 86400000).toISOString().slice(0, 10);

            return {
              id: `PO-2026-${String(idx + 1).padStart(3, '0')}`,
              date: dateStr,
              vendorId: tx.contactId,
              vendorName: tx.contact?.name || 'Raw Material Supplier',
              expectedDate,
              items: [
                {
                  productId: 'MAT-RAW',
                  productName: `Raw Materials & Hardware (${tx.reference})`,
                  quantity: 1,
                  unitPrice: amt,
                  total: amt
                }
              ],
              totalAmount: amt,
              status: 'Confirmed'
            };
          });

          const mappedPayments = paidTx.map((tx, idx) => {
            const amt = Number(tx.amount || 0);
            const isSale = tx.type === 'SALE';
            const dateStr = tx.transactionDate ? tx.transactionDate.slice(0, 10) : new Date().toISOString().slice(0, 10);

            return {
              id: `PAY-2026-${String(idx + 1).padStart(3, '0')}`,
              date: dateStr,
              reference: `NEFT-HDFC-${Math.floor(100000 + (idx * 37) % 900000)}`,
              type: isSale ? 'Customer Payment' : 'Vendor Payment',
              contactId: tx.contactId,
              contactName: tx.contact?.name || 'Contact',
              invoiceBillId: tx.reference,
              method: 'Bank',
              amount: amt,
              status: 'Completed',
              notes: `Payment settlement for ${tx.reference}`
            };
          });

          setData(prev => ({
            ...prev,
            transactions: mappedTx,
            recentTransactions: mappedTx,
            invoices: mappedInvoices,
            salesOrders: mappedSalesOrders,
            bills: mappedBills,
            purchaseOrders: mappedPurchaseOrders,
            payments: mappedPayments
          }));
        }
      } catch (err) {
        console.warn('[API] Transactions fetch warning:', err.message);
      }

      try {
        const entries = await api.getJournalEntries();
        if (isMounted && Array.isArray(entries) && entries.length > 0) {
          const mappedEntries = entries.map(entry => {
            const rawDate = entry.transactionDate || entry.date || entry.createdAt || new Date().toISOString();
            const dateStr = typeof rawDate === 'string' ? rawDate.slice(0, 10) : new Date(rawDate).toISOString().slice(0, 10);

            // Backend Prisma model returns items array
            const rawItems = entry.items || entry.lines || [];
            const mappedLines = rawItems.map(l => ({
              id: l.id,
              accountId: l.accountId || 'ACC-1000',
              accountName: l.accountName || l.account?.name || 'General Account',
              description: l.description || '',
              debit: Number(l.debit || 0),
              credit: Number(l.credit || 0)
            }));

            const totalDebit = entry.totalDebit !== undefined && Number(entry.totalDebit) > 0
              ? Number(entry.totalDebit)
              : mappedLines.reduce((sum, l) => sum + l.debit, 0);

            const totalCredit = entry.totalCredit !== undefined && Number(entry.totalCredit) > 0
              ? Number(entry.totalCredit)
              : mappedLines.reduce((sum, l) => sum + l.credit, 0);

            const journalName = entry.journal || (
              entry.transaction?.type === 'SALE'
                ? 'Sales Journal'
                : entry.transaction?.type === 'PURCHASE'
                  ? 'Purchase Journal'
                  : 'General Journal'
            );

            return {
              id: entry.id,
              journal: journalName,
              date: dateStr,
              transactionDate: rawDate,
              reference: entry.reference || entry.entryNumber || entry.id,
              description: entry.description || entry.notes || `Journal Entry ${entry.reference || entry.id}`,
              lines: mappedLines,
              items: mappedLines,
              totalDebit,
              totalCredit,
              status: entry.status || 'Posted'
            };
          });

          // Derive chart of account balances directly from the database journal items
          let cashBal = 65400;
          let arBal = 0;
          let invBal = 0;
          let apBal = 0;
          let revBal = 0;

          mappedEntries.forEach(entry => {
            (entry.lines || []).forEach(line => {
              const d = Number(line.debit || 0);
              const c = Number(line.credit || 0);
              const acct = line.accountName;
              if (acct === 'Cash') {
                cashBal += (d - c);
              } else if (acct === 'Accounts Receivable') {
                arBal += (d - c);
              } else if (acct === 'Inventory') {
                invBal += (d - c);
              } else if (acct === 'Accounts Payable') {
                apBal += (c - d);
              } else if (acct === 'Sales Revenue') {
                revBal += (c - d);
              }
            });
          });

          const expBal = invBal;
          const netProfit = revBal - expBal;
          const totalAssets = cashBal + arBal + invBal + 750000;
          const totalLiabilities = apBal + 68400 + 350000;
          const ownerCapital = totalAssets - totalLiabilities - netProfit;

          const updatedAccounts = [
            { id: "ACC-1010", code: "1010", name: "Cash", category: "Assets", type: "Asset", balance: Math.max(0, cashBal), status: "Active" },
            { id: "ACC-1100", code: "1100", name: "Accounts Receivable", category: "Assets", type: "Asset", balance: Math.max(0, arBal), status: "Active" },
            { id: "ACC-1200", code: "1200", name: "Inventory", category: "Assets", type: "Asset", balance: Math.max(0, invBal), status: "Active" },
            { id: "ACC-1500", code: "1500", name: "Showroom Plant & Equipment", category: "Assets", type: "Asset", balance: 750000, status: "Active" },
            { id: "ACC-2010", code: "2010", name: "Accounts Payable", category: "Liabilities", type: "Liability", balance: Math.max(0, apBal), status: "Active" },
            { id: "ACC-2050", code: "2050", name: "Output GST Payable (18%)", category: "Liabilities", type: "Liability", balance: 68400, status: "Active" },
            { id: "ACC-2080", code: "2080", name: "Bank Term Loan (HDFC)", category: "Liabilities", type: "Liability", balance: 350000, status: "Active" },
            { id: "ACC-3010", code: "3010", name: "Owner Capital / Equity", category: "Capital", type: "Capital", balance: Math.max(0, ownerCapital), status: "Active" },
            { id: "ACC-4010", code: "4010", name: "Sales Revenue", category: "Income", type: "Income", balance: Math.max(0, revBal), status: "Active" },
            { id: "ACC-5010", code: "5010", name: "Cost of Goods Sold (Purchases)", category: "Expenses", type: "Expense", balance: Math.max(0, expBal), status: "Active" }
          ];

          setData(prev => ({
            ...prev,
            journalEntries: mappedEntries,
            accounts: updatedAccounts
          }));
        }
      } catch (err) {
        console.warn('[API] Journal entries fetch warning:', err.message);
      }
    }

    loadBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronized Role Switcher (updates role, active user profile, and contact ID)
  const setUserRole = (newRole) => {
    setUserRoleState(newRole);
    if (demoUsers[newRole]) {
      const selected = demoUsers[newRole];
      setCurrentUser(selected);
      if (selected.contactId) {
        setActiveContactId(selected.contactId);
      }
      if (isAuthenticated) {
        try {
          localStorage.setItem('urban_furniture_user_v2', JSON.stringify(selected));
          localStorage.setItem('urban_furniture_auth_v2', 'true');
        } catch (err) {
          console.error("Storage error updating role", err);
        }
      }
    }
    addToast({
      title: "Role Switched",
      message: `Perspective updated to: ${newRole}`,
      type: "info"
    });
  };

  // Authentication methods
  const login = (email, password, role = 'Admin') => {
    // API backend authentication
    api.login({ email, role }).then(res => {
      if (res?.token) {
        localStorage.setItem('urban_furniture_jwt_token', res.token);
      }
    }).catch(err => console.warn('[API] Login sync warning:', err.message));

    // If a demo user matches role or email
    const matchedUser = Object.values(demoUsers).find(
      u => u.email.toLowerCase() === email.toLowerCase() || u.role === role
    ) || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      title: `${role} User`,
      company: 'Urban Furniture'
    };

    const finalUser = { ...matchedUser, role };
    try {
      localStorage.setItem('urban_furniture_user_v2', JSON.stringify(finalUser));
      localStorage.setItem('urban_furniture_auth_v2', 'true');
    } catch (err) {
      console.error("Storage error during login", err);
    }

    setCurrentUser(finalUser);
    setUserRoleState(role);
    setIsAuthenticated(true);
    if (role === 'Contact User') {
      setActiveContactId(finalUser.contactId || 'C-101');
    }

    addToast({
      title: "Welcome Back",
      message: `Signed in as ${finalUser.name} (${role})`,
      type: "success"
    });
    return true;
  };

  const signup = ({ name, email, password: _password, role = 'Admin', company = 'Urban Furniture' }) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      company,
      title: `${role} Registered`,
      contactId: role === 'Contact User' ? `C-${Math.floor(100 + Math.random() * 900)}` : null
    };

    // If registered as Contact User, also create a contact master entry
    if (role === 'Contact User') {
      const newContact = {
        id: newUser.contactId,
        name,
        type: 'Customer',
        email,
        mobile: '+91 98000 00000',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        outstanding: 0,
        status: 'Active',
        favorite: false,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setData(prev => ({
        ...prev,
        contacts: [newContact, ...(prev.contacts || [])]
      }));
      setActiveContactId(newUser.contactId);
    }

    try {
      localStorage.setItem('urban_furniture_user_v2', JSON.stringify(newUser));
      localStorage.setItem('urban_furniture_auth_v2', 'true');
    } catch (err) {
      console.error("Storage error during signup", err);
    }

    // Backend auth sync
    api.login({ email, role }).then(res => {
      if (res?.token) {
        localStorage.setItem('urban_furniture_jwt_token', res.token);
      }
    }).catch(() => { });

    setCurrentUser(newUser);
    setUserRoleState(role);
    setIsAuthenticated(true);

    addToast({
      title: "Account Created",
      message: `Welcome ${name}! Your ${role} account is ready.`,
      type: "success"
    });
    return true;
  };

  const logout = () => {
    try {
      localStorage.removeItem('urban_furniture_user_v2');
      localStorage.removeItem('urban_furniture_jwt_token');
      localStorage.setItem('urban_furniture_auth_v2', 'false');
    } catch (err) {
      console.error("Storage error during logout", err);
    }
    api.logout().catch(() => { });
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserRoleState('Admin');
    addToast({
      title: "Logged Out",
      message: "You have securely signed out of Urban Furniture ERP.",
      type: "info"
    });
  };

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (toast) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Generic CRUD
  const addRecord = (collection, record) => {
    const newRecord = {
      ...record,
      id: record.id || `${collection.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`
    };
    setData(prev => ({
      ...prev,
      [collection]: [newRecord, ...(prev[collection] || [])]
    }));
    addToast({
      title: "Success",
      message: `Created new item in ${collection}`,
      type: "success"
    });

    // Asynchronously persist to backend API if applicable
    if (collection === 'contacts') {
      api.createContact({
        name: record.name,
        type: (record.type || 'Customer').toUpperCase(),
        email: record.email || '',
        phone: record.mobile || record.phone || '',
        pincode: record.pincode || '',
      }).catch(err => console.warn('[API] Contact sync warning:', err.message));
    } else if (collection === 'products') {
      api.createProduct({
        name: record.name,
        sku: record.code || record.sku || `SKU-${Date.now().toString().slice(-4)}`,
        price: Number(record.salesPrice || record.price || 0),
        stock: Number(record.stock || 0),
      }).catch(err => console.warn('[API] Product sync warning:', err.message));
    } else if (collection === 'invoices') {
      api.createInvoice({
        contactId: record.contactId,
        reference: record.id,
        items: record.items || [],
        discount: record.discount || 0,
        date: record.date,
        dueDate: record.dueDate,
        grandTotal: record.grandTotal,
      }).then(res => {
        if (res?.journalEntry) {
          api.getJournalEntries().then(entries => {
            if (Array.isArray(entries)) setData(prev => ({ ...prev, journalEntries: entries }));
          }).catch(() => { });
        }
      }).catch(err => console.warn('[API] Invoice sync warning:', err.message));
    } else if (collection === 'bills') {
      api.createBill({
        vendorId: record.vendorId || record.contactId,
        reference: record.id,
        amount: record.total || record.subtotal || record.amount,
        date: record.date,
        dueDate: record.dueDate,
        vendorInvNo: record.vendorInvoiceNumber,
        description: record.items?.[0]?.description,
      }).then(res => {
        if (res?.journalEntry) {
          api.getJournalEntries().then(entries => {
            if (Array.isArray(entries)) setData(prev => ({ ...prev, journalEntries: entries }));
          }).catch(() => { });
        }
      }).catch(err => console.warn('[API] Bill sync warning:', err.message));
    } else if (collection === 'payments') {
      api.createPayment({
        contactId: record.contactId,
        type: record.type,
        amount: record.amount,
        date: record.date,
        method: record.method || 'Bank',
        reference: record.reference || record.id,
        invoiceBillId: record.invoiceBillId,
        notes: record.notes,
      }).then(res => {
        if (res?.journalEntry) {
          api.getJournalEntries().then(entries => {
            if (Array.isArray(entries)) setData(prev => ({ ...prev, journalEntries: entries }));
          }).catch(() => { });
        }
      }).catch(err => console.warn('[API] Payment sync warning:', err.message));
    } else if (collection === 'salesOrders') {
      api.createSalesOrder({
        contactId: record.contactId,
        reference: record.id,
        amount: record.grandTotal || record.totalAmount,
        items: record.items,
        date: record.date,
      }).catch(err => console.warn('[API] Sales order sync warning:', err.message));
    } else if (collection === 'purchaseOrders') {
      api.createPurchaseOrder({
        vendorId: record.vendorId || record.contactId,
        reference: record.id,
        amount: record.totalAmount,
        items: record.items,
        date: record.date,
      }).catch(err => console.warn('[API] Purchase order sync warning:', err.message));
    } else if (collection === 'transactions') {
      api.createTransaction({
        type: (record.type || 'SALE').toUpperCase() === 'SALES' ? 'SALE' : (record.type || 'SALE').toUpperCase(),
        reference: record.reference || `TX-${Date.now().toString().slice(-4)}`,
        contactId: record.contactId,
        amount: Number(record.amount || 0),
        status: (record.status || 'PAID').toUpperCase(),
        transactionDate: record.date || new Date().toISOString(),
      }).catch(err => console.warn('[API] Transaction sync warning:', err.message));
    } else if (collection === 'journalEntries') {
      const cleanLines = (record.lines || record.items || []).map(l => ({
        accountName: (l.accountName || 'General Account').trim(),
        debit: Number(l.debit || 0),
        credit: Number(l.credit || 0),
      }));

      api.createJournalEntry({
        reference: record.reference || record.id || `JE-${Date.now().toString().slice(-4)}`,
        description: (record.description || record.notes || 'General Journal Entry').trim(),
        transactionDate: record.transactionDate || (record.date ? new Date(record.date).toISOString() : new Date().toISOString()),
        lines: cleanLines,
      }).then(res => {
        if (res?.entry) {
          setData(prev => ({
            ...prev,
            journalEntries: (prev.journalEntries || []).map(e =>
              (e.id === record.id || e.reference === record.reference)
                ? {
                  ...e,
                  id: res.entry.id,
                  reference: res.entry.reference,
                  transactionDate: res.entry.transactionDate,
                  totalDebit: res.totalDebit !== undefined ? Number(res.totalDebit) : e.totalDebit,
                  totalCredit: res.totalCredit !== undefined ? Number(res.totalCredit) : e.totalCredit,
                }
                : e
            ),
          }));
        }
      }).catch(err => console.warn('[API] Journal entry sync warning:', err.message));
    }

    return newRecord;
  };

  const updateRecord = (collection, id, updatedRecord) => {
    setData(prev => ({
      ...prev,
      [collection]: (prev[collection] || []).map(item =>
        item.id === id ? { ...item, ...updatedRecord } : item
      ),
    }));
    addToast({
      title: "Updated",
      message: `Successfully updated record #${id}`,
      type: "info",
    });

    // Backend sync for status updates
    if (collection === 'invoices' && updatedRecord.status === 'Paid') {
      api.payInvoice(id, {
        method: updatedRecord.paymentMethod || 'Bank',
        amount: updatedRecord.amountPaid,
      }).then(() => {
        api.getJournalEntries().then(entries => {
          if (Array.isArray(entries)) setData(prev => ({ ...prev, journalEntries: entries }));
        }).catch(() => { });
      }).catch(err => console.warn('[API] Invoice payment sync warning:', err.message));
    } else if (collection === 'bills' && updatedRecord.status === 'Paid') {
      api.payBill(id, {
        method: updatedRecord.paymentMethod || 'Bank',
        amount: updatedRecord.amountPaid,
      }).then(() => {
        api.getJournalEntries().then(entries => {
          if (Array.isArray(entries)) setData(prev => ({ ...prev, journalEntries: entries }));
        }).catch(() => { });
      }).catch(err => console.warn('[API] Bill payment sync warning:', err.message));
    }
  };

  const deleteRecord = (collection, id) => {
    setData(prev => ({
      ...prev,
      [collection]: (prev[collection] || []).filter(item => item.id !== id)
    }));
    addToast({
      title: "Deleted",
      message: `Deleted record #${id}`,
      type: "info"
    });
  };

  const toggleFavorite = (collection, id) => {
    setData(prev => ({
      ...prev,
      [collection]: (prev[collection] || []).map(item =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    }));
  };

  const markNotificationRead = (notifId) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notifId ? { ...n, read: true } : n
      )
    }));
  };

  const clearAllNotifications = () => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  const resetAllData = () => {
    localStorage.removeItem('urban_furniture_data_v1');
    setData(initialMockData);
    addToast({
      title: "Data Reset",
      message: "Reset all mock data to defaults",
      type: "info"
    });
  };

  // Indian Rupee formatting utility
  const formatINR = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "₹0";
    const num = Math.round(Number(val));
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <AppContext.Provider
      value={{
        data,
        currentUser,
        isAuthenticated,
        authInitialized,
        userRole,
        setUserRole,
        demoUsers,
        login,
        signup,
        logout,
        activeContactId,
        setActiveContactId,
        isSearchOpen,
        setIsSearchOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        activeModal,
        setActiveModal,
        toasts,
        addToast,
        removeToast,
        addRecord,
        updateRecord,
        deleteRecord,
        toggleFavorite,
        markNotificationRead,
        clearAllNotifications,
        resetAllData,
        formatINR,
        api
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
