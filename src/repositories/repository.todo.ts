import { getUserTodos, createTodo as createUserTodo, updateTodo as updateUserTodo, deleteTodo as deleteUserTodo } from "../services/service.todo.js"
import { AppError } from "../types/errors.js"

export const listTodos = async (userId: string, filters = {}) => {
    try {
        const todos = await getUserTodos(userId, filters)
        return todos
    } catch (error) {
        throw new AppError('INTERNAL_SERVER_ERROR', 'Internal server error!', 500)
    }
}

export const createTodo = async (userId: string, title: string) => {
    try {
        return await createUserTodo(title, userId)
    } catch (error) {
        throw new AppError('INTERNAL_SERVER_ERROR', 'Internal server error!', 500)
    }
}

export const updateTodo = async (todoId: string, userId: string, title: string) => {
    try {
        return await updateUserTodo(todoId, userId, title)
    } catch (error) {
        throw new AppError('INTERNAL_SERVER_ERROR', 'Internal server error!', 500)
    }
}

export const deleteTodo = async (todoId: string, userId: string) => {
    try {
        return await deleteUserTodo(todoId, userId)
    } catch (error) {
        throw new AppError('INTERNAL_SERVER_ERROR', 'Internal server error!', 500)
    }
}