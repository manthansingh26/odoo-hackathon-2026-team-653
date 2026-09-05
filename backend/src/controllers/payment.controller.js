import * as paymentService from '../services/payment.service.js'

export async function getPayments(req, res, next) {
  try {
    const filters = { ...req.query }
    if (req.user && req.user.role && req.user.role.toLowerCase().includes('client')) {
      filters.contactId = req.user.contactId
    }
    const payments = await paymentService.listPayments(filters)
    res.json(payments)
  } catch (err) {
    next(err)
  }
}

export async function createPayment(req, res, next) {
  try {
    const result = await paymentService.recordPayment(req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}
