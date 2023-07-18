import { Request, Response } from 'express';
import {
  addOrderService,
  getOrderByIdService,
  getOrdersService,
  updateStatusOrderService,
} from '../services/orders.js';

export const newOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const order = await addOrderService(req);

    return res.status(201).json({ order });
  } catch (err: any) {
    return res.status(err?.code || 400).json({ message: err.message });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orders = await getOrdersService();

    return res.status(200).json({ orders });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const order = await getOrderByIdService(id);

    return res.status(201).json({ order });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateStatusOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const body = req.body;

    const changedOrder = await updateStatusOrderService(id, body);

    if (!changedOrder) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.status(200).json({ changedOrder, message: 'success response' });
  } catch (error: any) {
    return res.status(error.code).json({ message: error.message });
  }
};
