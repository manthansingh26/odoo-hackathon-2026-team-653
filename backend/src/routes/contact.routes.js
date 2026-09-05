import { Router } from 'express'
import { getContacts, createContact } from '../controllers/contact.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', authenticateToken, requireRole('Admin', 'Accountant'), getContacts)
router.post('/', authenticateToken, requireRole('Admin', 'Accountant'), createContact)

export default router
