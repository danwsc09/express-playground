import pool from '@/db'
import {
  HttpException,
  INextFunction,
  IRequest,
  IResponse,
  Post,
  User,
} from '@/interfaces'
import { getEmailFromToken } from '@/utils/getEmailFromToken'

const readPostsQuery = {
  text: 'SELECT * FROM POSTS',
}

const findUserIdByEmail = (email: string) => ({
  text: 'SELECT id FROM users WHERE email = $1',
  values: [email],
})

const createPostQuery = (title: string, content: string, authorId: number) => ({
  text: 'INSERT INTO posts(author_id, create_date, content, title) VALUES($1, $2, $3, $4) returning id',
  values: [authorId, new Date(), content, title],
})

const deletePostQuery = (postId: number, authorId: number) => ({
  text: 'DELETE FROM posts WHERE id = $1 AND author_id = $2',
  values: [postId, authorId],
})

const updatePostQuery = ({
  author_id,
  content,
  id,
  title,
}: Omit<Post, 'create_date' | 'update_date'>) => ({
  text: 'UPDATE posts SET content = $1, title = $2, update_date = NOW() WHERE id = $3 AND author_id = $4 RETURNING id',
  values: [content, title, id, author_id],
})

class UserController {
  static async getPosts(req: IRequest, res: IResponse, next: INextFunction) {
    try {
      const result = await pool.query(readPostsQuery)
      res.send(result.rows)
    } catch {
      next(new HttpException(500, 'Error while reading post'))
    }
  }

  static async createPost(req: IRequest, res: IResponse, next: INextFunction) {
    const { content, title } = req.body
    const user = req.user as User

    const { email, id: userId } = user
    try {
      const result = await pool.query(createPostQuery(title, content, userId))
      const postId = result.rows[0].id

      res.status(201).json({
        id: postId,
        email,
        title,
        content,
      })
    } catch (err) {
      next(new HttpException(500, 'Error while creating post'))
    }
  }

  static async deletePost(req: IRequest, res: IResponse, next: INextFunction) {
    const { postId } = req.params
    if (isNaN(+postId)) {
      next(new HttpException(400, 'Invalid post id'))
      return
    }

    const authHeader = req.headers.authorization
    const email = getEmailFromToken(authHeader.split(' ')[1])

    let userResult
    try {
      userResult = await pool.query(findUserIdByEmail(email))
      if (userResult.rowCount !== 1) {
        next(new HttpException(401, 'Email not found'))
        return
      }
    } catch {
      next(new HttpException(500, 'Error while reading email'))
    }

    const userId = userResult.rows[0].id
    try {
      const result = await pool.query(deletePostQuery(+postId, userId))

      if (result.rowCount === 0) {
        next(new HttpException(400, 'post not found'))
        return
      }

      res.sendStatus(200)
    } catch {
      next(new HttpException(500, 'Error while deleting post'))
    }
  }

  static async editPost(req: IRequest, res: IResponse, next: INextFunction) {
    const { content, title } = req.body
    const { postId } = req.params

    if (isNaN(+postId)) {
      next(new HttpException(400, 'Invalid post id'))
      return
    }

    const authHeader = req.headers.authorization
    const email = getEmailFromToken(authHeader.split(' ')[1])
    let userResult

    try {
      userResult = await pool.query(findUserIdByEmail(email))

      if (userResult.rowCount !== 1) {
        next(new HttpException(401, 'Email not found'))
        return
      }
    } catch {
      next(new HttpException(500, 'Cant find email given id'))
      return
    }

    const userId = userResult.rows[0].id
    const updatedPost = {
      id: +postId,
      author_id: userId,
      content,
      title,
    }

    try {
      const q = updatePostQuery(updatedPost)
      const result = await pool.query(q)

      if (result.rowCount !== 1) {
        next(new HttpException(401, 'Bad request'))
        return
      }
    } catch (err) {
      next(new HttpException(500, 'Error while updating post'))
      return
    }
    res.sendStatus(200)
  }
}

export default UserController
