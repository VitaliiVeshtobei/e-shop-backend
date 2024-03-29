import { app } from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, PORT } = process.env;

if (!DB_HOST || !PORT) {
  throw new Error('Missing environment variable.');
}

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT || 4444, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
      console.log('Database connection successful');
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
