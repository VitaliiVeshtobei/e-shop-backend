import { User } from '../scheme/user.js';
import { HttpError } from '../httpError/Error.js';
import { tokensCreator } from '../utils/tokensCreator.js';
import bcryptjs from 'bcryptjs';
import { Types } from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';

const { REFRESH_SECRET } = process.env;

interface iUser {
  name: string;
  lastName: string;
  phone: number;
  password: string;
  email: string;
}
export const addUserService = async (data: iUser) => {
  try {
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(data.password, salt);

    const user = await User.create({ ...data, password: hashedPassword });

    return user;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};

export const loginUserService = async (email: string, password: string) => {
  try {
    const emailCheck = email.toLowerCase();
    const user = await User.findOne({ email: emailCheck });

    if (!user) {
      throw new HttpError('Invalid email address or password', 400);
    }

    const isValidPass = await bcryptjs.compare(password, user.password);

    if (!isValidPass) {
      throw new HttpError('Invalid email address or password', 400);
    }

    const tokens = tokensCreator(user._id);

    if (tokens) {
      const { accessToken, refreshToken } = tokens;
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { accessToken, refreshToken },
        {
          new: true,
          fields: '-password -createdAt -updatedAt -verificationToken ',
        },
      );
      return updatedUser;
    }
  } catch (error: any) {
    throw new HttpError(error.message, error.code);
  }
};

export const logoutUserService = async (id: Types.ObjectId) => {
  try {
    await User.findByIdAndUpdate(id, { accessToken: null, refreshToken: null }, { new: true });
  } catch (error: any) {
    throw new HttpError(error.message, 404);
  }
};

export const setVerifyTokenService = async (verificationToken: string, id: Types.ObjectId | undefined) => {
  try {
    if (id) {
      await User.findByIdAndUpdate(id, { verificationToken });
    } else {
      throw new HttpError('no id', 400);
    }
  } catch (error: any) {
    throw new HttpError(error.message, 400);
  }
};

export const verifyUserEmailService = async (verificationToken: string) => {
  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw new HttpError('Not found', 404);
    }

    const tokens = tokensCreator(user._id);

    if (tokens) {
      const { accessToken, refreshToken } = tokens;
      await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: null,
        accessToken,
        refreshToken,
      });
      return { accessToken, refreshToken };
    }
  } catch (error: any) {
    throw new HttpError(error.message, error.code);
  }
};

export const refreshTokenService = async (verifiableToken: string) => {
  try {
    if (REFRESH_SECRET) {
      const { id } = jwt.verify(verifiableToken, REFRESH_SECRET) as JwtPayload;
      const checkTokenInDb = await User.findOne({
        refreshToken: verifiableToken,
      });

      if (!checkTokenInDb) {
        throw new HttpError('invalid token', 403);
      }
      const tokens = tokensCreator(id);
      if (tokens) {
        const { accessToken, refreshToken } = tokens;
        await User.findByIdAndUpdate(id, { accessToken, refreshToken }, { new: true });

        return { accessToken, refreshToken };
      }
    }
  } catch (error: any) {
    throw new HttpError(error.message, 403);
  }
};

export const getUserService = async (id: Types.ObjectId) => {
  try {
    const user = await User.findById(id, '-password -createdAt -updatedAt');
    if (!user?.accessToken) {
      throw new HttpError('Invalid email address or password', 401);
    }
    return user;
  } catch (error: any) {
    throw new HttpError(error.message, error.code);
  }
};
