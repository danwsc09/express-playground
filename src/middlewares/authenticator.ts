import { INextFunction, IRequest, IResponse } from '@/interfaces'

export const authenticate = (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  console.log(req.headers)
  next()
}
