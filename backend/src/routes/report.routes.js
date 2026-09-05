import { Router } from 'express'
import * as reportController from '../controllers/report.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

// Reports are strictly restricted to Admin and Accountant
router.get('/', authenticateToken, requireRole('Admin', 'Accountant'), reportController.getReports)
router.get('/financial', authenticateToken, requireRole('Admin', 'Accountant'), reportController.getReports)

export default router
