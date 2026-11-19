import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import healthRouter from './routes/route.health.js'

dotenv.config()
const PORT = process.env.PORT || 8000
const app = express()

app.use(express.json())
app.use(cors({ origin: '*' })) // add configurations later

// routes
app.use('/api', healthRouter)

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})