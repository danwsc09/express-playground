import express from 'express'
import dotenv from 'dotenv'
import { mountRoutes } from './routes'
import { loggingMiddleware } from '@/middlewares'
dotenv.config()

const app = express()
app.use(loggingMiddleware)

mountRoutes(app)

export default app
