import pool from '@/db'
import { IRequest, IResponse } from '@/interfaces'
import { getEmailFromToken } from '@/utils/getEmailFromToken'

const readPostsQuery = {
  text: 'SELECT * FROM POSTS',
}

const getEmailId = (email: string) => ({
  text: 'SELECT id FROM users WHERE email = $1',
  values: [email],
})

const createPostQuery = (title: string, content: string, emailId: string) => ({
  text: 'INSERT INTO posts(author_id, create_date, content, title) VALUES($1, $2, $3, $4) RETURNING id',
  values: [emailId, new Date(), content, title],
})

class UserController {
  static async getPosts(req: IRequest, res: IResponse) {
    const result = await pool.query(readPostsQuery)
    res.send(result.rows)
  }

  static async createPost(req: IRequest, res: IResponse) {
    const { content, title } = req.body
    const authHeader = req.headers.authorization
    const email = getEmailFromToken(authHeader.split(' ')[1])
    const emailResult = await pool.query(getEmailId(email))

    if (emailResult.rowCount !== 1) {
      res.status(401).json({ message: 'email not found' })
      return
    }

    const emailId = emailResult.rows[0].id
    console.log(emailId)

    const result = await pool.query(createPostQuery(title, content, emailId))
    const postId = result.rows[0].id

    res.status(201).json({
      id: postId,
      email,
      title,
      content,
    })
  }
}

export default UserController
