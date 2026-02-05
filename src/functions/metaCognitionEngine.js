import { aiAPI } from '@/api/apiClient';

/**
 * Meta Cognition Engine - Kai's self-awareness system
 * Monitors thought patterns and cognitive biases
 * 
 * @returns {Promise<Object>} Meta-cognitive analysis
 */
export async function metaCognitionEngine() {
  try {
    const response = await aiAPI.metaCognition();
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error('Meta cognition engine error:', error);
    return {
      data: null,
      error: {
        message: error.response?.data?.error || error.message || 'Meta-cognition analysis failed',
      },
    };
  }
}

export default metaCognitionEngine;
