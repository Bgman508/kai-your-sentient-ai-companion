import { aiAPI } from '@/api/apiClient';

/**
 * Creativity Engine - Generates creative ideas and insights
 * Uses combinatorial creativity and analogical thinking
 * 
 * @returns {Promise<Object>} Creative ideas and process insights
 */
export async function creativityEngine() {
  try {
    const response = await aiAPI.creativity();
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error('Creativity engine error:', error);
    return {
      data: null,
      error: {
        message: error.response?.data?.error || error.message || 'Creativity generation failed',
      },
    };
  }
}

export default creativityEngine;
