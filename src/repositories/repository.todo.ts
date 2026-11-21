import TodoService from "../services/service.todo.js"
import { AppError } from "../types/errors.js"

const list = async (userId: string, page: number, pageSize: number, filters = {}) => {
    try {
        return await TodoService.listTodos(userId, page, pageSize, filters)
    } catch (error) {
        throw new AppError('INTERNAL_SERVER_ERROR', 'Internal server error!', 500)
    }
}

const create = async (userId: string, title: string) => {
    try {
        return await TodoService.createTodo(title, userId)
    } catch (error) {
        throw new AppError('INTERNAL_SERVER_ERROR', 'Internal server error!', 500)
    }
}

const update = async (todoId: string, userId: string, title: string) => {
    try {
        return await TodoService.updateTodo(todoId, userId, title)
    } catch (error) {
        throw new AppError('INTERNAL_SERVER_ERROR', 'Internal server error!', 500)
    }
}

const toggle = async (todoId: string, userId: string) => {
    try {
        return await TodoService.toggleTodo(todoId, userId)
    } catch (error) {
        console.error("ERROR: ", error)
        throw new AppError('INTERNAL_SERVER_ERROR', 'Internal server error!', 500)
    }
}

const del = async (todoId: string, userId: string) => {
    try {
        return await TodoService.deleteTodo(todoId, userId)
    } catch (error) {
        throw new AppError('INTERNAL_SERVER_ERROR', 'Internal server error!', 500)
    }
}

const TodoRepository = { list, create, update, toggle, del }
export default TodoRepository