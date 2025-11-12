/**
 * Axios HTTP Client with interceptors for authentication and error handling
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import env from '../env'
import { logger } from '@/utils/logger'
import { API_CONFIG, STORAGE_KEYS } from '@/constants'

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - automatically add JWT token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add JWT token
    const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request
    logger.apiRequest(
      config.method?.toUpperCase() || 'GET',
      config.url || '',
      config.data
    )

    return config
  },
  (error: AxiosError) => {
    logger.error('API request failed', error)
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors consistently
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    logger.apiResponse(
      response.config.method?.toUpperCase() || 'GET',
      response.config.url || '',
      response.status,
      response.data
    )

    // Extract data from the standard { status: "success", data: {...} } format
    return response.data.data ? { ...response, data: response.data.data } : response
  },
  (error: AxiosError<{ status: string; message: string }>) => {
    // Log API error
    logger.apiError(
      error.config?.method?.toUpperCase() || 'GET',
      error.config?.url || '',
      error
    )

    // Handle common HTTP errors
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
          logger.warn('Unauthorized access, redirecting to login')
          window.location.href = '/login'
          break
        case 403:
          logger.warn('Forbidden: You do not have permission to access this resource')
          break
        case 404:
          logger.warn('Not found:', data.message || 'Resource not found')
          break
        case 429:
          logger.warn('Rate limit exceeded. Please try again later.')
          break
        case 500:
          logger.error('Server error. Please try again later.', error)
          break
        default:
          logger.error('API Error:', error, { message: data.message })
      }
    } else if (error.request) {
      logger.error('Network error: No response received from server', error)
    } else {
      logger.error('Error:', error)
    }

    return Promise.reject(error)
  }
)

export default apiClient
