import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    name: { type: String, required: false },
    surname: { type: String, required: false },
    phone: { type: Number, required: false },
    price: { type: Number, required: true },
    delivery: { type: String, required: false },
    deliveryCity: [{ type: String, required: false }],
    deliveryOffice: { type: String, required: false },
    deliveryType: { type: String, required: false },
    payment: { type: String, required: false },
    products: { type: Object, required: false },
  },
  { versionKey: false, timestamps: true },
);

export const Order = mongoose.model('Order', orderSchema);
