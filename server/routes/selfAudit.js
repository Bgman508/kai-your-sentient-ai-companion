import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage
const selfAudits = new Map();

// List self audits
router.get('/', (req, res) => {
  const userAudits = [];
  const limit = parseInt(req.query.limit) || 10;

  for (const audit of selfAudits.values()) {
    if (audit.userId === req.userId) {
      userAudits.push(audit);
    }
  }

  // Sort by created_date descending
  userAudits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    audits: userAudits.slice(0, limit),
    total: userAudits.length,
  });
});

// Create self audit
router.post('/', (req, res) => {
  const { auditType, testParameters, results, improvementActions } = req.body;

  const auditId = uuidv4();
  const newAudit = {
    id: auditId,
    userId: req.userId,
    auditType: auditType || 'performance',
    testParameters: testParameters || {},
    results: results || {},
    improvementActions: improvementActions || [],
    createdAt: new Date().toISOString(),
  };

  selfAudits.set(auditId, newAudit);

  res.status(201).json({
    message: 'Self audit created successfully',
    audit: newAudit,
  });
});

export default router;
