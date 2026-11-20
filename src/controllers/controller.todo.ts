import type { NextFunction, Request, Response } from "express";
import { connectDB } from "../config/database.js";
import { listTodos as repoListTodos, createTodo as repoCreateTodo, updateTodo as repoUpdateTodo, deleteTodo as repoDeleteTodo } from '../repositories/repository.todo.js'
import { HttpResponse } from "../utils/http-response.js";
import * as z from 'zod'

const CreatePayload = z.object({
    title: z.string({ error: 'Username is required' })
        .min(3, { error: 'title needs at least 3 characters' }).max(255, { error: 'Title too long!' }),
})
const UpdatePayload = z.object({
    title: z.string({ error: 'Username is required' })
        .min(3, { error: 'title needs at least 3 characters' }).max(255, { error: 'Title too long!' }),
    todoId: z.string({ error: 'TodoId is required' })
})
const DeletePayload = z.object({
    todoId: z.string({ error: 'TodoId is required' })
})

export const listTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await connectDB()
        //pageinate and filter
        const userId = req.auth?.userId
        if (userId) {
            const todos = await repoListTodos(userId.toString(), {})
            return HttpResponse(res, { statusCode: 200, body: { todos } })
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
        await connectDB()
        const { success, error: zodError, data } = CreatePayload.safeParse(req.body)
        if (success) {
            const { title } = data
            const userId = req.auth?.userId
            if (userId) {
                const todos = await repoCreateTodo(userId.toString(), title)
                return HttpResponse(res, { statusCode: 200, body: { todos } })
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
        await connectDB()
        const { success, error: zodError, data } = UpdatePayload.safeParse(req.body)
        if (success) {
            const { title, todoId } = data
            const userId = req.auth?.userId
            if (userId) {
                const todos = await repoUpdateTodo(todoId, userId.toString(), title)
                return HttpResponse(res, { statusCode: 200, body: { todos } })
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

export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await connectDB()
        const { success, error: zodError, data } = DeletePayload.safeParse(req.body)
        if (success) {
            const { todoId } = data
            const userId = req.auth?.userId
            if (userId) {
                const todos = await repoDeleteTodo(todoId, userId.toString())
                return HttpResponse(res, { statusCode: 200, body: { todos } })
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