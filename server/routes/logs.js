import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage
const pageViews = new Map();
const events = new Map();

// Log page view
router.post('/page-view', (req, res) => {
  const { pageName } = req.body;

  const logId = uuidv4();
  const pageView = {
    id: logId,
    userId: req.userId,
    pageName: pageName || 'unknown',
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  };

  pageViews.set(logId, pageView);

  res.status(201).json({ message: 'Page view logged' });
});

// Log custom event
router.post('/event', (req, res) => {
  const { eventType, data } = req.body;

  const logId = uuidv4();
  const event = {
    id: logId,
    userId: req.userId,
    eventType: eventType || 'custom',
    data: data || {},
    timestamp: new Date().toISOString(),
  };

  events.set(logId, event);

  res.status(201).json({ message: 'Event logged' });
});

// Get user activity summary (for analytics)
router.get('/summary', (req, res) => {
  const userPageViews = [];
  const userEvents = [];

  for (const view of pageViews.values()) {
    if (view.userId === req.userId) {
      userPageViews.push(view);
    }
  }

  for (const event of events.values()) {
    if (event.userId === req.userId) {
      userEvents.push(event);
    }
  }

  // Calculate page visit frequency
  const pageFrequency = {};
  userPageViews.forEach(view => {
    pageFrequency[view.pageName] = (pageFrequency[view.pageName] || 0) + 1;
  });

  res.json({
    totalPageViews: userPageViews.length,
    totalEvents: userEvents.length,
    pageFrequency,
    recentActivity: {
      pageViews: userPageViews.slice(-10),
      events: userEvents.slice(-10),
    },
  });
});

export default router;
