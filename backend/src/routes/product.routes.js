import { Router } from 'express'
import { getProducts, createProduct } from '../controllers/product.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', authenticateToken, requireRole('Admin', 'Accountant'), getProducts)
router.post('/', authenticateToken, requireRole('Admin', 'Accountant'), createProduct)

export default router
