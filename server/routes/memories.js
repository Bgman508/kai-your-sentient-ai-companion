import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// In-memory storage
const memories = new Map();

// List memories
router.get('/', (req, res) => {
  const userMemories = [];
  const limit = parseInt(req.query.limit) || 10;

  for (const memory of memories.values()) {
    if (memory.userId === req.userId) {
      userMemories.push(memory);
    }
  }

  // Sort by created_date descending
  userMemories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    memories: userMemories.slice(0, limit),
    total: userMemories.length,
  });
});

// Create memory
router.post('/', (req, res) => {
  const { title, content, summary, tags, importance } = req.body;

  if (!title || !content) {
    throw new AppError('Title and content are required', 400);
  }

  const memoryId = uuidv4();
  const newMemory = {
    id: memoryId,
    userId: req.userId,
    title,
    content,
    summary: summary || content.substring(0, 100) + '...',
    tags: tags || [],
    importance: importance || 0.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memories.set(memoryId, newMemory);

  res.status(201).json({
    message: 'Memory created successfully',
    memory: newMemory,
  });
});

// Get single memory
router.get('/:id', (req, res) => {
  const memory = memories.get(req.params.id);

  if (!memory || memory.userId !== req.userId) {
    throw new AppError('Memory not found', 404);
  }

  res.json(memory);
});

// Update memory
router.patch('/:id', (req, res) => {
  const memory = memories.get(req.params.id);

  if (!memory || memory.userId !== req.userId) {
    throw new AppError('Memory not found', 404);
  }

  const { title, content, summary, tags, importance } = req.body;

  if (title) memory.title = title;
  if (content) memory.content = content;
  if (summary) memory.summary = summary;
  if (tags) memory.tags = tags;
  if (importance !== undefined) memory.importance = importance;
  memory.updatedAt = new Date().toISOString();

  memories.set(req.params.id, memory);

  res.json({
    message: 'Memory updated successfully',
    memory,
  });
});

// Delete memory
router.delete('/:id', (req, res) => {
  const memory = memories.get(req.params.id);

  if (!memory || memory.userId !== req.userId) {
    throw new AppError('Memory not found', 404);
  }

  memories.delete(req.params.id);

  res.json({ message: 'Memory deleted successfully' });
});

export default router;
