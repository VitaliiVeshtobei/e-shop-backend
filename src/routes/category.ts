import express from 'express';
import { deleteCategory, newCategory, updateCategory, getCategories } from '../controllers/category.js';
import { tryCatchWrapper } from '../tryCatchWrapper/tryCatchWrapper.js';

export const categoryRouter = express.Router();

categoryRouter.get('/get', tryCatchWrapper(getCategories));
categoryRouter.post('/create', tryCatchWrapper(newCategory));
categoryRouter.delete('/delete/:id', tryCatchWrapper(deleteCategory));
categoryRouter.patch('/update/:id', tryCatchWrapper(updateCategory));
