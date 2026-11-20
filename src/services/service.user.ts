import mongoose from "mongoose"
import User from "../models/model.user.js"
import type { Network } from "node:inspector"

interface RegisterUserPayload {
    username: string
    email: string
    hashedPassword: string
}

export const registerUser = async (payload: RegisterUserPayload) => {
    return await User.create(payload)
}

export const getByEmail = async (email: string) => {
    return await User.findOne({ email }).select('-id')
}

export const getById = async (userId: string) => {
    return await User.findOne({ _id: new mongoose.Types.ObjectId(userId) }).select('-id')
}

export const changeUserPassword = async (userId: string, hashedPassword: string) => {
    return await User.updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $set: { hashedPassword } }
    )
}