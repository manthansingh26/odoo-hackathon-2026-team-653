import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { listInvoices } from '../services/invoice.service.js'
import { listBills } from '../services/bill.service.js'
import { listPayments } from '../services/payment.service.js'
import { httpError } from '../services/journal.service.js'

const router = Router()

// All portal routes require authentication
router.use(authenticateToken)

// Middleware: ensure client has contactId
function enforceContactScope(req, res, next) {
  const contactId = req.user?.contactId
  if (!contactId) {
    return next(httpError(403, 'Client account is not linked to any valid contact entity'))
  }
  req.contactId = contactId
  next()
}

router.get('/my-invoices', enforceContactScope, async (req, res, next) => {
  try {
    const invoices = await listInvoices({ contactId: req.contactId })
    res.json(invoices)
  } catch (err) {
    next(err)
  }
})

router.get('/my-bills', enforceContactScope, async (req, res, next) => {
  try {
    const bills = await listBills({ contactId: req.contactId })
    res.json(bills)
  } catch (err) {
    next(err)
  }
})

router.get('/my-payments', enforceContactScope, async (req, res, next) => {
  try {
    const payments = await listPayments({ contactId: req.contactId })
    res.json(payments)
  } catch (err) {
    next(err)
  }
})

export default router
