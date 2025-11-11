/**
 * Environment Configuration
 *
 * Centralized access to environment variables.
 * Falls back to sensible defaults for development.
 */

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  alphaVantageApiKey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || '',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const

// Validate required environment variables in production
if (env.isProduction && !env.apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is required in production')
}

export default env
