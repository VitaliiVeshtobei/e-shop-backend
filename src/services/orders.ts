import { HttpError } from '../httpError/Error.js';
import bcryptjs from 'bcryptjs';
import { nanoid } from 'nanoid';

import { Request } from 'express';
import { Order } from '../scheme/order.js';
import { User } from '../scheme/user.js';

export const addOrderService = async (req: Request) => {
  const latestOrder = await Order.findOne({}, {}, { sort: { number: -1 } });

  try {
    const userWithPhone = await User.findOne({ phone: req.body.phone });

    if (userWithPhone) {
      if (latestOrder) {
        const order = await Order.create({ ...req.body, user: userWithPhone._id, number: latestOrder.number + 1 });
        return order;
      }
      const order = await Order.create({ ...req.body, user: userWithPhone._id, number: 1000 });
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

    if (latestOrder) {
      const newUser = await User.create(newUserData);
      const order = await Order.create({ ...req.body, user: newUser._id, number: latestOrder.number + 1 });
      return order;
    }
    const newUser = await User.create(newUserData);
    const order = await Order.create({ ...req.body, user: newUser._id, number: 1000 });
    return order;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};

export const getOrdersService = async () => {
  try {
    const orders = await Order.find({}, {}, { sort: { number: -1 } });

    return orders;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};

export const getOrderByIdService = async (id: string) => {
  try {
    const order = await Order.findById(id);

    return order;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};

export const updateStatusOrderService = async (id: string, body: { status: string }) => {
  const validStatuses = ['NEW', 'PROCESS', 'CANCELED', 'SENT'];
  try {
    if (!validStatuses.includes(body.status)) {
      throw new HttpError('No correct status', 404);
    }
    const changedOrder = await Order.findByIdAndUpdate(id, body, {
      new: true,
    });

    return changedOrder;
  } catch (error: any) {
    throw new HttpError(error.message, 404);
  }
};
