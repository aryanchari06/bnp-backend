import type { NextFunction, Request, Response } from 'express'
import * as z from 'zod'
import { register as registerUser, login as loginUser, changePassword as changeUserPassword } from '../repositories/repository.auth.js'

import { HttpResponse } from '../utils/http-response.js'
import { connectDB } from '../config/database.js'

const ACCESS_TOKEN_EXPIRY = 1000 * 60 * 60
const REFRESH_TOKEN_EXPIRY = 1000 * 60 * 60 * 24 * 7

const RegisterPayload = z.object({
    username: z.string({ error: 'Username is required' })
        .min(3, { error: 'Username must be at least 3 characters' }).max(100, { error: 'Username too long!' }),
    email: z.email({ error: 'Enter a valid email address' }),
    password: z.string({ error: 'Password is required' })
        .min(6, { error: 'Password must be at least 6 characters' }).max(255, { error: 'Password too long!' }),
})

const LoginPayload = z.object({
    email: z.email({ error: 'Enter a valid email address' }),
    password: z.string({ error: 'Password is required' })
        .min(6, { error: 'Password must be at least 6 characters' })
})

const ChangePasswordPayload = z.object({
    oldPassword: z.string({ error: 'Old Password is required' })
        .min(6, { error: 'Old Password must be at least 6 characters' }),
    newPassword: z.string({ error: 'New Password is required' })
        .min(6, { error: 'New Password must be at least 6 characters' })
})

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body)
            return HttpResponse(res, { statusCode: 400, body: { message: "Request body missing!" } })
        await connectDB()
        const { success, error: zodError, data } = RegisterPayload.safeParse(req.body)
        if (success) {
            const { username, email, password } = data
            await registerUser(username, email, password)
            return HttpResponse(res, { statusCode: 201, body: { message: "User registered!" } })
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

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body)
            return HttpResponse(res, { statusCode: 400, body: { message: "Request body missing!" } })
        await connectDB()
        const { success, error: zodError, data } = LoginPayload.safeParse(req.body)
        if (success) {
            const { email, password } = data
            const { username, accessToken, refreshToken } = await loginUser(email, password)
            res.cookie('access', accessToken, { maxAge: ACCESS_TOKEN_EXPIRY, httpOnly: true, path: '/' }) // set samesite, secure later
            res.cookie('refresh', refreshToken, { maxAge: REFRESH_TOKEN_EXPIRY, httpOnly: true, path: '/auth/refresh' }) // set samesite, secure later
            return HttpResponse(res, { statusCode: 200, body: { message: `Logged in as ${username}!` } })
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

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    console.log('inside change password handler...')
    try {
        if (!req.body)
            return HttpResponse(res, { statusCode: 400, body: { message: "Request body missing!" } })
        await connectDB()
        const { success, error: zodError, data } = ChangePasswordPayload.safeParse(req.body)
        if (success) {
            const { oldPassword, newPassword } = data
            const userId = req.auth?.userId
            if (userId) {
                await changeUserPassword(userId, oldPassword, newPassword)
                return HttpResponse(res, {
                    statusCode: 200,
                    body: { message: "Password changed successfully!" }
                })
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