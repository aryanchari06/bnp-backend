import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { AppError } from "../types/errors.js";
import dotenv from "dotenv";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Inside checkauth middleware...')
    try {
        if (!JWT_SECRET) {
            console.error('JWT_SECRET missing')
            throw new AppError('JWT_SECRET_MISSING', 'JWT secret missing', 500)
        }
        const accessToken = req.cookies?.access
        if (!accessToken) throw new AppError('USER_UNAUTHENTICATED', 'User unauthenticated!', 401)
        console.log(accessToken)
        try {
            const { sub } = jwt.verify(accessToken, JWT_SECRET, { algorithms: ["HS256"] })
            console.log("sub", sub)            
            if (typeof sub === 'string') {
                req.auth = { userId: sub }
                next()
            }
        } catch (error) {
            throw new AppError('ACCESS_TOKEN_EXPIRED', 'Session timed out', 401)
        }
    } catch (error) {
        console.log("error in middleware: ", error)
        if (error instanceof Error)
            console.log('Error in auth middleware: ', error.message)
        throw error
    }
}

export default checkAuth