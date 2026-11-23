import express from 'express'
import { list, create, update, del, toggle, stats } from '../controllers/controller.todo.js'
import checkAuth from '../middlewares/middleware.auth.js'

const router = express.Router()

router.get('/', checkAuth, list)
router.post('/', checkAuth, create)
router.patch('/', checkAuth, update)
router.delete('/:todoId', checkAuth, del)
router.patch('/:todoId', checkAuth, toggle)
router.get('/user/stats', checkAuth, stats)

export default router