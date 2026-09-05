import { Router } from 'express'
import authRoutes from './auth.routes.js'
import dashboardRoutes from './dashboard.routes.js'
import contactRoutes from './contact.routes.js'
import productRoutes from './product.routes.js'
import transactionRoutes from './transaction.routes.js'
import invoiceRoutes from './invoice.routes.js'
import billRoutes from './bill.routes.js'
import paymentRoutes from './payment.routes.js'
import orderRoutes from './order.routes.js'
import journalRoutes from './journal.routes.js'
import reportRoutes from './report.routes.js'
import settingsRoutes from './settings.routes.js'
import portalRoutes from './portal.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/contacts', contactRoutes)
router.use('/products', productRoutes)
router.use('/transactions', transactionRoutes)
router.use('/invoices', invoiceRoutes)
router.use('/bills', billRoutes)
router.use('/payments', paymentRoutes)
router.use('/orders', orderRoutes)
router.use('/journal-entries', journalRoutes)
router.use('/reports', reportRoutes)
router.use('/settings', settingsRoutes)
router.use('/portal', portalRoutes)

export default router
