import { Request, Response } from 'express';
import { addProductService, deleteProductService, updateProductService } from '../services/product.js';

export const newProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const product = await addProductService(req.body);

    return res.status(201).json({ product });
  } catch (err: any) {
    return res.status(err.code || 500).json({ message: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const product = await deleteProductService(id);

    return res.status(200).json({ product });
  } catch (error: any) {
    return res.status(error.code).json({ message: error.message });
  }
};
export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!body) {
      return res.status(400).json({ message: 'missing fields' });
    }
    const changedProduct = await updateProductService(id, body);

    if (!changedProduct) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.status(200).json({ changedProduct, message: 'success response' });
  } catch (error: any) {
    return res.status(error.code).json({ message: error.message });
  }
};
