import { User } from '../scheme/user.js';
import { HttpError } from '../httpError/Error.js';
import { tokensCreator } from '../utils/tokensCreator.js';
import bcryptjs from 'bcryptjs';

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

export const verifyUserEmailService = async (verificationToken: string) => {
  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw new HttpError('Not found', 404);
    }
    // const { accessToken, refreshToken } = tokensCreator(user._id);

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
