import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { AppError } from "../types/errors.js";
import dotenv from "dotenv";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!JWT_SECRET)
        return next(new AppError('JWT_SECRET_MISSING', 'JWT secret missing', 500))

    const accessToken = req.cookies?.access
    if (!accessToken)
        return next(new AppError('USER_UNAUTHENTICATED', 'User unauthenticated!', 401))

    let decoded: string | JwtPayload
    try {
        decoded = jwt.verify(accessToken, JWT_SECRET, { algorithms: ["HS256"] })
    } catch {
        return next(new AppError('ACCESS_TOKEN_EXPIRED', 'Access token is invalid or expired.', 401))
    }

    if (typeof decoded === 'string' || decoded.tokenUse !== 'access' || typeof decoded.sub !== 'string')
        return next(new AppError('USER_UNAUTHENTICATED', 'Invalid access token.', 401))

    req.auth = { userId: decoded.sub }
    return next()
}

export default checkAuth