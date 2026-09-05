import { Router } from 'express'
import { getJournalEntries, createJournalEntry } from '../controllers/journal.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', authenticateToken, requireRole('Admin', 'Accountant'), getJournalEntries)
router.post('/', authenticateToken, requireRole('Admin', 'Accountant'), createJournalEntry)

export default router
