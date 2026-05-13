import express from 'express';
import Project from '../models/Project.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a project
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, technologies, githubLink, liveLink } = req.body;
    const imageDataArray = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Read file and convert to base64
        const fileBuffer = fs.readFileSync(file.path);
        const base64Image = fileBuffer.toString('base64');
        imageDataArray.push(`data:${file.mimetype};base64,${base64Image}`);
        
        // Cleanup temp file
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error('Error deleting temp file:', err);
        }
      }
    }

    const newProject = new Project({
      title,
      description,
      technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
      githubLink,
      liveLink,
      images: imageDataArray, // Now stores array of base64 strings
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Delete a project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.image) {
      const filePath = path.join(process.cwd(), project.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export const projectRoutes = router;
