import { getUserTodos, createTodo as createUserTodo, updateTodo as updateUserTodo, deleteTodo as deleteUserTodo, toggleTodo as toggleUserTodo } from "../services/service.todo.js"
import { AppError } from "../types/errors.js"

export const listTodos = async (userId: string, page: number, pageSize: number, filters = {}) => {
    try {
        return await getUserTodos(userId, page, pageSize, filters)
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

export const toggleTodo = async (todoId: string, userId: string) => {
    try {
        return await toggleUserTodo(todoId, userId)
    } catch (error) {
        console.error("ERROR: ", error)
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