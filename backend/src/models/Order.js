import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: Number,
  title: String,
  category: String,
  brand: String,
  price: Number,
  discount: Number,
  quantity: Number,
  images: [String],
}, { _id: false });

const shippingSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  postalCode: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: [orderItemSchema], default: [] },
  shipping: { type: shippingSchema, default: null },
  paymentMethod: { type: String, default: 'cod' },
  paymentStatus: { type: String, default: 'cod' },
  stripePaymentIntentId: { type: String, default: null },
  total: { type: Number, required: true },
  status: { type: String, default: 'confirmed' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
