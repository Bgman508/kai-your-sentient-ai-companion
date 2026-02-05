import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// In-memory storage
const goals = new Map();

// List goals
router.get('/', (req, res) => {
  const userGoals = [];
  const limit = parseInt(req.query.limit) || 5;

  for (const goal of goals.values()) {
    if (goal.userId === req.userId) {
      userGoals.push(goal);
    }
  }

  // Sort by created_date descending
  userGoals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    goals: userGoals.slice(0, limit),
    total: userGoals.length,
  });
});

// Create goal
router.post('/', (req, res) => {
  const { title, description, targetDate, priority, status, category } = req.body;

  if (!title) {
    throw new AppError('Title is required', 400);
  }

  const goalId = uuidv4();
  const newGoal = {
    id: goalId,
    userId: req.userId,
    title,
    description: description || '',
    targetDate: targetDate || null,
    priority: priority || 'medium',
    status: status || 'active',
    category: category || 'personal',
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  goals.set(goalId, newGoal);

  res.status(201).json({
    message: 'Goal created successfully',
    goal: newGoal,
  });
});

// Get single goal
router.get('/:id', (req, res) => {
  const goal = goals.get(req.params.id);

  if (!goal || goal.userId !== req.userId) {
    throw new AppError('Goal not found', 404);
  }

  res.json(goal);
});

// Update goal
router.patch('/:id', (req, res) => {
  const goal = goals.get(req.params.id);

  if (!goal || goal.userId !== req.userId) {
    throw new AppError('Goal not found', 404);
  }

  const { title, description, targetDate, priority, status, category, progress } = req.body;

  if (title) goal.title = title;
  if (description !== undefined) goal.description = description;
  if (targetDate) goal.targetDate = targetDate;
  if (priority) goal.priority = priority;
  if (status) goal.status = status;
  if (category) goal.category = category;
  if (progress !== undefined) goal.progress = Math.min(100, Math.max(0, progress));
  goal.updatedAt = new Date().toISOString();

  goals.set(req.params.id, goal);

  res.json({
    message: 'Goal updated successfully',
    goal,
  });
});

// Delete goal
router.delete('/:id', (req, res) => {
  const goal = goals.get(req.params.id);

  if (!goal || goal.userId !== req.userId) {
    throw new AppError('Goal not found', 404);
  }

  goals.delete(req.params.id);

  res.json({ message: 'Goal deleted successfully' });
});

export default router;
