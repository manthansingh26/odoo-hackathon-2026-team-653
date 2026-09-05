import * as productService from '../services/product.service.js'

export async function getProducts(req, res, next) {
  try {
    const products = await productService.listProducts()
    res.json(products)
  } catch (err) {
    next(err)
  }
}

export async function createProduct(req, res, next) {
  try {
    const newProduct = await productService.createProduct(req.body)
    res.status(201).json(newProduct)
  } catch (err) {
    next(err)
  }
}
