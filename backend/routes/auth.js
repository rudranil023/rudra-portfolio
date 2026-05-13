import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, email: user.email, name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public profile (for frontend display)
router.get('/public-profile', async (req, res) => {
  try {
    // Assuming the first user is the admin.
    const user = await User.findOne().select('-password -_id -createdAt -updatedAt -__v');
    if (!user) return res.status(404).json({ message: 'Profile not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user profile (protected)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/me/profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio, roleTitles, contactDetails, socialLinks } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, roleTitles, contactDetails, socialLinks },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Upload resume
router.put('/me/resume', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    const user = await User.findById(req.user.id);
    
    // Delete old resume if exists
    if (user.resumeUrl) {
      const filePath = path.join(process.cwd(), user.resumeUrl);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn("Could not delete old resume:", err.message);
        }
      }
    }
    
    const resumeUrl = `/uploads/${req.file.filename}`;
    user.resumeUrl = resumeUrl;
    await user.save();
    
    res.json({ resumeUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error uploading resume' });
  }
});

export const authRoutes = router;
