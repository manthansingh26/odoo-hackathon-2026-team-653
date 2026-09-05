import * as journalService from '../services/journal.service.js'

export async function getJournalEntries(req, res, next) {
  try {
    const entries = await journalService.listJournalEntries()
    res.json(entries)
  } catch (err) {
    next(err)
  }
}

export async function createJournalEntry(req, res, next) {
  try {
    const result = await journalService.postJournalEntry(req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}
