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

  if (!name || !name.trim()) {
    throw httpError(400, 'Product name is required')
  }

  if (!sku || !sku.trim()) {
    throw httpError(400, 'Product SKU is required')
  }

  const numPrice = Number(price)
  if (isNaN(numPrice) || numPrice < 0) {
    throw httpError(400, 'Valid positive price is required')
  }

  const numStock = stock !== undefined && stock !== '' ? parseInt(stock, 10) : 0
  if (isNaN(numStock) || numStock < 0) {
    throw httpError(400, 'Valid stock number is required')
  }

  const cleanSku = sku.trim().toUpperCase()
  const existing = await prisma.product.findUnique({
    where: { sku: cleanSku },
  })
  if (existing) {
    throw httpError(409, `Product with SKU "${cleanSku}" already exists`)
  }

  return prisma.product.create({
    data: {
      name: name.trim(),
      sku: cleanSku,
      price: numPrice,
      stock: numStock,
    },
  })
}
