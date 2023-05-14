import dotenv from 'dotenv';

dotenv.config();
const { ACCESS_SECRET, REFRESH_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = process.env;

import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const tokensCreator = (userID: Types.ObjectId): { accessToken: string; refreshToken: string } | undefined => {
  // Creating payload for jwt
  const payload = { id: userID };
  // Generate tokens
  if (ACCESS_SECRET && REFRESH_SECRET) {
    const accessToken = jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    return { accessToken, refreshToken };
  }

  // Use { accessToken, refreshToken } = tokensCreator(userId) to get tokens
  return undefined;
};
