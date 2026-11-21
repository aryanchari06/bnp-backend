import mongoose from "mongoose"
import User from "../models/model.user.js"

interface RegisterUserPayload {
    username: string
    email: string
    hashedPassword: string
}

const register = async (payload: RegisterUserPayload) => {
    return await User.create(payload)
}

const getByEmail = async (email: string) => {
    return await User.findOne({ email }).select('-id')
}

const getById = async (userId: string) => {
    return await User.findOne({ _id: new mongoose.Types.ObjectId(userId) }).select('-id')
}

const changePassword = async (userId: string, hashedPassword: string) => {
    return await User.updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $set: { hashedPassword } }
    )
}

const UserServices = { register, getByEmail, getById, changePassword }
export default UserServices