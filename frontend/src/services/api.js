/**
 * API client for Urban Furniture Accounting System.
 * Connects to the Express backend via relative `/api` paths proxied by Vite.
 * Automatically injects JWT Bearer authorization header if token exists in localStorage.
 */

async function request(path, options = {}) {
  const url = `/api${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Attach JWT token from localStorage if available
  const token = localStorage.getItem('urban_furniture_jwt_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errData = await response.json();
      if (errData && errData.error) {
        errorMessage = errData.error;
      }
    } catch {
      // ignore JSON parse error
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export const api = {
  // Auth endpoints
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request('/auth/me'),
  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),

  // Health & Dashboard
  getHealth: () => request('/health'),
  getDashboardSummary: () => request('/dashboard/summary'),

  // Master Data
  getContacts: () => request('/contacts'),
  createContact: (data) =>
    request('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getProducts: () => request('/products'),
  createProduct: (data) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Transactions
  getTransactions: (query = '') => request(`/transactions${query}`),
  createTransaction: (data) =>
    request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  payTransaction: (id, data = {}) =>
    request(`/transactions/${encodeURIComponent(id)}/pay`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Customer Invoices
  getInvoices: () => request('/invoices'),
  createInvoice: (data) =>
    request('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  payInvoice: (id, data = {}) =>
    request(`/invoices/${encodeURIComponent(id)}/pay`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Vendor Bills
  getBills: () => request('/bills'),
  createBill: (data) =>
    request('/bills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  payBill: (id, data = {}) =>
    request(`/bills/${encodeURIComponent(id)}/pay`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Payments
  getPayments: () => request('/payments'),
  createPayment: (data) =>
    request('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Orders
  getSalesOrders: () => request('/orders/sales'),
  createSalesOrder: (data) =>
    request('/orders/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getPurchaseOrders: () => request('/orders/purchases'),
  createPurchaseOrder: (data) =>
    request('/orders/purchases', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Accounting Core
  getJournalEntries: () => request('/journal-entries'),
  createJournalEntry: (data) =>
    request('/journal-entries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Reports & Settings
  getFinancialReports: () => request('/reports/financial'),
  getSettings: () => request('/settings'),

  // Client Portal Data
  getPortalInvoices: () => request('/portal/my-invoices'),
  getPortalBills: () => request('/portal/my-bills'),
  getPortalPayments: () => request('/portal/my-payments'),
};
