import type { NextFunction, Request, Response } from "express";
import { AppError } from "../types/errors.js";
import mongoose from "mongoose";
import { connectDB } from "../config/database.js";
import RateLimit from "../models/model.ratelimit.js";
import { HttpResponse } from "../utils/http-response.js";

type ScopeGenPayload = {
    scope: string
    value: string
    path: string
    winMs: number
}
const generateScope = ({ scope, value, path, winMs }: ScopeGenPayload) => `scope:${scope}::value:${value}::path:${path}:win:${winMs}`

const rateLimit = ({ limit, windowMs }: { limit: number, windowMs: number }) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!mongoose.connection.readyState)
                await connectDB()

            const path = req.method + "#" + req.baseUrl + (req.route?.path ?? req.path)
            const ip = req.ip
            const email = typeof req.body?.email === 'string' ? req.body?.email?.trim().toLowerCase() : undefined
            const userId = req.auth?.userId
            const window = Math.floor(Date.now() / windowMs)

            const scopeIp = ip ? generateScope({ scope: 'ip', value: req.ip, path, winMs: window }) : undefined
            const scopeEmail = email ? generateScope({ scope: 'email', value: email.trim().toLowerCase(), path, winMs: window }) : undefined
            const scopeUserId = userId ? generateScope({ scope: 'userId', value: userId, path, winMs: window }) : undefined

            if (scopeIp) {
                const ipRL = await RateLimit.findOneAndUpdate(
                    { scope: scopeIp },
                    {
                        $inc: { count: 1 },
                        $setOnInsert: { expiresAt: new Date(Date.now() + windowMs) }
                    },
                    { upsert: true, returnDocument: 'after' }
                )
                if (ipRL.count > limit) return HttpResponse(res, { statusCode: 429, body: { message: "Too many requests! Please try again in sometime." } })
            }
            if (scopeEmail) {
                const emailRL = await RateLimit.findOneAndUpdate(
                    { scope: scopeEmail },
                    {
                        $inc: { count: 1 },
                        $setOnInsert: { expiresAt: new Date(Date.now() + windowMs) }
                    },
                    { upsert: true, returnDocument: 'after' }
                )
                if (emailRL.count > limit) return HttpResponse(res, { statusCode: 429, body: { message: "Too many requests! Please try again in sometime." } })
            }
            if (scopeUserId) {
                const userIdRL = await RateLimit.findOneAndUpdate(
                    { scope: scopeUserId },
                    {
                        $inc: { count: 1 },
                        $setOnInsert: { expiresAt: new Date(Date.now() + windowMs) }
                    },
                    { upsert: true, returnDocument: 'after' }
                )
                if (userIdRL.count > limit) return HttpResponse(res, { statusCode: 429, body: { message: "Too many requests! Please try again in sometime." } })
            }

        } catch (error) {
            console.error('Rate limiting failed: ', error)
            throw new AppError('INTERNAL_SERVER_ERROR', 'Something went wrong', 500)
        }
        return next()
    }
}

export default rateLimit