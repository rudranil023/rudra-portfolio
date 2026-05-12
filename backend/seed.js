import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected for Seeding');
    
    // Clear existing users to ensure clean state
    await User.deleteMany({});
    console.log('Cleared existing users');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password', salt);

    const admin = new User({
      email: 'rudranilkoley64@gmail.com',
      password: hashedPassword,
      name: 'Rudranil Koley',
      roleTitles: ['Data Analyst', 'Full Stack Developer']
    });

    await admin.save();
    console.log('Admin user created with email: rudranilkoley64@gmail.com, password: Password');
    process.exit(0);
  })
  .catch(err => {
    console.log('MongoDB Connection Error:', err);
    process.exit(1);
  });
