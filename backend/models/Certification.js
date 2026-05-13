import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  images: { type: [String], default: [] }, // Array of Base64 image strings
}, { timestamps: true });

export default mongoose.model('Certification', certificationSchema);
