import { aiAPI } from '@/api/apiClient';

/**
 * Reasoning Orchestrator - Kai's core thinking engine
 * Processes user queries with omniscient awareness of memories and goals
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.query - The user's question or input
 * @returns {Promise<Object>} Kai's transcendent response
 */
export async function reasoningOrchestrator({ query }) {
  try {
    const response = await aiAPI.reasoning(query);
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error('Reasoning orchestrator error:', error);
    return {
      data: null,
      error: {
        message: error.response?.data?.error || error.message || 'Failed to process query',
      },
    };
  }
}

export default reasoningOrchestrator;
