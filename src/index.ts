import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import healthRouter from './routes/route.health.js'
import authRouter from './routes/route.auth.js'
import todoRouter from './routes/route.todo.js'
import errorHandler from './middlewares/middleware.error-handler.js'
import { connectDB } from './config/database.js'

dotenv.config()
const PORT = process.env.PORT || 8000
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})) // add configurations later

// routes
app.use('/api', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/todos', todoRouter)

//error handler middleware
app.use(errorHandler)

try {
    await connectDB()
} catch (error) {
    console.error(error)
    throw new Error("Failed to connect to database.")
}

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})