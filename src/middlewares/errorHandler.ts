import { INextFunction, IRequest, IResponse, IError } from '@/interfaces'
import { HttpException } from '@/interfaces'

export const errorLogger = (
  err: IError,
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  console.error('\x1b[31m', err) // adding some color to our logs
  next(err) // calling next middleware
}

export const errorResponder = (
  err: HttpException,
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  // res.header('Content-Type', 'application/json')
  res.status(err.status).send(JSON.stringify(err, null, 4))
}

export const failSafeHandler = (
  error: IError,
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  // generic handler
  res.status(500).send(error)
}
