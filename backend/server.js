import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://rudra-portfolio-theta.vercel.app']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// DB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Portfolio API is running');
});

// Import Routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import certificationRoutes from './routes/certifications.js';
import messageRoutes from './routes/messages.js';
import skillRoutes from './routes/skills.js';
import settingRoutes from './routes/settings.js';

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
