import express from 'express';
import { tryCatchWrapper } from '../tryCatchWrapper/tryCatchWrapper.js';
import { newOrder } from '../controllers/orders.js';

export const ordersRouter = express.Router();

ordersRouter.post('/create', tryCatchWrapper(newOrder));
