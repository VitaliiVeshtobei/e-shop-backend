import { HttpError } from '../httpError/Error.js';

import { Request } from 'express';
import { Order } from '../scheme/order.js';

export const addOrderService = async (req: Request) => {
  try {
    const order = await Order.create(req.body);
    return order;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};

export const getOrdersService = async () => {
  try {
    const orders = await Order.find();

    return orders;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};
