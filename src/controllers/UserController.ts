import { JWT_EXPIRES_IN } from '@/constants/auth'
import pool from '@/db'
import { IRequest, IResponse, User } from '@/interfaces'
import bcypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const getUsersQuery = {
  text: 'SELECT * FROM users',
}

const postUsersQuery = (email: string, hashedPass: string) => ({
  text: 'INSERT INTO users(email, password, created_on) VALUES($1, $2, $3)',
  values: [email, hashedPass, new Date()],
})

const getUserByEmailQuery = (email: string) => ({
  text: 'SELECT * FROM users WHERE email = $1',
  values: [email],
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
      await pool.query(query, (err, result) => {
        if (err) {
          res.status(400).send({ message: 'email already exists' })
          return
        }
        res.sendStatus(201)
      })
    } catch {
      res.sendStatus(500)
    }
  }

  static async login(req: IRequest, res: IResponse) {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).send('invalid email or password')
      return
    }

    try {
      const result = await pool.query(getUserByEmailQuery(email))
      if (result.rowCount === 0) {
        res.status(400).send('invalid email')
        return
      }

      const user: User = result.rows[0]
      const isPasswordMatch = await bcypt.compare(password, user.password)

      if (!isPasswordMatch) {
        res.status(400).send('invalid password')
        return
      }

      // generate JWT and send back to user
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      })

      const { password: _, ...userInfo } = user
      res.status(200).json({ ...userInfo, token })
    } catch {
      res.status(500)
    }
  }
}

export default UserController
