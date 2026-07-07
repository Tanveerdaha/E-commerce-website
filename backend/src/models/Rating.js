import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

ratingSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);
