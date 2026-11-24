import express from 'express'
import { register, login, changePassword, logout, refresh, self } from '../controllers/controller.auth.js'
import checkAuth from '../middlewares/middleware.auth.js'
import rateLimit from '../middlewares/middleware.ratelimit.js'

const FIFTEEN_MIN = 15 * 60 * 1000
const ONE_MIN = 60 * 1000

const router = express.Router()
router.post('/register', rateLimit({ limit: 5, windowMs: FIFTEEN_MIN }), register)
router.post('/login', rateLimit({ limit: 10, windowMs: FIFTEEN_MIN }), login)
router.post('/change-password', checkAuth, rateLimit({ limit: 5, windowMs: FIFTEEN_MIN }), changePassword)
router.post('/logout', rateLimit({ limit: 20, windowMs: ONE_MIN }), logout)
router.get('/refresh', rateLimit({ limit: 30, windowMs: FIFTEEN_MIN }), refresh)
router.get('/self', checkAuth, rateLimit({ limit: 60, windowMs: ONE_MIN }), self)

export default router
