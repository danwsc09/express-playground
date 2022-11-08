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

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    /*
    // const result = jwt.decode(token)
    if ((result as { exp: number }).exp * 1000 < Date.now()) {
      res.status(401).send({ message: 'token expired' })
      return
    }
    */
  } catch (err) {
    res.status(401).send({ message: 'bad token' })
    return
  }

  next()
}
