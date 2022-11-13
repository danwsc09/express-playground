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

app.use(errorLogger)
app.use(errorResponder)
app.use(failSafeHandler)

mountRoutes(app)

export default app
