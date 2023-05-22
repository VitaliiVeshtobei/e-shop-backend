import { Request, Response } from 'express';
import { Document, Model, Types } from 'mongoose';
import { User } from '../scheme/user.js';
import {
  addUserService,
  getUserService,
  loginUserService,
  logoutUserService,
  refreshTokenService,
  setVerifyTokenService,
  verifyUserEmailService,
} from '../services/user.js';
import { nanoid } from 'nanoid';
import { sendEmail } from '../utils/sendEmail.js';
import { HttpError } from '../httpError/Error.js';

import dotenv from 'dotenv';

dotenv.config();

export const newUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const verificationToken = nanoid();
    await sendEmail(req.body.email, verificationToken);
    const user = await addUserService({ ...req.body, verificationToken });

    return res.status(201).json({ user });
  } catch (err: any) {
    return res.status(err.code || 500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email: userEmail, password } = req.body;
    const user = await loginUserService(userEmail, password);

    if (!user?.verify) {
      const verificationToken = nanoid();
      await setVerifyTokenService(verificationToken, user?._id);
      await sendEmail(req.body.email, verificationToken);
      throw new HttpError(`Please confirm the mail ${userEmail}`, 400);
    }
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(error.code).json({ message: error.message });
  }
};

interface RequestWithUser extends Request {
  user?: Document | Model<typeof User>;
}

export const logout = async (req: RequestWithUser, res: Response): Promise<Response> => {
  const { _id } = req.user as { _id: Types.ObjectId };

  try {
    await logoutUserService(_id);
    return res.status(201).json({ message: 'The exit was successful' });
  } catch (error: any) {
    return res.status(error.code).json({ message: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<Response | void> => {
  const { verificationToken } = req.params;

  try {
    const tokens = await verifyUserEmailService(verificationToken);

    if (tokens) {
      const { accessToken, refreshToken } = tokens;

      res.redirect(`${process.env.FRONTEND_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } else {
      throw new Error('Tokens not found');
    }
  } catch (error: any) {
    return res.status(error.code || 500).json({ message: error.message });
  }
};

export const refreshTokenController = async (req: Request, res: Response): Promise<Response> => {
  const { refreshToken: receivedToken } = req.body;

  try {
    const tokens = await refreshTokenService(receivedToken);
    if (tokens) {
      const { accessToken, refreshToken } = tokens;

      return res.status(201).json({ accessToken, refreshToken });
    } else {
      throw new HttpError('no tokens', 400);
    }
  } catch (error: any) {
    return res.status(error.code).json({ message: error.message });
  }
};

export const getUser = async (req: RequestWithUser, res: Response): Promise<Response> => {
  const { _id } = req.user as { _id: Types.ObjectId };
  try {
    const userInfo = await getUserService(_id);
    return res.status(201).json(userInfo);
  } catch (error: any) {
    return res.status(error.code).json({ message: error.message });
  }
};
