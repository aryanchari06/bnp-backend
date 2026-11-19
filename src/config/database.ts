import mongoose from "mongoose";

const databaseUrl = process.env.DATABASE_URL

export const connectDB = async () => {
    if (!databaseUrl) return
    try {
        const db = await mongoose.connect(databaseUrl, { connectTimeoutMS: 10000 })
        console.log('MongoDB connected!')
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.log('MongoDB connection error: ', message)
        throw new Error('Failed to connect to DB!')
    }
}