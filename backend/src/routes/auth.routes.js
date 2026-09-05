import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/login', authController.login)
router.get('/me', authenticateToken, authController.me)
router.post('/logout', authController.logout)

export default router
