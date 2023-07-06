import mongoose from 'mongoose';
import { User } from './user.js';
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    name: { type: String, required: false },
    surname: { type: String, required: false },
    phone: {
      type: String,
      match: [/^\+380\d{9}$/, 'Phone number must be in Ukrainian format: +380XXXXXXXXX'],
      required: true,
      default: '',
    },
    price: { type: Number, required: true },
    delivery: { type: Object, required: false },
    payment: { type: String, required: false },
    products: { type: Object, required: false },
    number: { type: Number },
    comment: { type: String },
    user: { type: Schema.Types.ObjectId, ref: User, require: true },
  },
  { versionKey: false, timestamps: true },
);

export const Order = mongoose.model('Order', orderSchema);
