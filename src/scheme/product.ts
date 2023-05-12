import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
  available: { type: Boolean, required: false },
  price: { type: Number, required: false },
  discount: { type: Number, required: false },
  currency: { type: String, required: true },
  sku: { type: String, required: false },
  images: [{ type: String, required: false }],
  name: { type: String, required: false },
  description: { type: String, required: false },
  in_stock: { type: String, required: false },
  quantity_in_stock: { type: Number, required: false },
  category: { type: mongoose.Types.ObjectId },
});

export const Product = mongoose.model('Product', productSchema);
