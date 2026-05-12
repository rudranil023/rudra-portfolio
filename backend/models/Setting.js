import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  theme: { type: String, default: 'dark' },
  seoTitle: { type: String, default: 'Rudranil Koley - Portfolio' },
  seoDescription: { type: String, default: 'Data Analyst & Full Stack Developer' },
  faviconUrl: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Setting', settingSchema);
