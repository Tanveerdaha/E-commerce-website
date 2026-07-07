import mongoose from 'mongoose';

const supportMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  userId: { type: String, default: null },
}, { timestamps: true });

export default mongoose.model('SupportMessage', supportMessageSchema);
