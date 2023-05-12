import { Category } from '../scheme/category.js';
import { HttpError } from '../httpError/Error.js';

interface iCategory {
  image: string;
  name: string;
}

export const addCategoryService = async (data: iCategory) => {
  try {
    const category = await Category.create(data);
    return category;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};

export const deleteCategoryService = async (id: string) => {
  try {
    const category = await Category.findByIdAndRemove({ _id: id });

    if (!category) {
      throw new HttpError(`Transaction with id does not exist`, 404);
    }
    return category;
  } catch (error: any) {
    throw new HttpError(error.message, 404);
  }
};

export const updateCategoryService = async (id: string, body: iCategory) => {
  try {
    const changedCategory = await Category.findByIdAndUpdate(id, body, {
      new: true,
    });
    return changedCategory;
  } catch (error: any) {
    throw new HttpError(error.message, 404);
  }
};
