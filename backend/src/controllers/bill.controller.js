import * as billService from '../services/bill.service.js'

export async function getBills(req, res, next) {
  try {
    const filters = { ...req.query }
    const bills = await billService.listBills(filters)
    res.json(bills)
  } catch (err) {
    next(err)
  }
}

export async function createBill(req, res, next) {
  try {
    const newBill = await billService.createBill(req.body)
    res.status(201).json(newBill)
  } catch (err) {
    next(err)
  }
}

export async function payBill(req, res, next) {
  try {
    const result = await billService.payBill(req.params.id, req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
