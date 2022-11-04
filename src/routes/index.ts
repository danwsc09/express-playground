import { HomeController, UserController } from '@/controllers'
import { Router, Application } from 'express'

const router = Router()

router.get('/', HomeController.get)

router.get('/users', UserController.getUsers)
router.post('/users', UserController.postUsers)

export const mountRoutes = (express: Application): Application => {
  return express.use('/', router)
}
