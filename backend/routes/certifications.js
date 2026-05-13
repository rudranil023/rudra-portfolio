import express from 'express';
import Certification from '../models/Certification.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Get all certifications
router.get('/', async (req, res) => {
  try {
    const certs = await Certification.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a certification
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { title, issuer, date } = req.body;
    const imageDataArray = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileBuffer = fs.readFileSync(file.path);
        const base64Image = fileBuffer.toString('base64');
        imageDataArray.push(`data:${file.mimetype};base64,${base64Image}`);
        
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error('Error deleting temp file:', err);
        }
      }
    }

    const newCert = new Certification({
      title,
      issuer,
      date,
      images: imageDataArray,
    });

    const savedCert = await newCert.save();
    res.status(201).json(savedCert);
  } catch (error) {
    console.error('Cert creation error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Delete a certification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certification not found' });

    if (cert.image) {
      const filePath = path.join(process.cwd(), cert.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Certification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export const certificationRoutes = router;
