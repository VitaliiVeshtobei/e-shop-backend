// Works only 7 version with commonJS !
import qs from 'qs';
import { nanoid } from 'nanoid';
import bcryptjs from 'bcryptjs';
import { User } from '../scheme/user.js';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/Error.js';
import { tokensCreator } from '../utils/tokensCreator.js';
import { getGoogleToken, getUserData } from '../services/google.js';

// const { createLoginInfoMail } = require('../helpers/createMail');
// const { sendMail } = require('../helpers/sendMail');

const { BACKEND_URL_DEV, GOOGLE_CLIENT_ID, FRONTEND_URL_DEV, BACKEND_URL_PROD, FRONTEND_URL_PROD, NODE_ENV } =
  process.env;

export const googleAuth = async (_: any, res: Response) => {
  const stringifiedParams = qs.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${NODE_ENV === 'development' ? BACKEND_URL_DEV : BACKEND_URL_PROD}/api/auth/google-redirect`,
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'].join(
      ' ',
    ),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`);
};

export const googleRedirect = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    //  Create full URL after google redirect from request Obj
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    // // // Create Object from URL string
    const urlObj = new URL(fullUrl);

    const urlParams = qs.parse(urlObj.search);

    const code = urlParams?.['?code'] as string;

    // // Get access token from google
    const tokenData = await getGoogleToken(code);

    // Get user data from google
    const userData = await getUserData(tokenData.data.access_token);
    const { email, verified_email: verifiedGoogleEmail, given_name: name, family_name: lastName } = userData;
    let user = await User.findOne({ email });

    if (!user) {
      const createdPassword = nanoid(8);
      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(createdPassword, salt);
      user = await User.create({
        email,
        password: hashedPassword,
        verify: verifiedGoogleEmail,
        verificationToken: 'null',
        name,
        lastName,
        phone: null,
      });

      // const mail = createLoginInfoMail(email, createdPassword);
      // await sendMail(mail);
    }
    const tokens = tokensCreator(user._id);
    if (tokens) {
      const { accessToken, refreshToken } = tokens;
      const updatedUser = await User.findByIdAndUpdate(user._id, { accessToken, refreshToken }, { new: true });
      if (updatedUser) {
        return res.redirect(
          `${NODE_ENV === 'development' ? FRONTEND_URL_DEV : FRONTEND_URL_PROD}?accessToken=${
            updatedUser.accessToken
          }&refreshToken=${updatedUser.refreshToken}`,
        );
      } else {
        throw new HttpError('No update user', 400);
      }
    } else {
      throw new HttpError('No tokens', 400);
    }
  } catch (error: any) {
    return res.status(400).json({ message: error });
  }
};
