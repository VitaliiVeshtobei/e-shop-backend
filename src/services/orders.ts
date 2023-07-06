import { HttpError } from '../httpError/Error.js';
import bcryptjs from 'bcryptjs';
import { nanoid } from 'nanoid';

import { Request } from 'express';
import { Order } from '../scheme/order.js';
import { User } from '../scheme/user.js';

export const addOrderService = async (req: Request) => {
  const uniqueNumber = Math.random() * 100 + Date.now();
  try {
    const userWithPhone = await User.findOne({ phone: req.body.phone });

    if (userWithPhone) {
      const order = await Order.create({ ...req.body, user: userWithPhone._id, number: uniqueNumber });
      return order;
    }
    const createdPassword = nanoid(8);
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(createdPassword, salt);
    const newUserData = {
      email: null,
      password: hashedPassword,
      verify: false,
      verificationToken: 'null',
      name: req.body.name,
      lastName: req.body.surname,
      phone: req.body.phone,
    };

    const newUser = await User.create(newUserData);
    const order = await Order.create({ ...req.body, user: newUser._id, number: uniqueNumber });
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
