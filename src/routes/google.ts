import express from 'express';
import { tryCatchWrapper } from '../tryCatchWrapper/tryCatchWrapper.js';
import { googleAuth, googleRedirect } from '../controllers/google.js';

export const authGoogleRouter = express.Router();

authGoogleRouter.get('/google', tryCatchWrapper(googleAuth));
authGoogleRouter.get('/google-redirect', tryCatchWrapper(googleRedirect));
