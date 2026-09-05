/**
 * API client for Urban Furniture Accounting System.
 * Connects to the Express backend via relative `/api` paths proxied by Vite.
 */

async function request(path, options = {}) {
  const url = `/api${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
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
  getHealth: () => request('/health'),
  getDashboardSummary: () => request('/dashboard/summary'),
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
  getTransactions: () => request('/transactions'),
  createTransaction: (data) =>
    request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getJournalEntries: () => request('/journal-entries'),
  createJournalEntry: (data) =>
    request('/journal-entries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
