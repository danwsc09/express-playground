import {
  CommentController,
  HomeController,
  PostController,
  UserController,
} from '@/controllers'
import { authenticate } from '@/middlewares'
import { Router, Application } from 'express'
import { routes } from './constants'

const router = Router()

router.get(routes.main, HomeController.get)

router.get(routes.users, authenticate, UserController.getUsers)
router.post(routes.users, authenticate, UserController.postUsers)
router.post(routes.login, UserController.login)

router.get(routes.posts, PostController.getPosts)
router.post(routes.posts, authenticate, PostController.createPost)
router.delete(
  `${routes.posts}/:postId`,
  authenticate,
  PostController.deletePost
)
router.put(`${routes.posts}/:postId`, authenticate, PostController.editPost)

router.get(`${routes.comments}/:postId`, CommentController.getComments)
router.post(
  `${routes.comments}/:postId`,
  authenticate,
  CommentController.createComment
)

export const mountRoutes = (express: Application): Application => {
  return express.use('/', router)
}
