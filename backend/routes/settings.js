import express from 'express';
import Setting from '../models/Setting.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get settings
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update settings
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { theme, seoTitle, seoDescription, faviconUrl } = req.body;
    let settings = await Setting.findOne();
    
    if (settings) {
      settings.theme = theme || settings.theme;
      settings.seoTitle = seoTitle || settings.seoTitle;
      settings.seoDescription = seoDescription || settings.seoDescription;
      settings.faviconUrl = faviconUrl || settings.faviconUrl;
      await settings.save();
    } else {
      settings = await Setting.create({ theme, seoTitle, seoDescription, faviconUrl });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
});

export default router;
