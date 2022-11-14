import pool from '@/db'
import { INextFunction, IRequest, IResponse, Post, User } from '@/interfaces'
import { getEmailFromToken } from '@/utils/getEmailFromToken'
import { isNamedExportBindings } from 'typescript'

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
  static async getPosts(req: IRequest, res: IResponse) {
    const result = await pool.query(readPostsQuery)
    res.send(result.rows)
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
      next(err)
    }
  }

  static async deletePost(req: IRequest, res: IResponse) {
    const { postId } = req.params
    if (isNaN(+postId)) {
      res.status(400).send({ message: 'invalid post id' })
      return
    }

    const authHeader = req.headers.authorization
    const email = getEmailFromToken(authHeader.split(' ')[1])
    const userResult = await pool.query(findUserIdByEmail(email))

    if (userResult.rowCount !== 1) {
      res.status(401).json({ message: 'email not found' })
      return
    }

    const userId = userResult.rows[0].id

    const result = await pool.query(deletePostQuery(+postId, userId))

    if (result.rowCount === 0) {
      res.status(400).json({ message: 'post not found' })
      return
    }

    res.sendStatus(200)
  }

  static async editPost(req: IRequest, res: IResponse) {
    const { content, title } = req.body
    const { postId } = req.params
    if (isNaN(+postId)) {
      res.status(400).send({ message: 'invalid post id' })
      return
    }

    const authHeader = req.headers.authorization
    const email = getEmailFromToken(authHeader.split(' ')[1])
    const userResult = await pool.query(findUserIdByEmail(email))

    if (userResult.rowCount !== 1) {
      res.status(401).json({ message: 'email not found' })
      return
    }

    const userId = userResult.rows[0].id
    // const currentDate = new Date()
    const updatedPost = {
      id: +postId,
      author_id: userId,
      content,
      title,
      // update_date: currentDate,
    }

    try {
      const q = updatePostQuery(updatedPost)
      const result = await pool.query(q)

      if (result.rowCount !== 1) {
        res.status(401).json({ message: 'bad request' })
        return
      }
    } catch (err) {
      console.log(err)
      res.sendStatus(500)
      return
    }
    res.sendStatus(200)
  }
}

export default UserController
