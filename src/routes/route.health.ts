import express from 'express'
import { health } from '../controllers/controller.health.js'
const router = express.Router()

router.get('/health', health)

export default router