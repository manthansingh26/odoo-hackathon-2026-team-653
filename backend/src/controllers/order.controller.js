import * as orderService from '../services/order.service.js'

export async function getSalesOrders(req, res, next) {
  try {
    const filters = { ...req.query }
    if (req.user && req.user.role && req.user.role.toLowerCase().includes('client')) {
      filters.contactId = req.user.contactId
    }
    const orders = await orderService.listSalesOrders(filters)
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

export async function createSalesOrder(req, res, next) {
  try {
    const newOrder = await orderService.createSalesOrder(req.body)
    res.status(201).json(newOrder)
  } catch (err) {
    next(err)
  }
}

export async function getPurchaseOrders(req, res, next) {
  try {
    const orders = await orderService.listPurchaseOrders(req.query)
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

export async function createPurchaseOrder(req, res, next) {
  try {
    const newOrder = await orderService.createPurchaseOrder(req.body)
    res.status(201).json(newOrder)
  } catch (err) {
    next(err)
  }
}
