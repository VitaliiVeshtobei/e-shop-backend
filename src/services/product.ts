import mongoose from 'mongoose';
import { Product } from '../scheme/product.js';
import { HttpError } from '../httpError/Error.js';
import { uploadPhoto } from '../utils/s3/s3Service.js';
import { Request } from 'express';

interface iProduct {
  available: boolean;
  price: number;
  discount: number;
  currencyId: string;
  sku: string;
  images: [string];
  name: string;
  description: string;
  in_stock: string;
  quantity_in_stock: number;
  category: mongoose.ObjectId;
}
export const getProductsService = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};
export const addProductService = async (req: Request) => {
  try {
    const images = [];
    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        const namePhoto = await uploadPhoto(file);
        images.push(namePhoto);
      }
    }
    const data = { ...req.body, images };
    const product = await Product.create(data);
    return product;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};

export const deleteProductService = async (id: string) => {
  try {
    const product = await Product.findByIdAndRemove({ _id: id });

    if (!product) {
      throw new HttpError(`Transaction with id does not exist`, 404);
    }
    return product;
  } catch (error: any) {
    throw new HttpError(error.message, 404);
  }
};

export const updateProductService = async (id: string, body: iProduct) => {
  try {
    const changedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
    });
    return changedProduct;
  } catch (error: any) {
    throw new HttpError(error.message, 404);
  }
};
