import pool from '@/db'
import { IRequest, IResponse } from '@/interfaces'
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
  // TODO: write the comment API
  static async getComments(req: IRequest, res: IResponse) {
    const { postId } = req.params
    if (isNaN(+postId)) {
      res.status(400).json({ message: 'invalid post id' })
      return
    }

    const result = await pool.query(getCommentsByPostIdQuery(+postId))

    res.json(result.rows)
    return
  }

  static async createComment(req: IRequest, res: IResponse) {
    const { postId } = req.params
    const { content } = req.body
    const { user } = req

    if (!user) {
      res.status(401).json({ message: 'you must be logged in' })
      return
    }

    const now = new Date()
    const result = await pool.query(
      createComment({
        content,
        author_id: user.id,
        post_id: +postId,
        create_date: now,
      })
    )
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
