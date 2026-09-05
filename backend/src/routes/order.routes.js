import { Router } from 'express'
import * as orderController from '../controllers/order.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/sales', authenticateToken, orderController.getSalesOrders)
router.post('/sales', authenticateToken, requireRole('Admin', 'Accountant'), orderController.createSalesOrder)

router.get('/purchases', authenticateToken, requireRole('Admin', 'Accountant'), orderController.getPurchaseOrders)
router.post('/purchases', authenticateToken, requireRole('Admin', 'Accountant'), orderController.createPurchaseOrder)

export default router
