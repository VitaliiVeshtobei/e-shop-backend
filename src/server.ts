import { app } from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, PORT } = process.env;

if (!DB_HOST || !PORT) {
  throw new Error('Missing environment variable.');
}

console.log(DB_HOST);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Server running. Use our API on port: 3000');
      console.log('Database connection successful');
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
