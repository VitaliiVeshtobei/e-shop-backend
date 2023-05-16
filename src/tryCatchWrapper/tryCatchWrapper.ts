import { json } from 'stream/consumers';
import { HttpError } from '../httpError/Error.js';
import { Response, Request, NextFunction } from 'express';

export const tryCatchWrapper = (
  endpointFn: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await endpointFn(req, res, next);
    } catch (error: any) {
      const statusCode = error.code || 500;
      return res.status(statusCode).json(error.message);
    }
  };
};
