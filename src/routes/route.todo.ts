import express from 'express'
import { list, create, update, del, toggle, stats } from '../controllers/controller.todo.js'
import checkAuth from '../middlewares/middleware.auth.js'
import rateLimit from '../middlewares/middleware.ratelimit.js'

const ONE_MIN = 60 * 1000

const router = express.Router()

router.get('/', checkAuth, rateLimit({ limit: 10, windowMs: ONE_MIN }), list)
router.post('/', checkAuth, rateLimit({ limit: 20, windowMs: ONE_MIN }), create)
router.patch('/', checkAuth, rateLimit({ limit: 30, windowMs: ONE_MIN }), update)
router.delete('/:todoId', checkAuth, rateLimit({ limit: 30, windowMs: ONE_MIN }), del)
router.patch('/:todoId', checkAuth, rateLimit({ limit: 60, windowMs: ONE_MIN }), toggle)
router.get('/user/stats', checkAuth, rateLimit({ limit: 60, windowMs: ONE_MIN }), stats)

export default router