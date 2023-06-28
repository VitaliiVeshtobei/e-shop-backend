import { Request, Response } from 'express';
import { addOrderService } from '../services/orders.js';

export const newOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const order = await addOrderService(req);

    return res.status(201).json({ order });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
    // return res.status(err?.code || 400).json({ message: err.message });
  }
};
