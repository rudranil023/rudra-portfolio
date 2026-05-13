import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Rudranil Koley' },
  bio: { type: String, default: '' },
  roleTitles: [{ type: String }],
  contactDetails: {
    phone: { type: String, default: '' },
    address: { type: String, default: '' }
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' }
  },
  resumeUrl: { type: String, default: '' },
  profileImage: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('User', userSchema, 'Users');
