import { Router } from 'express'
import * as billController from '../controllers/bill.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

// Only Admin and Accountant can manage vendor bills
router.get('/', authenticateToken, requireRole('Admin', 'Accountant'), billController.getBills)
router.post('/', authenticateToken, requireRole('Admin', 'Accountant'), billController.createBill)
router.patch('/:id/pay', authenticateToken, requireRole('Admin', 'Accountant'), billController.payBill)

export default router
