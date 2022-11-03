import express from 'express'
import dotenv from 'dotenv'
import { mountRoutes } from './routes'
import logger from '@/middlewares'
dotenv.config()

const app = express()
app.use(logger)

mountRoutes(app)

export default app
