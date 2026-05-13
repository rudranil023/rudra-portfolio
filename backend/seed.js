import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected for Seeding');
    
    // Clear existing users to ensure clean state
    await User.deleteMany({});
    console.log('Cleared existing users');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be provided in .env');
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      name: 'Rudranil Koley',
      roleTitles: ['Data Analyst', 'Business Intelligence Learner']
    });

    await admin.save();
    console.log(`Admin user created with email: ${adminEmail}`);
    process.exit(0);
  })
  .catch(err => {
    console.log('MongoDB Connection Error:', err);
    process.exit(1);
  });
