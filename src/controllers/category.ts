import { Request, Response } from 'express';

import {
  getCategoriesService,
  addCategoryService,
  deleteCategoryService,
  updateCategoryService,
} from '../services/category.js';
import { uploadPhoto } from '../utils/uploadPhoto.js';
import { getPhotoUrl } from '../utils/getPhotoUrl.js';

export const getCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const categories = await getCategoriesService();
    for (const category of categories) {
      const urlPhoto = await getPhotoUrl(category.image);
      category.image = urlPhoto;
    }
    return res.status(201).json({ categories });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
export const newCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log(req.body);
    console.log(req.file);
    const namePhoto = await uploadPhoto(req.file);
    const data = { ...req.body, image: namePhoto };
    const category = await addCategoryService(data);

    return res.status(201).json({ category });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
    // return res.status(err?.code || 400).json({ message: err.message });
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
