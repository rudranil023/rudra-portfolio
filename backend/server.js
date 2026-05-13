import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

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

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI is not defined in environment variables!');
} else {
  console.log('Attempting to connect to MongoDB...');
  // Log a masked version of the URI for debugging
  const maskedURI = MONGODB_URI.replace(/\/\/.*:.*@/, '//****:****@');
  console.log('Target URI:', maskedURI);

  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
  })
    .then(() => console.log('MongoDB Connected successfully'))
    .catch(err => {
      console.error('MongoDB Connection Error:', err.message);
    });
}

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio API is running',
    dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 
              mongoose.connection.readyState === 2 ? 'Connecting' : 'Disconnected',
    uriPresent: !!MONGODB_URI,
    environment: process.env.NODE_ENV || 'production'
  });
});

app.get('/.netlify/functions/api', (req, res) => {
  res.send('Portfolio API is running securely on Netlify Serverless');
});

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
