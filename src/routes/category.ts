import express from 'express';
import multer from 'multer';
import { deleteCategory, newCategory, updateCategory, getCategories } from '../controllers/category.js';
import { tryCatchWrapper } from '../tryCatchWrapper/tryCatchWrapper.js';

export const categoryRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

categoryRouter.get('/get', tryCatchWrapper(getCategories));
categoryRouter.post('/create', upload.single('photo'), tryCatchWrapper(newCategory));
categoryRouter.delete('/delete', tryCatchWrapper(deleteCategory));
categoryRouter.patch('/update/:id', tryCatchWrapper(updateCategory));
