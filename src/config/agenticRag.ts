export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',

  endpoints: {
    aiSearch: '/api/v1/ai-recruiter/search',
    health: '/health', 
  },

  timeout: 60000,
};

/**
 * Helper function to construct the full URL for an API endpoint.
 * @param endpoint The key of the endpoint in the API_CONFIG.endpoints object.
 * @returns The full URL for the API endpoint.
 */
export const getApiEndpoint = (endpoint: keyof typeof API_CONFIG.endpoints): string => {
  return `${API_CONFIG.baseUrl}${API_CONFIG.endpoints[endpoint]}`;
};
