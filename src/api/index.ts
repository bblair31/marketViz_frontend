/**
 * API Module Entry Point
 *
 * Usage examples:
 *
 * // Import everything:
 * import api from '@/api'
 * await api.auth.login({ email, password })
 *
 * // Import specific modules:
 * import { authApi, marketApi } from '@/api'
 * await authApi.login({ email, password })
 *
 * // Import client for custom requests:
 * import { apiClient } from '@/api'
 * await apiClient.get('/custom-endpoint')
 */

export { default as apiClient } from './client'
export { default as api, authApi, marketApi, watchlistApi } from './endpoints'
export * from './types'
