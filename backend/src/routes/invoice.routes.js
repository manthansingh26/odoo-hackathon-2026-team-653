import { Router } from 'express'
import * as invoiceController from '../controllers/invoice.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

// GET /api/invoices: Authenticated users can list (Clients only see their own)
router.get('/', authenticateToken, invoiceController.getInvoices)

// POST /api/invoices: Only Admin and Accountant can create invoices
router.post('/', authenticateToken, requireRole('Admin', 'Accountant'), invoiceController.createInvoice)

// PATCH /api/invoices/:id/pay: Mark invoice as paid
router.patch('/:id/pay', authenticateToken, requireRole('Admin', 'Accountant'), invoiceController.payInvoice)

export default router
