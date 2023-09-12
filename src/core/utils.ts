import { NextFunction, Request, Response } from 'express'
import { Logger } from './logger'

export function Wrap(controller: CallableFunction) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next)
    } catch (error) {
      Logger.error(error)
      const statusCode = 500
      return res.status(statusCode).json({
        error: {
          message: 'Internal Server Error.',
          statusCode,
          errors: error ? [error.toString()] : undefined,
        },
      })
    }
  }
}
