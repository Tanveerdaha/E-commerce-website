import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  category: String,
  brand: String,
  price: Number,
  discount: Number,
  rating: Number,
  images: [String],
  stock: Number,
  quantity: { type: Number, default: 1 },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cart: { type: [cartItemSchema], default: [] },
  wishlist: { type: [mongoose.Schema.Types.Mixed], default: [] },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
