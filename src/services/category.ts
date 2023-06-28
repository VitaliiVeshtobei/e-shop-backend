import { Category } from '../scheme/category.js';
import { HttpError } from '../httpError/Error.js';
import { deletePhoto, getPhotoUrl, uploadPhoto } from '../utils/s3/s3Service.js';
import { Request } from 'express';

interface iCategory {
  image: string;
  name: string;
}

export const getCategoriesService = async () => {
  try {
    const categories = await Category.find();
    for (const category of categories) {
      const urlPhoto = await getPhotoUrl(category.image);
      category.image = urlPhoto;
    }
    return categories;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};

export const getCategoryByIdService = async (id: string) => {
  try {
    const category = await Category.findById(id);
    if (category) {
      const urlPhoto = await getPhotoUrl(category.image);
      category.image = urlPhoto;
    }

    return category;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};

export const addCategoryService = async (req: Request) => {
  try {
    const namePhoto = await uploadPhoto(req.file);
    const data = { ...req.body, image: namePhoto };
    const category = await Category.create(data);
    return category;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};

export const deleteCategoryService = async (ids: []) => {
  try {
    const categories = await Category.find({ _id: { $in: ids } });
    await deletePhoto(categories);

    const category = await Category.deleteMany({ _id: { $in: ids } });

    if (!category) {
      throw new HttpError(`Transaction with id does not exist`, 404);
    }
    return category;
  } catch (error: any) {
    throw new HttpError(error.message, 404);
  }
};

export const updateCategoryService = async (id: string, body: iCategory, file: Express.Multer.File | undefined) => {
  try {
    if (!file) {
      const changedCategory = await Category.findByIdAndUpdate(id, body, {
        new: true,
      });
      return changedCategory;
    }

    const category = await Category.find({ _id: id });

    await deletePhoto(category);
    const namePhoto = await uploadPhoto(file);
    const bodyData = { ...body, image: namePhoto };
    const changedCategory = await Category.findByIdAndUpdate(id, bodyData, {
      new: true,
    });

    return changedCategory;
  } catch (error: any) {
    throw new HttpError(error.message, 404);
  }
};
