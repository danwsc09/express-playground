import express from 'express'
import dotenv from 'dotenv'
import { mountRoutes } from './routes'
import {
  loggingMiddleware,
  errorLogger,
  errorResponder,
  failSafeHandler,
} from '@/middlewares'
import redisClient from './redis'
import axios from 'axios'
dotenv.config()

const app = express()
app.use(express.json())
app.use(loggingMiddleware)

mountRoutes(app)

app.get('/pew', async (req, res, next) => {
  console.log('pew', req.path)

  const data = await redisClient.get('/photos/5')

  if (data) {
    res.json(JSON.parse(data))
    return
  }

  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/photos/5'
  )
  redisClient.setEx('/photos/5', 3600, JSON.stringify(response.data))

  res.json(response.data)
})

app.use(errorLogger)
app.use(errorResponder)
app.use(failSafeHandler)

export default app
