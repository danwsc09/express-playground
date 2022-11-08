import { INextFunction, IRequest, IResponse } from '@/interfaces'

export const loggingMiddleware = (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  console.log(req.method, req.path, req.ip, new Date())
  next()
}
