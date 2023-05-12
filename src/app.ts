import express, { Request, Response } from 'express';
import cors from 'cors';
import { productRouter } from './routes/products.js';
import { categoryRouter } from './routes/category.js';
export const app = express();

app.use(cors());
app.use(express.json());
app.use('/product', productRouter);
app.use('/category', categoryRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err: Error, req: Request, res: Response) => {
  res.status(500).json({ message: err.message });
});
