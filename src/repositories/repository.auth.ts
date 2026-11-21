import bcrypt from "bcryptjs"
import UserServices from "../services/service.user.js"
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { AppError } from "../types/errors.js"
import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

const register = async (username: string, email: string, password: string) => {
    try {
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        await UserServices.register({ username, email, hashedPassword })
    } catch (error) {
        console.error('Error while registering user: ', error)
        if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000)
            throw new AppError('USER_ALREADY_EXISTS', 'Credentials already in use!', 409)
        throw new AppError('INTERNAL_SERVER_ERROR', 'Internal server error!', 500)
    }
}

const login = async (email: string, password: string) => {
    try {
        const userData = await UserServices.getByEmail(email.trim())
        if (!userData) throw new AppError('USER_NOT_FOUND', 'User not found!', 404)

        const { email: userEmail, username, hashedPassword } = userData
        const correctPassword = bcrypt.compareSync(password.trim(), hashedPassword)
        if (!correctPassword) throw new AppError('INCORRECT_CREDENTIALS', 'Invalid email or password', 401)

        if (!JWT_SECRET) throw new AppError('JWT_SECRET_MISSING', 'JWT secret missing', 500)
        const accessToken = jwt.sign({ username, email: userEmail, sub: String(userData._id), tokenUse: 'access' }, JWT_SECRET, { algorithm: "HS256", expiresIn: "15m" })
        const refreshToken = jwt.sign({ sub: String(userData._id), tokenUse: 'refresh' }, JWT_SECRET, { algorithm: "HS256", expiresIn: "7d" })

        return { email, username, accessToken, refreshToken }
    } catch (error) {
        console.error('Error while logging user: ', error)
        throw error
    }
}

const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    try {
        const user = await UserServices.getById(userId)
        if (!user) throw new AppError('USER_NOT_FOUND', 'User not found', 404)

        const { _id, hashedPassword } = user
        const correctPassword = bcrypt.compareSync(oldPassword.trim(), hashedPassword)
        if (!correctPassword) throw new AppError('INCORRECT_CREDENTIALS', 'Incorrect old password', 409)

        const salt = bcrypt.genSaltSync(10)
        const newHashedPassword = bcrypt.hashSync(newPassword.trim(), salt)
        await UserServices.changePassword(_id.toString(), newHashedPassword)
    } catch (error) {
        console.error('Error while changing password: ', error)
        throw error
    }
}

const refresh = async (refreshToken: string) => {
    if (!JWT_SECRET)
        throw new AppError('INTERNAL_SERVER_ERROR', 'Internal server error!', 500)

    let decoded: string | JwtPayload
    try {
        decoded = jwt.verify(refreshToken, JWT_SECRET, { algorithms: ['HS256'] })
    } catch {
        throw new AppError('REFRESH_TOKEN_EXPIRED', 'Refresh token is invalid or expired. Please log in again.', 401)
    }

    if (typeof decoded === 'string' || typeof decoded.sub !== 'string' || decoded.tokenUse !== 'refresh')
        throw new AppError('USER_UNAUTHENTICATED', 'Invalid refresh token. Please log in again.', 401)

    const user = await UserServices.getById(decoded.sub)
    if (!user) throw new AppError('USER_NOT_FOUND', 'User not found!', 404)

    const { _id, username, email } = user
    const accessToken = jwt.sign({ username, email, sub: String(_id), tokenUse: 'access' }, JWT_SECRET, { algorithm: "HS256", expiresIn: "15m" })

    return { accessToken, refreshToken }
}

const AuthRepository = { register, login, changePassword, refresh }
export default AuthRepository