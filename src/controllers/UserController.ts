import pool from '@/db'
import { IRequest, IResponse } from '@/interfaces'
import bcypt from 'bcrypt'

const getUsersQuery = {
  text: 'SELECT * FROM USERS',
}

const postUsersQuery = (email: string, hashedPass: string) => ({
  text: 'INSERT INTO users(email, password, created_on) VALUES($1, $2, $3)',
  values: [email, hashedPass, new Date()],
})

class UserController {
  static async getUsers(req: IRequest, res: IResponse) {
    const result = await pool.query(getUsersQuery)
    res.send(result.rows)
  }

  static async postUsers(req: IRequest, res: IResponse) {
    const { email, password } = req.body
    try {
      const hashedPassword = await bcypt.hash(password, 10)
      const query = postUsersQuery(email, hashedPassword)
      await pool.query(query)
      res.sendStatus(201)
    } catch {
      res.sendStatus(500)
    }
  }
}

export default UserController
