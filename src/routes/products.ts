import express from 'express';
import multer from 'multer';
import { deleteProduct, newProduct, updateProduct, getProducts } from '../controllers/product.js';
import { tryCatchWrapper } from '../tryCatchWrapper/tryCatchWrapper.js';

export const productRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

productRouter.get('/get', tryCatchWrapper(getProducts));
productRouter.post('/create', upload.array('photos'), tryCatchWrapper(newProduct));
productRouter.delete('/delete/:id', tryCatchWrapper(deleteProduct));
productRouter.patch('/update/:id', tryCatchWrapper(updateProduct));
