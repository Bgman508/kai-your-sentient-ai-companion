import { aiAPI } from '@/api/apiClient';

/**
 * Daily Briefing Generator - Creates personalized daily summaries
 * Combines goals, memories, and insights for the user
 * 
 * @returns {Promise<Object>} Daily briefing with priorities and insights
 */
export async function dailyBriefingGenerator() {
  try {
    const response = await aiAPI.dailyBriefing();
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error('Daily briefing generator error:', error);
    return {
      data: null,
      error: {
        message: error.response?.data?.error || error.message || 'Failed to generate briefing',
      },
    };
  }
}

export default dailyBriefingGenerator;
