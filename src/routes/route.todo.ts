import express from 'express'
import { listTodos, create, update, deleteTodo } from '../controllers/controller.todo.js'
import checkAuth from '../middlewares/middleware.auth.js'

const router = express.Router()

router.get('/', checkAuth, listTodos)
router.post('/', checkAuth, create)
router.patch('/', checkAuth, update)
router.delete('/', checkAuth, deleteTodo)

export default router