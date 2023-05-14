import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const categoryScheme = new Schema(
  {
    image: { type: String, required: true },
    name: { type: String, required: false },
  },
  { versionKey: false, timestamps: true },
);

export const Category = mongoose.model('Category', categoryScheme);
