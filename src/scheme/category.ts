import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const categoryScheme = new Schema(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
  },
  { versionKey: false, timestamps: true },
);

export const Category = mongoose.model('Category', categoryScheme);
