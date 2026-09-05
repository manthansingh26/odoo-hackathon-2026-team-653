import { Router } from 'express'
import dashboardRoutes from './dashboard.routes.js'
import contactRoutes from './contact.routes.js'
import productRoutes from './product.routes.js'
import transactionRoutes from './transaction.routes.js'
import journalRoutes from './journal.routes.js'

const router = Router()

router.use('/dashboard', dashboardRoutes)
router.use('/contacts', contactRoutes)
router.use('/products', productRoutes)
router.use('/transactions', transactionRoutes)
router.use('/journal-entries', journalRoutes)

export default router
