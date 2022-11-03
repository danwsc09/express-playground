import { HomeController } from '@/controllers'
import { Router, Application } from 'express'

const router = Router()

router.get('/', HomeController.get)

export const mountRoutes = (express: Application): Application => {
  return express.use('/', router)
}
