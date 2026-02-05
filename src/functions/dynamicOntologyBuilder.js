import { aiAPI } from '@/api/apiClient';

/**
 * Dynamic Ontology Builder - Constructs knowledge graphs from memories
 * Identifies core concepts and their relationships
 * 
 * @returns {Promise<Object>} Ontology with concepts and relationships
 */
export async function dynamicOntologyBuilder() {
  try {
    const response = await aiAPI.ontologyBuilder();
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error('Dynamic ontology builder error:', error);
    return {
      data: null,
      error: {
        message: error.response?.data?.error || error.message || 'Ontology building failed',
      },
    };
  }
}

export default dynamicOntologyBuilder;
