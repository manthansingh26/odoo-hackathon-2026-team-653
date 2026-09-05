import * as transactionService from '../services/transaction.service.js'

export async function getTransactions(req, res, next) {
  try {
    const transactions = await transactionService.listTransactions(req.query)
    res.json(transactions)
  } catch (err) {
    next(err)
  }
}

export async function getTransaction(req, res, next) {
  try {
    const transaction = await transactionService.getTransaction(req.params.id)
    res.json(transaction)
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

export async function payTransaction(req, res, next) {
  try {
    const result = await transactionService.markTransactionPaid(req.params.id, req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function recordPayment(req, res, next) {
  try {
    const result = await transactionService.recordPayment(req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}
