import { Router } from 'express'
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

// Admin-only Settings API
router.get('/', authenticateToken, requireRole('Admin'), (req, res) => {
  res.json({
    companyName: 'Urban Furniture Pvt. Ltd.',
    gstin: '27AABCU9603R1ZM',
    currency: 'INR',
    fiscalYearStart: '04-01',
    auditLogging: true,
    doubleEntryEnforced: true,
  })
})

router.post('/', authenticateToken, requireRole('Admin'), (req, res) => {
  res.json({
    message: 'Company settings updated successfully',
    settings: req.body,
  })
})

export default router
