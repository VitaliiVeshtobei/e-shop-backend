import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpError } from '../httpError/Error.js';
import { Document, Model } from 'mongoose';

const { ACCESS_SECRET } = process.env;

import { User } from '../scheme/user.js';
import { NextFunction, Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: Document | Model<typeof User>;
}

export const auth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { authorization = '' } = req.headers;
  const [typeAuth, accessToken] = authorization.split(' ');

  try {
    if (typeAuth !== 'Bearer') {
      throw new HttpError('Invalid type of authorization', 401);
    }
    if (ACCESS_SECRET) {
      const { id } = jwt.verify(accessToken, ACCESS_SECRET) as JwtPayload;
      const user = await User.findById(id);
      if (!user || !user.accessToken) {
        throw new HttpError('Not authorized', 401);
      }

      req.user = user;

      next();
    } else {
      throw new HttpError('my error sacsdcdscscs', 400);
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'jwt expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'invalid token' });
    } else {
      return res.status(error.code).json(error.message);
    }
  }
};
