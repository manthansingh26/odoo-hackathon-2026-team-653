import { Router } from 'express'
import * as paymentController from '../controllers/payment.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

// GET /api/payments: Authenticated users can list (Clients see their own)
router.get('/', authenticateToken, paymentController.getPayments)

// POST /api/payments: Only Admin and Accountant can create/record payments
router.post('/', authenticateToken, requireRole('Admin', 'Accountant'), paymentController.createPayment)

export default router
