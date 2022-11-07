import { HomeController, UserController } from '@/controllers'
import { authenticate } from '@/middlewares'
import { Router, Application } from 'express'

const router = Router()

router.get('/', HomeController.get)

router.get('/users', authenticate, UserController.getUsers)
router.post('/users', authenticate, UserController.postUsers)
router.post('/login', UserController.login)

export const mountRoutes = (express: Application): Application => {
  return express.use('/', router)
}
