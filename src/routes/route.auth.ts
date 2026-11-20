import express from 'express'
import { register, login, changePassword, logout } from '../controllers/controller.auth.js'
import checkAuth from '../middlewares/middleware.auth.js'

const router = express.Router()
router.post('/register', register)
router.post('/login', login)
router.post('/change-password', checkAuth, changePassword)
router.post('/logout', checkAuth, logout)

export default router
