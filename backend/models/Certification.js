import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String }, // Path to uploaded image
}, { timestamps: true });

export default mongoose.model('Certification', certificationSchema);
