import express from 'express';
import { deleteProduct, newProduct, updateProduct, getProducts } from '../controllers/product.js';
import { tryCatchWrapper } from '../tryCatchWrapper/tryCatchWrapper.js';

export const productRouter = express.Router();

productRouter.get('/get', tryCatchWrapper(getProducts));
productRouter.post('/create', tryCatchWrapper(newProduct));
productRouter.delete('/delete/:id', tryCatchWrapper(deleteProduct));
productRouter.patch('/update/:id', tryCatchWrapper(updateProduct));
