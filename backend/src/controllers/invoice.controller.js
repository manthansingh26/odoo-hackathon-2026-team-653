import * as invoiceService from '../services/invoice.service.js'

export async function getInvoices(req, res, next) {
  try {
    const filters = { ...req.query }
    // If client user, restrict to their contactId
    if (req.user && req.user.role && req.user.role.toLowerCase().includes('client')) {
      filters.contactId = req.user.contactId
    }
    const invoices = await invoiceService.listInvoices(filters)
    res.json(invoices)
  } catch (err) {
    next(err)
  }
}

export async function createInvoice(req, res, next) {
  try {
    const newInvoice = await invoiceService.createInvoice(req.body)
    res.status(201).json(newInvoice)
  } catch (err) {
    next(err)
  }
}

export async function payInvoice(req, res, next) {
  try {
    const result = await invoiceService.payInvoice(req.params.id, req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
