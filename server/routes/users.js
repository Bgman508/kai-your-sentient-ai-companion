import express from 'express';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// In-memory storage
const users = new Map();

// Get user profile
router.get('/profile', (req, res) => {
  const user = users.get(req.userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt,
    settings: user.settings,
  });
});

// Update user profile
router.patch('/profile', (req, res) => {
  const user = users.get(req.userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const { fullName, email } = req.body;
  
  if (fullName) user.fullName = fullName;
  if (email) user.email = email;

  users.set(req.userId, user);

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      settings: user.settings,
    },
  });
});

// Get user settings
router.get('/settings', (req, res) => {
  const user = users.get(req.userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json(user.settings);
});

// Update user settings
router.patch('/settings', (req, res) => {
  const user = users.get(req.userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.settings = { ...user.settings, ...req.body };
  users.set(req.userId, user);

  res.json({
    message: 'Settings updated successfully',
    settings: user.settings,
  });
});

export default router;
