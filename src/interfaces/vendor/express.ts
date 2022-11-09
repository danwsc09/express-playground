import { NextFunction, Request, Response } from 'express'
import { UserWithId } from '../user'

export type IRequest = Request & {
  user?: UserWithId
}

export type IResponse = Response

export type INextFunction = NextFunction
