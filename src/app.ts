import express, { Request, Response } from 'express';
import cors from 'cors';
import { productRouter } from './routes/products.js';
import { categoryRouter } from './routes/category.js';
import { userRouter } from './routes/user.js';
export const app = express();

app.use(cors());

app.use(express.json());
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/user', userRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err: Error, req: Request, res: Response) => {
  res.status(500).json({ message: err.message });
});
