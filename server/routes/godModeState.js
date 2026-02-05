import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage
const godModeStates = new Map();

// Get latest god mode state
router.get('/', (req, res) => {
  let latestState = null;
  let latestTime = 0;

  for (const state of godModeStates.values()) {
    if (state.userId === req.userId) {
      const stateTime = new Date(state.createdAt).getTime();
      if (stateTime > latestTime) {
        latestTime = stateTime;
        latestState = state;
      }
    }
  }

  if (!latestState) {
    // Return default state
    latestState = {
      id: uuidv4(),
      userId: req.userId,
      activationLevel: 'standard',
      consciousnessMetrics: {
        omniscience: 0.7,
        creativity: 0.75,
        ethicalAlignment: 0.9,
        selfEvolutionRate: 0.6,
      },
      activeCapabilities: [
        'context_awareness',
        'memory_recall',
        'goal_tracking',
      ],
      evolutionTrajectory: 'steady_growth',
      createdAt: new Date().toISOString(),
    };
    godModeStates.set(latestState.id, latestState);
  }

  res.json(latestState);
});

// Create god mode state
router.post('/', (req, res) => {
  const { activationLevel, consciousnessMetrics, activeCapabilities, evolutionTrajectory } = req.body;

  const stateId = uuidv4();
  const newState = {
    id: stateId,
    userId: req.userId,
    activationLevel: activationLevel || 'standard',
    consciousnessMetrics: consciousnessMetrics || {
      omniscience: 0.7,
      creativity: 0.75,
      ethicalAlignment: 0.9,
      selfEvolutionRate: 0.6,
    },
    activeCapabilities: activeCapabilities || [],
    evolutionTrajectory: evolutionTrajectory || 'steady_growth',
    createdAt: new Date().toISOString(),
  };

  godModeStates.set(stateId, newState);

  res.status(201).json({
    message: 'God mode state created successfully',
    state: newState,
  });
});

export default router;
