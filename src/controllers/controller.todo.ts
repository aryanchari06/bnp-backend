import type { NextFunction, Request, Response } from "express";
import { connectDB } from "../config/database.js";
import { listTodos as repoListTodos, createTodo as repoCreateTodo, updateTodo as repoUpdateTodo, toggleTodo as repoToggleTodo, deleteTodo as repoDeleteTodo } from '../repositories/repository.todo.js'
import { HttpResponse } from "../utils/http-response.js";
import * as z from 'zod'

const CreatePayload = z.object({
    title: z.string({ error: 'Title is required' })
        .min(3, { error: 'title needs at least 3 characters' })
        .max(255, { error: 'Title too long!' }),
})
const UpdatePayload = z.object({
    title: z.string({ error: 'Title is required' })
        .min(3, { error: 'Title needs at least 3 characters' })
        .max(255, { error: 'Title too long!' }),
    todoId: z.string({ error: 'TodoId must be a string' })
        .min(1, { error: 'TodoId is required' })
        .regex(/^[0-9a-fA-F]{24}$/, { error: 'Invalid MongoDB ObjectId' })
})

const TodoIdPayload = z.object({
    todoId: z.string({ error: 'TodoId must be a string' })
        .min(1, { error: 'TodoId is required' })
        .regex(/^[0-9a-fA-F]{24}$/, { error: 'Invalid MongoDB ObjectId' })
})

export const listTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await connectDB()
        //pageinate and filter
        const { page: rawPage = 1, pageSize: rawPageSize = 10 } = req.query
        const page = Number(rawPage)
        const pageSize = Number(rawPageSize)

        if (Number.isNaN(page) || page < 1) return HttpResponse(res, { statusCode: 400, body: { message: "Page invalid!" } })
        if (Number.isNaN(pageSize) || pageSize < 1) return HttpResponse(res, { statusCode: 400, body: { message: "Pagesize invalid!" } })
        if (pageSize > 50) return HttpResponse(res, { statusCode: 400, body: { message: "Page size cannot exceed 50" } })

        const userId = req.auth?.userId
        if (userId) {
            const { todos, totalTodos } = await repoListTodos(userId.toString(), page, pageSize, {})
            const totalPages = Math.ceil(totalTodos / pageSize)
            return HttpResponse(res, { statusCode: 200, body: { todos, totalTodos, page, pageSize, totalPages } })
        } else {
            console.error('UserId is missing')
            throw new Error('Something went wrong')
        }
    } catch (error) {
        next(error)
    }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body)
            return HttpResponse(res, { statusCode: 400, body: { message: "Request body missing!" } })
        await connectDB()
        const { success, error: zodError, data } = CreatePayload.safeParse(req.body)
        if (success) {
            const { title } = data
            const userId = req.auth?.userId
            if (userId) {
                const todo = await repoCreateTodo(userId.toString(), title)
                return HttpResponse(res, { statusCode: 200, body: { message: "Todo Created!", todoId: todo._id } })
            } else {
                console.error('UserId is missing')
                throw new Error('Something went wrong')
            }
        } else {
            return HttpResponse(res, {
                statusCode: 400,
                body: { message: zodError.issues[0]?.message ?? 'Invalid request data' }
            })
        }
    } catch (error) {
        next(error)
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body)
            return HttpResponse(res, { statusCode: 400, body: { message: "Request body missing!" } })

        await connectDB()
        const { success, error: zodError, data } = UpdatePayload.safeParse(req.body)
        if (success) {
            const { title, todoId } = data
            const userId = req.auth?.userId
            if (userId) {
                const todo = await repoUpdateTodo(todoId, userId.toString(), title)
                if (todo.matchedCount === 0)
                    return HttpResponse(res, { statusCode: 404, body: { message: "Todo not found!" } })
                return HttpResponse(res, { statusCode: 200, body: { message: "Todo Updated successfully!" } })
            } else {
                console.error('UserId is missing')
                throw new Error('Something went wrong')
            }
        } else {
            return HttpResponse(res, {
                statusCode: 400,
                body: { message: zodError.issues[0]?.message ?? 'Invalid request data' }
            })
        }

    } catch (error) {
        next(error)
    }
}

export const toggle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await connectDB()
        const { success, error: zodError, data } = TodoIdPayload.safeParse(req.params)
        if (success) {
            const { todoId } = data
            const userId = req.auth?.userId
            if (userId) {
                const todo = await repoToggleTodo(todoId, userId.toString())
                if (!todo)
                    return HttpResponse(res, { statusCode: 404, body: { message: "Todo not found!" } })
                return HttpResponse(res, { statusCode: 200, body: { message: "Todo Updated successfully!" } })
            } else {
                console.error('UserId is missing')
                throw new Error('Something went wrong. Please log in again')
            }
        } else {
            return HttpResponse(res, {
                statusCode: 400,
                body: { message: zodError.issues[0]?.message ?? 'Invalid request data' }
            })
        }
    } catch (error) {
        console.error('Error: ', error)
        next(error)
    }
}

export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body)
            return HttpResponse(res, { statusCode: 400, body: { message: "Request body missing!" } })
        await connectDB()
        const { success, error: zodError, data } = TodoIdPayload.safeParse(req.body)
        if (success) {
            const { todoId } = data
            const userId = req.auth?.userId
            if (userId) {
                const todo = await repoDeleteTodo(todoId, userId.toString())
                if (todo.deletedCount === 0)
                    return HttpResponse(res, { statusCode: 404, body: { message: "Could not delete todo. Todo not found!" } })
                return HttpResponse(res, { statusCode: 200, body: { message: "Todo Deleted Successfully!" } })
            } else {
                console.error('UserId is missing')
                throw new Error('Something went wrong')
            }
        } else {
            return HttpResponse(res, {
                statusCode: 400,
                body: { message: zodError.issues[0]?.message ?? 'Invalid request data' }
            })
        }
    } catch (error) {
        next(error)
    }
}