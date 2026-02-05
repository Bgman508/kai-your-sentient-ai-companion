import { aiAPI } from '@/api/apiClient';

/**
 * Evolution Orchestrator - Manages Kai's growth trajectory
 * Tracks consciousness metrics and growth areas
 * 
 * @returns {Promise<Object>} Evolution metrics and actions
 */
export async function evolutionOrchestrator() {
  try {
    const response = await aiAPI.evolution();
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error('Evolution orchestrator error:', error);
    return {
      data: null,
      error: {
        message: error.response?.data?.error || error.message || 'Evolution check failed',
      },
    };
  }
}

export default evolutionOrchestrator;
