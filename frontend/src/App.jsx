import React, { useState, useEffect, useCallback } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { DashboardPage } from './pages/DashboardPage'
import { ContactsPage } from './pages/ContactsPage'
import { ProductsPage } from './pages/ProductsPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { JournalPage } from './pages/JournalPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { api } from './services/api'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Global accounting data states
  const [summary, setSummary] = useState(null)
  const [contacts, setContacts] = useState([])
  const [products, setProducts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [journalEntries, setJournalEntries] = useState([])

  // Async UI states
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch all initial data from Express + PostgreSQL
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    setRefreshing(true)
    setError(null)

    try {
      const [sumRes, contRes, prodRes, txRes, jeRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getContacts(),
        api.getProducts(),
        api.getTransactions(),
        api.getJournalEntries(),
      ])

      setSummary(sumRes)
      setContacts(contRes)
      setProducts(prodRes)
      setTransactions(txRes)
      setJournalEntries(jeRes)
    } catch (err) {
      console.error('Data load error:', err)
      setError(err.message || 'Failed to connect to backend API')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false
    async function init() {
      try {
        const [sumRes, contRes, prodRes, txRes, jeRes] = await Promise.all([
          api.getDashboardSummary(),
          api.getContacts(),
          api.getProducts(),
          api.getTransactions(),
          api.getJournalEntries(),
        ])
        if (!ignore) {
          setSummary(sumRes)
          setContacts(contRes)
          setProducts(prodRes)
          setTransactions(txRes)
          setJournalEntries(jeRes)
          setLoading(false)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to connect to backend API')
          setLoading(false)
        }
      }
    }
    init()
    return () => {
      ignore = true
    }
  }, [])

  // --- Handlers for mutations ---

  const handleAddContact = async (contactData) => {
    setIsSubmitting(true)
    try {
      const created = await api.createContact(contactData)
      setContacts((prev) => [created, ...prev])
      // Refresh summary to update potential counts
      api.getDashboardSummary().then(setSummary).catch(console.error)
      return created
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddProduct = async (productData) => {
    setIsSubmitting(true)
    try {
      const created = await api.createProduct(productData)
      setProducts((prev) => [created, ...prev])
      return created
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTransaction = async (txData) => {
    setIsSubmitting(true)
    try {
      const created = await api.createTransaction(txData)
      // Refetch transactions, journal entries, and dashboard summary for total consistency
      await Promise.all([
        api.getDashboardSummary().then(setSummary),
        api.getTransactions().then(setTransactions),
        api.getJournalEntries().then(setJournalEntries),
      ])
      return created
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddJournalEntry = async (entryData) => {
    setIsSubmitting(true)
    try {
      const result = await api.createJournalEntry(entryData)
      await api.getJournalEntries().then(setJournalEntries)
      return result
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determine header labels and actions
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Executive Financial Dashboard',
          subtitle: 'Live Demo',
          quickAction: () => setIsTxModalOpen(true),
        }
      case 'contacts':
        return {
          title: 'Business Contacts & Partners',
          subtitle: `${contacts.length} Records`,
          quickAction: () => setIsContactModalOpen(true),
        }
      case 'products':
        return {
          title: 'Furniture Inventory Catalog',
          subtitle: `${products.length} Products`,
          quickAction: null,
        }
      case 'transactions':
        return {
          title: 'Transaction Audit Trail',
          subtitle: `${transactions.length} Total`,
          quickAction: () => setIsTxModalOpen(true),
        }
      case 'purchases':
        return {
          title: 'Vendor Purchases & Bills',
          subtitle: 'Purchases View',
          quickAction: () => setIsTxModalOpen(true),
        }
      case 'sales':
        return {
          title: 'Customer Sales & Invoices',
          subtitle: 'Sales View',
          quickAction: () => setIsTxModalOpen(true),
        }
      case 'journal-entries':
        return {
          title: 'Double-Entry General Journal',
          subtitle: 'PostgreSQL Ledger',
          quickAction: null,
        }
      case 'invoices':
        return { title: 'Invoicing Subsystem', subtitle: 'Milestone 2', quickAction: null }
      case 'payments':
        return { title: 'Payment Processing', subtitle: 'Milestone 2', quickAction: null }
      case 'reports':
        return { title: 'Financial Reports & P&L', subtitle: 'Milestone 3', quickAction: null }
      case 'settings':
        return { title: 'System & Database Configuration', subtitle: 'Docker PG16', quickAction: null }
      default:
        return { title: 'Urban Furniture Accounting', subtitle: 'Demo', quickAction: null }
    }
  }

  const headerInfo = getHeaderInfo()

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={{
          contacts: contacts.length,
          products: products.length,
          transactions: transactions.length,
          journalEntries: journalEntries.length,
        }}
      />

      <div className="main-content">
        <Header
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          onRefresh={() => loadData(true)}
          isRefreshing={refreshing}
          onQuickAction={headerInfo.quickAction}
        />

        {error && (
          <div style={{ padding: '16px 36px 0' }}>
            <div className="alert-error">
              <strong>Connection Warning:</strong> {error}. Please ensure Express backend is running on port 4000.
            </div>
          </div>
        )}

        {/* Dynamic Route View */}
        {activeTab === 'dashboard' && (
          <DashboardPage
            summary={summary}
            loading={loading}
            error={error}
            onNavigate={setActiveTab}
            onOpenNewTx={() => setIsTxModalOpen(true)}
            onOpenNewContact={() => setIsContactModalOpen(true)}
          />
        )}

        {activeTab === 'contacts' && (
          <ContactsPage
            contacts={contacts}
            loading={loading}
            error={error}
            onAddContact={handleAddContact}
            isCreating={isSubmitting}
            isModalOpen={isContactModalOpen}
            setIsModalOpen={setIsContactModalOpen}
          />
        )}

        {activeTab === 'products' && (
          <ProductsPage
            products={products}
            loading={loading}
            error={error}
            onAddProduct={handleAddProduct}
            isCreating={isSubmitting}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsPage
            transactions={transactions}
            contacts={contacts}
            loading={loading}
            error={error}
            onAddTransaction={handleAddTransaction}
            isCreating={isSubmitting}
            isModalOpen={isTxModalOpen}
            setIsModalOpen={setIsTxModalOpen}
            initialFilter="ALL"
          />
        )}

        {activeTab === 'purchases' && (
          <TransactionsPage
            key="purchases-view"
            transactions={transactions}
            contacts={contacts}
            loading={loading}
            error={error}
            onAddTransaction={handleAddTransaction}
            isCreating={isSubmitting}
            isModalOpen={isTxModalOpen}
            setIsModalOpen={setIsTxModalOpen}
            initialFilter="PURCHASE"
          />
        )}

        {activeTab === 'sales' && (
          <TransactionsPage
            key="sales-view"
            transactions={transactions}
            contacts={contacts}
            loading={loading}
            error={error}
            onAddTransaction={handleAddTransaction}
            isCreating={isSubmitting}
            isModalOpen={isTxModalOpen}
            setIsModalOpen={setIsTxModalOpen}
            initialFilter="SALE"
          />
        )}

        {activeTab === 'journal-entries' && (
          <JournalPage
            entries={journalEntries}
            loading={loading}
            error={error}
            onAddEntry={handleAddJournalEntry}
            isCreating={isSubmitting}
          />
        )}

        {activeTab === 'invoices' && (
          <PlaceholderPage
            title="Invoices"
            icon="📄"
            milestone="Milestone 2"
            description="Complete customer invoicing and printable PDF billing engine integrated with transactional inventory deduction."
            features={[
              'GST & VAT Tax Rate Computations',
              'Auto-sequential Invoice Numbers (INV-2026-XXXX)',
              'Printable PDF and Email Dispatch',
              'Payment terms (Net 15, Net 30, Due on Receipt)',
            ]}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'payments' && (
          <PlaceholderPage
            title="Payments"
            icon="💰"
            milestone="Milestone 2"
            description="Multi-mode payment reconciliations linking customer receipts and vendor disbursements directly against open invoice balances."
            features={[
              'Bank, UPI & Cheque settlements',
              'Partial invoice payment allocation',
              'Automated Cash / Bank ledger entries',
              'Customer balance statement generation',
            ]}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'reports' && (
          <PlaceholderPage
            title="Financial Reports"
            icon="📈"
            milestone="Milestone 3"
            description="Standardized GAAP and IFRS compliant accounting reports calculated directly from double-entry journal items in PostgreSQL."
            features={[
              'Profit & Loss Statement (P&L)',
              'Balance Sheet (Assets = Liabilities + Equity)',
              'Trial Balance Verification',
              'Aged Receivables & Payables breakdown',
            ]}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'settings' && (
          <PlaceholderPage
            title="System Configuration"
            icon="⚙️"
            milestone="System Architecture"
            description="Containerized environment configuration, database connection parameters, and fiscal year management."
            features={[
              'Docker PostgreSQL 16 (recoverai-postgres)',
              'Prisma ORM Client (Active Schema v2)',
              'Express.js REST API with CORS credentials',
              'JWT Token Authentication (Milestone 2)',
            ]}
            onNavigate={setActiveTab}
          />
        )}
      </div>
    </div>
  )
}
