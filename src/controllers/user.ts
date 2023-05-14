import { Request, Response } from 'express';
import { addUserService, verifyUserEmailService } from '../services/user.js';
import { nanoid } from 'nanoid';
import { sendEmail } from '../utils/sendEmail.js';

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

export const verifyEmail = async (req: Request, res: Response): Promise<Response | void> => {
  const { verificationToken } = req.params;

  try {
    const tokens = await verifyUserEmailService(verificationToken);

    if (tokens) {
      const { accessToken, refreshToken } = tokens;
      return res.redirect(`${process.env.FRONTEND_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } else {
      throw new Error('Tokens not found');
    }
  } catch (error: any) {
    return res.status(error.code || 500).json({ message: error.message });
  }
};
