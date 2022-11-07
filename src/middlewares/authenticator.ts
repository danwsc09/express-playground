import { INextFunction, IRequest, IResponse } from '@/interfaces'
import jwt from 'jsonwebtoken'

export const authenticate = (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  console.log(req.headers)
  if (!req.headers.authorization) {
    res.status(401).send({ message: 'you must be authenticated' })
    return
  }

  if (!req.headers.authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: 'invalid token' })
    return
  }

  const token = req.headers.authorization.split(' ')[1]

  /*
  const { exp, email }: { exp: number; email: string } = jwt.verify(
    token,
    process.env.JWT_SECRET
  )
  if (exp * 1000 < Date.now()) {
    res.status(401).send({ message: 'token expired' })
    return
  }
  */
  next()
}
