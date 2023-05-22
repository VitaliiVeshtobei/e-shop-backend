import express from 'express';
import { tryCatchWrapper } from '../tryCatchWrapper/tryCatchWrapper.js';
import { getUser, login, logout, newUser, refreshTokenController, verifyEmail } from '../controllers/user.js';
import { auth } from '../middlewares/auth.js';

export const userRouter = express.Router();

userRouter.post('/create', tryCatchWrapper(newUser));
userRouter.post('/login', tryCatchWrapper(login));
userRouter.patch('/logout', auth, tryCatchWrapper(logout));
userRouter.get('/get-user', auth, tryCatchWrapper(getUser));
userRouter.get('/verify/:verificationToken', tryCatchWrapper(verifyEmail));
userRouter.post('/refresh', tryCatchWrapper(refreshTokenController));
