import { Router } from 'express'
import * as transactionController from '../controllers/transaction.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', authenticateToken, requireRole('Admin', 'Accountant'), transactionController.getTransactions)
router.get('/:id', authenticateToken, requireRole('Admin', 'Accountant'), transactionController.getTransaction)
router.post('/', authenticateToken, requireRole('Admin', 'Accountant'), transactionController.createTransaction)
router.patch('/:id/pay', authenticateToken, requireRole('Admin', 'Accountant'), transactionController.payTransaction)
router.post('/payments', authenticateToken, requireRole('Admin', 'Accountant'), transactionController.recordPayment)

export default router
