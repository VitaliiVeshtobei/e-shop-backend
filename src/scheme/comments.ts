import mongoose from 'mongoose';
import { User } from './user.js';
import { Product } from './product.js';
const Schema = mongoose.Schema;

const commentsSchema = new Schema(
  {
    userName: { type: String, required: true },
    stars: { type: Number, required: true },
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: User, required: true },
    product: { type: Schema.Types.ObjectId, ref: Product, required: true },
  },
  { versionKey: false, timestamps: true },
);

export const Comments = mongoose.model('Comments', commentsSchema);
