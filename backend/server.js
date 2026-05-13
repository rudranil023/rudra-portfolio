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

let cachedDb = null;
let lastError = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
      dbName: 'protfolio',
    });
    
    cachedDb = conn;
    lastError = null;
    console.log('MongoDB Connected successfully');

    // Auto-seed check
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (adminEmail && adminPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        const admin = new User({ email: adminEmail, password: hashedPassword, name: 'Rudranil Koley', roleTitles: ['Data Analyst'] });
        await admin.save();
        console.log('Admin seeded.');
      }
    }
    return cachedDb;
  } catch (err) {
    lastError = err.message;
    console.error('Connection error:', err.message);
    throw err;
  }
}

// Basic route
app.get('/', async (req, res) => {
  try {
    await connectToDatabase();
  } catch (err) {
    // We still return JSON even if DB fails
  }

  res.json({
    message: 'Portfolio API is running',
    dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 
              mongoose.connection.readyState === 2 ? 'Connecting' : 'Disconnected',
    dbName: mongoose.connection.name,
    uriPresent: !!MONGODB_URI,
    uriLength: MONGODB_URI ? MONGODB_URI.length : 0,
    lastError: lastError,
    nodeVersion: process.version
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

const dbMiddleware = async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    // If it's a favicon or root, we don't want to error out the whole request
    if (req.path === '/' || req.path.includes('favicon')) {
      return next();
    }
    res.status(503).json({ error: 'Database connection failed', details: err.message });
  }
};

app.use('/api', dbMiddleware, router);
app.use('/.netlify/functions/api', dbMiddleware, router);

// Export app for serverless
export default app;
