// client/src/utils/api.js

/**
 * Standardizes the Backend API URL for the entire application.
 * In local development, it defaults to http://localhost:5000.
 * In production, it uses the VITE_API_URL environment variable provided by the host.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getApiUrl = (endpoint) => {
  // Ensure endpoint starts with a slash if not provided
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${formattedEndpoint}`;
};
