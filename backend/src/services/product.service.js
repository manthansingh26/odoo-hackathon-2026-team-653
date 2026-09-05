import { prisma } from '../config/db.js'
import { httpError } from './journal.service.js'

export async function listProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function createProduct(data) {
  const { name, sku, price, stock } = data

  if (!name || typeof name !== 'string' || !name.trim()) {
    throw httpError(400, 'Product name is required')
  }

  const trimmedName = name.trim()
  if (trimmedName.length < 2) {
    throw httpError(400, 'Product name must be at least 2 characters')
  }
  if (!/[a-zA-Z]/.test(trimmedName)) {
    throw httpError(400, 'Product name must contain valid letters and cannot be only numbers or symbols')
  }

  if (!sku || typeof sku !== 'string' || !sku.trim()) {
    throw httpError(400, 'Product SKU is required')
  }

  const cleanSku = sku.trim().toUpperCase()
  if (cleanSku.length < 3) {
    throw httpError(400, 'Product SKU must be at least 3 characters')
  }

  const numPrice = Number(price)
  if (isNaN(numPrice) || numPrice <= 0) {
    throw httpError(400, 'Valid positive price is required (must be greater than 0)')
  }

  const numStock = stock !== undefined && stock !== '' ? parseInt(stock, 10) : 0
  if (isNaN(numStock) || numStock < 0) {
    throw httpError(400, 'Valid non-negative stock number is required')
  }

  const existing = await prisma.product.findUnique({
    where: { sku: cleanSku },
  })
  if (existing) {
    throw httpError(409, `Product with SKU "${cleanSku}" already exists`)
  }

  return prisma.product.create({
    data: {
      name: trimmedName,
      sku: cleanSku,
      price: numPrice,
      stock: numStock,
    },
  })
}
