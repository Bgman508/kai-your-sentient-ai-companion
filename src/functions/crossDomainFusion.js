import { aiAPI } from '@/api/apiClient';

/**
 * Cross Domain Fusion - Connects ideas across different fields
 * Finds insights by combining knowledge from multiple domains
 * 
 * @param {string[]} domains - Array of domain names to fuse
 * @returns {Promise<Object>} Fusion insights and emergent properties
 */
export async function crossDomainFusion(domains = ['technology', 'psychology', 'art']) {
  try {
    const response = await aiAPI.crossDomainFusion(domains);
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error('Cross domain fusion error:', error);
    return {
      data: null,
      error: {
        message: error.response?.data?.error || error.message || 'Domain fusion failed',
      },
    };
  }
}

export default crossDomainFusion;
