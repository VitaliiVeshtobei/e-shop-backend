import axios from 'axios';
import { HttpError } from '../httpError/Error.js';

const { BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

export const getGoogleToken = async (code: string) => {
  return await axios({
    method: 'post',
    url: 'https://oauth2.googleapis.com/token',
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL}/api/auth/google-redirect`,
      grant_type: 'authorization_code',
      code,
    },
  });
};
interface iUserData {
  email: string;
  verified_email: string;
  picture: string;
  given_name: string;
  family_name: string;
}
export const getUserData = async (accessGoogleToken: string): Promise<iUserData> => {
  // return await axios({
  //   method: 'get',
  //   url: 'https://www.googleapis.com/oauth2/v2/userinfo',
  //   headers: {
  //     Authorization: `Bearer ${accessGoogleToken}`,
  //   },
  // });
  try {
    const { data } = await axios({
      method: 'get',
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      headers: {
        Authorization: `Bearer ${accessGoogleToken}`,
      },
    });
    return data;
  } catch (error: any) {
    throw new HttpError('no userData', 400);
  }
};
