import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  images: { type: [String], default: [] },
  stock: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
