import mongoose from "mongoose";
import { AppError } from "../types/errors.js";
import dns from 'dns'
import dotenv from 'dotenv'

dotenv.config()
dns.setServers(['1.1.1.1', '8.8.8.8'])

const databaseUrl = process.env.DATABASE_URL

export const connectDB = async () => {
    if (!databaseUrl) return
    try {
        const db = await mongoose.connect(databaseUrl, { connectTimeoutMS: 10000 })
        console.log('MongoDB connected!')
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.log('MongoDB connection error: ', message)
        throw new AppError('DATABASE_CONNECTION_FAILED', 'Failed to connect to DB!', 500)
    }
}