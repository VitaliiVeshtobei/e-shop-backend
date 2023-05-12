import express from 'express';
import { deleteCategory, newCategory, updateCategory } from '../controllers/category.js';
import { tryCatchWrapper } from '../tryCatchWrapper/tryCatchWrapper.js';

export const categoryRouter = express.Router();

categoryRouter.post('/create', tryCatchWrapper(newCategory));
categoryRouter.delete('/delete/:id', tryCatchWrapper(deleteCategory));
categoryRouter.patch('/update/:id', tryCatchWrapper(updateCategory));
