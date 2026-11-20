import bcrypt from "bcryptjs"
import { getByEmail, getById, registerUser, changeUserPassword } from "../services/service.user.js"
import jwt from 'jsonwebtoken'
import { AppError } from "../types/errors.js"
import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

export const register = async (username: string, email: string, password: string) => {
    try {
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        await registerUser({ username, email, hashedPassword })
    } catch (error) {
        console.error('Error while registering user: ', error)
        if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000)
            throw new AppError('USER_ALREADY_EXISTS', 'Credentials already in use!', 409)
        throw new AppError('INTERNAL_SERVER_ERROR', 'Internal server error!', 500)
    }
}

export const login = async (email: string, password: string) => {
    try {
        const userData = await getByEmail(email.trim())
        if (!userData) throw new AppError('USER_NOT_FOUND', 'User not found!', 404)

        const { email: userEmail, username, hashedPassword } = userData
        const correctPassword = bcrypt.compareSync(password.trim(), hashedPassword)
        if (!correctPassword) throw new AppError('INCORRECT_CREDENTIALS', 'Invalid email or password', 401)

        if (!JWT_SECRET) throw new AppError('JWT_SECRET_MISSING', 'JWT secret missing', 500)
        const accessToken = jwt.sign({ username, email: userEmail, sub: String(userData._id) }, JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" })
        const refreshToken = jwt.sign({}, JWT_SECRET, { algorithm: "HS256", expiresIn: "7d" })

        return { email, username, accessToken, refreshToken }
    } catch (error) {
        console.error('Error while logging user: ', error)
        throw error
    }
}

export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    try {
        const user = await getById(userId)
        if (!user) throw new AppError('USER_NOT_FOUND', 'User not found', 404)

        const { _id, hashedPassword } = user
        const correctPassword = bcrypt.compareSync(oldPassword.trim(), hashedPassword)
        if (!correctPassword) throw new AppError('INCORRECT_CREDENTIALS', 'Incorrect old password', 409)

        const salt = bcrypt.genSaltSync(10)
        const newHashedPassword = bcrypt.hashSync(newPassword.trim(), salt)
        await changeUserPassword(_id.toString(), newHashedPassword)
    } catch (error) {
        console.error('Error while changing password: ', error)
        throw error
    }
}