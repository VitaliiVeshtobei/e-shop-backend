import express from 'express';
import { tryCatchWrapper } from '../tryCatchWrapper/tryCatchWrapper.js';
import { newUser, verifyEmail } from '../controllers/user.js';

export const userRouter = express.Router();

userRouter.post('/create', tryCatchWrapper(newUser));
userRouter.get('/verify/:verificationToken', tryCatchWrapper(verifyEmail));
