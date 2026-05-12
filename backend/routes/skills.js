import express from 'express';
import Skill from '../models/Skill.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ percentage: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new skill
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, percentage, icon } = req.body;
    const newSkill = new Skill({ name, percentage, icon });
    const savedSkill = await newSkill.save();
    res.status(201).json(savedSkill);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Update a skill
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, percentage, icon } = req.body;
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, percentage, icon },
      { new: true }
    );
    if (!updatedSkill) return res.status(404).json({ message: 'Skill not found' });
    res.json(updatedSkill);
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
});

// Delete a skill
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedSkill) return res.status(404).json({ message: 'Skill not found' });
    res.json({ message: 'Skill removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
