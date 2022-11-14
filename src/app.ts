import express from 'express'
import dotenv from 'dotenv'
import { mountRoutes } from './routes'
import {
  loggingMiddleware,
  errorLogger,
  errorResponder,
  failSafeHandler,
} from '@/middlewares'
dotenv.config()

const app = express()
app.use(express.json())
app.use(loggingMiddleware)

mountRoutes(app)

app.use(errorLogger)
app.use(errorResponder)
app.use(failSafeHandler)

export default app
