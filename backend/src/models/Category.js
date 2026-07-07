import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  categoryId: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
