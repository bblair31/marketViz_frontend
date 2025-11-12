/**
 * Validation Utilities
 *
 * Type-safe input validation and sanitization
 */
import { VALIDATION } from '@/constants'

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Email validation using RFC 5322 compliant regex (simplified)
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' }
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }

  return { isValid: true }
}

/**
 * Password validation
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`
    }
  }

  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `Password must be less than ${VALIDATION.MAX_PASSWORD_LENGTH} characters`
    }
  }

  return { isValid: true }
}

/**
 * Stock symbol validation
 */
export function validateSymbol(symbol: string): ValidationResult {
  const symbolRegex = /^[A-Z]{1,10}$/

  if (!symbol || symbol.trim() === '') {
    return { isValid: false, error: 'Stock symbol is required' }
  }

  const upperSymbol = symbol.toUpperCase()

  if (!symbolRegex.test(upperSymbol)) {
    return {
      isValid: false,
      error: 'Invalid symbol format (use uppercase letters, 1-10 characters)'
    }
  }

  return { isValid: true }
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(input: string): string {
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}

/**
 * Sanitize HTML input
 */
export function sanitizeHTML(html: string): string {
  const allowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br']
  const div = document.createElement('div')
  div.innerHTML = html

  // Remove script tags and event handlers
  const scripts = div.querySelectorAll('script')
  scripts.forEach(script => script.remove())

  // Remove event handlers (onclick, onerror, etc.)
  const elements = div.querySelectorAll('*')
  elements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name)
      }
    })
  })

  return div.innerHTML
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }

  return { isValid: true }
}

/**
 * Validate number range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  if (value < min || value > max) {
    return {
      isValid: false,
      error: `${fieldName} must be between ${min} and ${max}`
    }
  }

  return { isValid: true }
}

/**
 * Validate URL
 */
export function validateURL(url: string): ValidationResult {
  try {
    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Invalid URL format' }
  }
}

/**
 * Compose multiple validators
 */
export function compose(...validators: Array<() => ValidationResult>): ValidationResult {
  for (const validator of validators) {
    const result = validator()
    if (!result.isValid) {
      return result
    }
  }

  return { isValid: true }
}

// Export all validators
export const validators = {
  email: validateEmail,
  password: validatePassword,
  symbol: validateSymbol,
  required: validateRequired,
  range: validateRange,
  url: validateURL,
  compose,
}

export default validators
