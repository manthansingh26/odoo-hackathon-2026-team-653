import { Router } from 'express'
import { getJournalEntries, createJournalEntry } from '../controllers/journal.controller.js'

const router = Router()

router.get('/', getJournalEntries)
router.post('/', createJournalEntry)

export default router
