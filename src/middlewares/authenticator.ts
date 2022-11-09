import { INextFunction, IRequest, IResponse } from '@/interfaces'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const authenticate = (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
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
    const { email, id } = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayload
    const user = { email, id }
    req.user = user
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
