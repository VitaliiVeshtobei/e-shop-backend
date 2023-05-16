import express from 'express';
import { tryCatchWrapper } from '../tryCatchWrapper/tryCatchWrapper.js';
import { login, logout, newUser, verifyEmail } from '../controllers/user.js';
import { auth } from '../middlewares/auth.js';

export const userRouter = express.Router();

userRouter.post('/create', tryCatchWrapper(newUser));
userRouter.post('/login', tryCatchWrapper(login));
userRouter.patch('/logout', auth, tryCatchWrapper(logout));
userRouter.get('/verify/:verificationToken', tryCatchWrapper(verifyEmail));
