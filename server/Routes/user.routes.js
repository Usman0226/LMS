import express from 'express';
import User from '../models/user.model.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all users (Admin or Teacher only)
router.get('/get/allusers', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ success: false, message: "Access denied" });
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user by ID
router.get('/user/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update user (Self or Admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.user._id !== req.params.id && req.user.role !== 'teacher') {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
