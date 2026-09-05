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
        return JSON.parse(saved);
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

  // Auth state persisted in localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('urban_furniture_user_v1');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Could not parse saved user", e);
      }
    }
    return demoUsers.Admin;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('urban_furniture_auth_v1') !== 'false';
  });

  // User role: 'Admin' | 'Accountant' | 'Contact User'
  const [userRole, setUserRoleState] = useState(currentUser?.role || 'Admin');
  
  // For Contact User view, active contact ID (defaults to Nimesh Pathak C-101)
  const [activeContactId, setActiveContactId] = useState(currentUser?.contactId || 'C-101');

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
            address: c.address || 'Commercial Hub',
            city: c.city || 'Mumbai',
            state: c.state || 'Maharashtra',
            pincode: c.pincode || '400001',
            outstanding: c.outstanding !== undefined ? Number(c.outstanding) : 0,
            status: c.status || 'Active',
            favorite: Boolean(c.favorite),
            createdAt: c.createdAt ? c.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10)
          }));
          setData(prev => ({
            ...prev,
            contacts: mappedContacts
          }));
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
            code: p.sku || p.code || 'FUR-001',
            sku: p.sku || p.code || 'FUR-001',
            type: 'Goods',
            category: p.category || 'Furniture',
            salesPrice: Number(p.price || 0),
            purchasePrice: p.purchasePrice !== undefined ? Number(p.purchasePrice) : Math.round(Number(p.price || 0) * 0.7),
            stock: Number(p.stock || 0),
            minStock: 10,
            status: 'Active',
            favorite: false,
            description: p.description || p.name
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
            type: tx.type === 'SALE' ? 'Sales' : tx.type === 'PURCHASE' ? 'Purchase' : tx.type,
            amount: Number(tx.amount || 0),
            status: tx.status === 'PAID' ? 'Paid' : tx.status === 'PENDING' ? 'Pending' : tx.status,
            paymentMethod: 'Bank'
          }));
          setData(prev => ({
            ...prev,
            transactions: mappedTx,
            recentTransactions: mappedTx
          }));
        }
      } catch (err) {
        console.warn('[API] Transactions fetch warning:', err.message);
      }

      try {
        const entries = await api.getJournalEntries();
        if (isMounted && Array.isArray(entries) && entries.length > 0) {
          const mappedEntries = entries.map(entry => ({
            id: entry.id,
            journal: 'General Journal',
            date: entry.date ? entry.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
            reference: entry.reference || entry.entryNumber,
            description: entry.notes || `Journal Entry ${entry.entryNumber}`,
            lines: (entry.lines || []).map(l => ({
              accountId: l.accountId || 'ACC-1000',
              accountName: l.accountName || l.account?.name || 'Account',
              description: l.description || '',
              debit: Number(l.debit || 0),
              credit: Number(l.credit || 0)
            })),
            totalDebit: (entry.lines || []).reduce((sum, l) => sum + Number(l.debit || 0), 0),
            totalCredit: (entry.lines || []).reduce((sum, l) => sum + Number(l.credit || 0), 0),
            status: 'Posted'
          }));
          setData(prev => ({
            ...prev,
            journalEntries: mappedEntries
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

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('urban_furniture_user_v1', JSON.stringify(currentUser));
      localStorage.setItem('urban_furniture_auth_v1', 'true');
    } else {
      localStorage.removeItem('urban_furniture_user_v1');
      localStorage.setItem('urban_furniture_auth_v1', 'false');
    }
  }, [currentUser]);

  // Synchronized Role Switcher (updates role, active user profile, and contact ID)
  const setUserRole = (newRole) => {
    setUserRoleState(newRole);
    if (demoUsers[newRole]) {
      const selected = demoUsers[newRole];
      setCurrentUser(selected);
      if (selected.contactId) {
        setActiveContactId(selected.contactId);
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

  const signup = ({ name, email, password, role = 'Admin', company = 'Urban Furniture' }) => {
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
    setIsAuthenticated(false);
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
        phone: record.mobile || record.phone || ''
      }).catch(err => console.warn('[API] Contact sync warning:', err.message));
    } else if (collection === 'products') {
      api.createProduct({
        name: record.name,
        sku: record.code || record.sku || `SKU-${Date.now().toString().slice(-4)}`,
        price: Number(record.salesPrice || record.price || 0),
        stock: Number(record.stock || 0)
      }).catch(err => console.warn('[API] Product sync warning:', err.message));
    } else if (collection === 'transactions' || collection === 'recentTransactions') {
      api.createTransaction({
        type: (record.type || 'SALE').toUpperCase() === 'SALES' ? 'SALE' : (record.type || 'SALE').toUpperCase(),
        reference: record.reference || `TX-${Date.now().toString().slice(-4)}`,
        contactId: record.contactId,
        amount: Number(record.amount || 0),
        status: (record.status || 'PAID').toUpperCase(),
        transactionDate: record.date || new Date().toISOString()
      }).catch(err => console.warn('[API] Transaction sync warning:', err.message));
    } else if (collection === 'journalEntries') {
      api.createJournalEntry({
        entryNumber: record.id || `JE-${Date.now().toString().slice(-4)}`,
        date: record.date || new Date().toISOString(),
        reference: record.reference || '',
        notes: record.description || '',
        lines: record.lines || []
      }).catch(err => console.warn('[API] Journal entry sync warning:', err.message));
    }

    return newRecord;
  };

  const updateRecord = (collection, id, updatedRecord) => {
    setData(prev => ({
      ...prev,
      [collection]: (prev[collection] || []).map(item =>
        item.id === id ? { ...item, ...updatedRecord } : item
      )
    }));
    addToast({
      title: "Updated",
      message: `Successfully updated record #${id}`,
      type: "info"
    });
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
