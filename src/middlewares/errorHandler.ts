import { INextFunction, IRequest, IResponse, IError } from '@/interfaces'

export const errorLogger = (
  error: IError,
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  // for logging errors
  console.error(error) // or using any fancy logging library
  next(error) // forward to next middleware
}

export const errorResponder = (
  error: IError,
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  // responding to client
  if (error.type == 'redirect') res.redirect('/error')
  else if (error.type == 'time-out')
    // arbitrary condition check
    res.status(408).send(error)
  else next(error) // forwarding exceptional case to fail-safe middleware
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
