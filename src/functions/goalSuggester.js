import { aiAPI } from '@/api/apiClient';

/**
 * Goal Suggester - Analyzes patterns to suggest new goals
 * Uses memory themes and user behavior for recommendations
 * 
 * @returns {Promise<Object>} Suggested goals with rationale
 */
export async function goalSuggester() {
  try {
    const response = await aiAPI.suggestGoals();
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error('Goal suggester error:', error);
    return {
      data: null,
      error: {
        message: error.response?.data?.error || error.message || 'Failed to suggest goals',
      },
    };
  }
}

export default goalSuggester;
