import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import healthRouter from './routes/route.health.js'
import authRouter from './routes/route.auth.js'
import todoRouter from './routes/route.todo.js'
import errorHandler from './middlewares/middleware.error-handler.js'

dotenv.config()
const PORT = process.env.PORT || 8000
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors({ origin: '*' })) // add configurations later

// routes
app.use('/api', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/todos', todoRouter)

//error handler middleware
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})