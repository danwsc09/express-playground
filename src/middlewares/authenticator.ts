import { INextFunction, IRequest, IResponse } from '@/interfaces'
import { UnauthorizedError } from '@/interfaces/errors'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const authenticate = (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    const err = new UnauthorizedError()
    next(err)
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
    next()
  } catch (err) {
    const error = new UnauthorizedError('Invalid token!!')
    next(error)
  }
}
