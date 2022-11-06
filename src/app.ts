import express from 'express'
import dotenv from 'dotenv'
import { mountRoutes } from './routes'
import { authenticate, loggingMiddleware } from '@/middlewares'
dotenv.config()

const app = express()
app.use(express.json())
app.use(loggingMiddleware)
app.use(authenticate)

mountRoutes(app)

export default app
