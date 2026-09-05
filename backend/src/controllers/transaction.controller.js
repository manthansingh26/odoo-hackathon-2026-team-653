import * as transactionService from '../services/transaction.service.js'

export async function getTransactions(req, res, next) {
  try {
    const transactions = await transactionService.listTransactions()
    res.json(transactions)
  } catch (err) {
    next(err)
  }
}

export async function createTransaction(req, res, next) {
  try {
    const newTransaction = await transactionService.createTransaction(req.body)
    res.status(201).json(newTransaction)
  } catch (err) {
    next(err)
  }
}
