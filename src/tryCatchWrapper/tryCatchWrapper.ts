import { HttpError } from '../httpError/Error.js';
import { Response, Request, NextFunction } from 'express';

export const tryCatchWrapper = (endpointFn: (req: Request, res: Response, next: NextFunction) => Promise<Response>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await endpointFn(req, res, next);
    } catch (error: any) {
      throw new HttpError(error.code, error.message);
    }
  };
};
