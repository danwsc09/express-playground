import pool from '@/db'
import {
  HttpException,
  INextFunction,
  IRequest,
  IResponse,
  User,
} from '@/interfaces'
import { Comment } from '@/interfaces/comment'

const getCommentsByPostIdQuery = (postId: number) => ({
  text: 'SELECT * FROM comments WHERE post_id = $1',
  values: [postId],
})

const createComment = ({
  content,
  author_id,
  post_id,
  create_date,
}: Omit<Comment, 'id' | 'update_date'>) => ({
  text: 'INSERT INTO comments(content, user_id, post_id, create_date) VALUES ($1, $2, $3, $4) RETURNING id',
  values: [content, author_id, post_id, create_date],
})

class CommentController {
  static async getComments(req: IRequest, res: IResponse, next: INextFunction) {
    const { postId } = req.params
    if (isNaN(+postId)) {
      next(new HttpException(400, 'Invalid post id'))
      return
    }

    try {
      const result = await pool.query(getCommentsByPostIdQuery(+postId))
      res.json(result.rows)
    } catch {
      next(new HttpException(500, 'Error while retrieving comments'))
    }
  }

  static async createComment(
    req: IRequest,
    res: IResponse,
    next: INextFunction
  ) {
    const { postId } = req.params
    const { content } = req.body
    const user = req.user as User

    const now = new Date()
    let result
    try {
      result = await pool.query(
        createComment({
          content,
          author_id: user.id,
          post_id: +postId,
          create_date: now,
        })
      )
    } catch {
      next(new HttpException(500, 'Error while creating comment'))
      return
    }
    const newComment: Comment = {
      author_id: user.id,
      content,
      id: result.rows[0].id,
      post_id: +postId,
      create_date: now,
      update_date: null,
    }
    res.json(newComment)
  }
}

export default CommentController
