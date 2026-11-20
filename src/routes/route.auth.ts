import express from 'express'
import { register, login, changePassword } from '../controllers/controller.auth.js'
import checkAuth from '../middlewares/middleware.auth.js'

const router = express.Router()
router.post('/register', register)
router.post('/login', login)
router.post('/change-password', checkAuth, changePassword)

export default router
