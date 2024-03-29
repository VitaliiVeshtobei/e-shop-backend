import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const key: string | undefined = process.env.SENDGRID_API_KEY;
const { BACKEND_URL_DEV, BACKEND_URL_PROD, NODE_ENV } = process.env;

if (key) {
  sgMail.setApiKey(key);
}

export const sendEmail = async (emailUser: string, verificationToken: string) => {
  const data = {
    to: emailUser,
    subject: 'Підтвердження email',
    html: `<a target="_blank" href="${
      NODE_ENV === 'development' ? BACKEND_URL_DEV : BACKEND_URL_PROD
    }/api/user/verify/${verificationToken}">Підтвердити email</a>`,
    // html: `<a target="_blank" href="${BASE_URL}/api/user/verify/${verificationToken}">Підтвердити email</a>`,
  };
  const email = { ...data, from: 'veshtobey@gmail.com' };
  try {
    await sgMail.send(email);
  } catch (error) {
    // console.log(error);

    throw error;
  }
};
