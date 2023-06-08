import { Request, Response } from 'express';
import {
  getCategoriesService,
  addCategoryService,
  deleteCategoryService,
  updateCategoryService,
} from '../services/category.js';

export const getCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const categories = await getCategoriesService();

    return res.status(201).json({ categories });
  } catch (err: any) {
    return res.status(err.code).json({ message: err.message });
  }
};
export const newCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const category = await addCategoryService(req.body);

    return res.status(201).json({ category });
  } catch (err: any) {
    return res.status(err.code).json({ message: err.message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const product = await deleteCategoryService(id);

    return res.status(200).json({ product });
  } catch (error: any) {
    return res.status(error.code).json({ message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!body) {
      return res.status(400).json({ message: 'missing fields' });
    }
    const changedCategory = await updateCategoryService(id, body);

    if (!changedCategory) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.status(200).json({ changedCategory, message: 'success response' });
  } catch (error: any) {
    return res.status(error.code).json({ message: error.message });
  }
};
