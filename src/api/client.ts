/**
 * Axios HTTP Client with interceptors for authentication and error handling
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import env from '../env'

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - automatically add JWT token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('jwt')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors consistently
apiClient.interceptors.response.use(
  (response) => {
    // Extract data from the standard { status: "success", data: {...} } format
    return response.data.data ? { ...response, data: response.data.data } : response
  },
  (error: AxiosError<{ status: string; message: string }>) => {
    // Handle common HTTP errors
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('jwt')
          localStorage.removeItem('user')
          window.location.href = '/login'
          break
        case 403:
          console.error('Forbidden: You do not have permission to access this resource')
          break
        case 404:
          console.error('Not found:', data.message || 'Resource not found')
          break
        case 429:
          console.error('Rate limit exceeded. Please try again later.')
          break
        case 500:
          console.error('Server error. Please try again later.')
          break
        default:
          console.error('API Error:', data.message || 'An unexpected error occurred')
      }
    } else if (error.request) {
      console.error('Network error: No response received from server')
    } else {
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
