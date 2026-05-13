import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcrypt';
import User from './models/User.js';

// Load env vars
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://rudra-portfolio-theta.vercel.app']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// DB Connection
const MONGODB_URI = process.env.MONGODB_URI;

let lastError = null;

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI is not defined in environment variables!');
} else {
  // Check if URI includes the database name from your screenshot
  if (!MONGODB_URI.includes('/protfolio')) {
    console.warn('WARNING: Your MONGODB_URI might be missing the "/protfolio" database name found in your Atlas screenshot.');
  }

  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000, 
  })
    .then(async () => {
      console.log('MongoDB Connected to:', mongoose.connection.name);
      lastError = null;
      try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;
          if (adminEmail && adminPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);
            const admin = new User({ email: adminEmail, password: hashedPassword, name: 'Rudranil Koley', roleTitles: ['Data Analyst'] });
            await admin.save();
            console.log('Initial Admin user created.');
          }
        }
      } catch (err) {}
    })
    .catch(err => {
      console.error('MongoDB Connection Error:', err.message);
      lastError = err.message;
    });
}

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio API is running',
    dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 
              mongoose.connection.readyState === 2 ? 'Connecting' : 'Disconnected',
    dbName: mongoose.connection.name,
    uriPresent: !!MONGODB_URI,
    lastError: lastError,
    environment: process.env.NODE_ENV || 'production'
  });
});

app.get('/.netlify/functions/api', (req, res) => {
  res.send('Portfolio API is running securely on Netlify Serverless');
});

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

// Import Routes
import { authRoutes } from './routes/auth.js';
import { projectRoutes } from './routes/projects.js';
import { certificationRoutes } from './routes/certifications.js';
import { messageRoutes } from './routes/messages.js';
import { skillRoutes } from './routes/skills.js';
import { settingRoutes } from './routes/settings.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/certifications', certificationRoutes);
router.use('/messages', messageRoutes);
router.use('/skills', skillRoutes);
router.use('/settings', settingRoutes);

app.use('/api', router);
app.use('/.netlify/functions/api', router);

// Export app for serverless
export default app;
