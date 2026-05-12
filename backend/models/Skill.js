import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  icon: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);
