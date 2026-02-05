import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// In-memory storage
const contexts = new Map();

// Get or create user context
router.get('/', (req, res) => {
  let context = null;
  
  for (const ctx of contexts.values()) {
    if (ctx.userId === req.userId) {
      context = ctx;
      break;
    }
  }

  if (!context) {
    // Create default context
    context = {
      id: uuidv4(),
      userId: req.userId,
      mood: 'neutral',
      energy: 0.5,
      focus: 0.5,
      stress: 0.3,
      currentActivity: null,
      location: null,
      weather: null,
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      recentEvents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    contexts.set(context.id, context);
  }

  res.json(context);
});

// Update context
router.patch('/', (req, res) => {
  let context = null;
  let contextId = null;
  
  for (const [id, ctx] of contexts.entries()) {
    if (ctx.userId === req.userId) {
      context = ctx;
      contextId = id;
      break;
    }
  }

  if (!context) {
    throw new AppError('Context not found', 404);
  }

  const updates = req.body;
  
  // Update allowed fields
  const allowedFields = ['mood', 'energy', 'focus', 'stress', 'currentActivity', 'location', 'weather', 'recentEvents'];
  
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      context[field] = updates[field];
    }
  }

  context.timeOfDay = new Date().getHours();
  context.dayOfWeek = new Date().getDay();
  context.updatedAt = new Date().toISOString();

  contexts.set(contextId, context);

  res.json({
    message: 'Context updated successfully',
    context,
  });
});

export default router;
