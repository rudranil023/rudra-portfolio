import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import { authRoutes } from './routes/auth.js';
import { projectRoutes } from './routes/projects.js';
import { certificationRoutes } from './routes/certifications.js';
import { messageRoutes } from './routes/messages.js';
import { skillRoutes } from './routes/skills.js';
import { settingRoutes } from './routes/settings.js';

// Load env vars
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://rudra-portfolio-theta.vercel.app']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
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
      serverSelectionTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      dbName: 'protfolio',
    });
    
    cachedDb = conn;
    lastError = null;
    console.log('MongoDB Connected successfully');

    // Smart-Seed: Create admin if this specific email doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || 'rudranilkoley64@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      console.log('Admin not found. Creating initial admin user...');
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (adminPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        const admin = new User({ 
          email: adminEmail, 
          password: hashedPassword, 
          name: 'Rudranil Koley', 
          roleTitles: ['Data Analyst'] 
        });
        await admin.save();
        console.log('Admin account created successfully.');
      } else {
        console.warn('Could not seed: ADMIN_PASSWORD missing from env.');
      }
    }
    return cachedDb;
  } catch (err) {
    lastError = err.message;
    console.error('Connection error:', err.message);
    throw err;
  }
}

// Debug Middleware
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.path}`);
  next();
});

// Database Middleware
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    if (req.path === '/' || req.path.includes('favicon')) return next();
    res.status(503).json({ error: 'Database connection failed' });
  }
});

// Routes - Support both with and without /api prefix
const routes = [
  { path: '/auth', handler: authRoutes },
  { path: '/projects', handler: projectRoutes },
  { path: '/certifications', handler: certificationRoutes },
  { path: '/messages', handler: messageRoutes },
  { path: '/skills', handler: skillRoutes },
  { path: '/settings', handler: settingRoutes }
];

routes.forEach(route => {
  app.use(route.path, route.handler);       // e.g. /auth/login
  app.use(`/api${route.path}`, route.handler); // e.g. /api/auth/login
});

// Basic route
app.get('/', async (req, res) => {
  try {
    await connectToDatabase();
  } catch (err) {}

  res.json({
    message: 'Portfolio API is running',
    dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 
              mongoose.connection.readyState === 2 ? 'Connecting' : 'Disconnected',
    dbName: mongoose.connection.name,
    uriPresent: !!MONGODB_URI,
    uriLength: MONGODB_URI ? MONGODB_URI.length : 0,
    lastError: lastError,
    nodeVersion: process.version,
    pathHit: req.path
  });
});

// Export app for Vercel
export default app;
