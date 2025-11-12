/**
 * Local Storage Abstraction
 *
 * Safer wrapper around localStorage with type safety and error handling
 */
import { logger } from './logger'
import { STORAGE_KEYS } from '@/constants'

/**
 * Get item from localStorage with type safety
 */
export function getItem<T = string>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return null
    }

    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(item) as T
    } catch {
      return item as unknown as T
    }
  } catch (error) {
    logger.error('Failed to get item from localStorage', error as Error, { key })
    return null
  }
}

/**
 * Set item in localStorage with error handling
 */
export function setItem<T = any>(key: string, value: T): boolean {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(key, serialized)
    return true
  } catch (error) {
    logger.error('Failed to set item in localStorage', error as Error, { key })
    return false
  }
}

/**
 * Remove item from localStorage
 */
export function removeItem(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    logger.error('Failed to remove item from localStorage', error as Error, { key })
    return false
  }
}

/**
 * Clear all localStorage
 */
export function clear(): boolean {
  try {
    localStorage.clear()
    return true
  } catch (error) {
    logger.error('Failed to clear localStorage', error as Error)
    return false
  }
}

/**
 * Check if key exists in localStorage
 */
export function hasItem(key: string): boolean {
  return localStorage.getItem(key) !== null
}

/**
 * Get JWT token
 */
export function getToken(): string | null {
  return getItem<string>(STORAGE_KEYS.JWT_TOKEN)
}

/**
 * Set JWT token
 */
export function setToken(token: string): boolean {
  return setItem(STORAGE_KEYS.JWT_TOKEN, token)
}

/**
 * Remove JWT token
 */
export function removeToken(): boolean {
  return removeItem(STORAGE_KEYS.JWT_TOKEN)
}

/**
 * Export storage utilities
 */
export const storage = {
  get: getItem,
  set: setItem,
  remove: removeItem,
  clear,
  has: hasItem,
  getToken,
  setToken,
  removeToken,
}

export default storage
