/**
 * Common TypeScript Types and Type Guards
 *
 * Utility types for better type safety throughout the app
 */

/**
 * Make specific properties required
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

/**
 * Make specific properties optional
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

/**
 * Deep partial type
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

/**
 * Async function type
 */
export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

/**
 * Loading state helper
 */
export interface LoadingState {
  isLoading: boolean
  error: Error | null
}

/**
 * Form field state
 */
export interface FieldState<T> {
  value: T
  error?: string
  touched: boolean
}

// ============================================
// Type Guards
// ============================================

/**
 * Check if value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Check if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Check if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * Check if value is an object
 */
export function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Check if value is an array
 */
export function isArray<T = any>(value: unknown): value is T[] {
  return Array.isArray(value)
}

/**
 * Check if value is a function
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

/**
 * Check if error is an Axios error
 */
export function isAxiosError(error: unknown): error is { response: any; request: any; message: string } {
  return isObject(error) && 'response' in error && 'request' in error
}

/**
 * Check if value is a valid API response
 */
export function isApiResponse<T = any>(value: unknown): value is ApiResponse<T> {
  return (
    isObject(value) &&
    'status' in value &&
    (value.status === 'success' || value.status === 'error')
  )
}

/**
 * Assert value is defined (throws if not)
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message = 'Value is not defined'
): asserts value is T {
  if (!isDefined(value)) {
    throw new Error(message)
  }
}

/**
 * Exhaustive check for switch statements
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}

// Export all type guards
export const typeGuards = {
  isDefined,
  isString,
  isNumber,
  isObject,
  isArray,
  isFunction,
  isAxiosError,
  isApiResponse,
  assertDefined,
  assertNever,
}

export default typeGuards
