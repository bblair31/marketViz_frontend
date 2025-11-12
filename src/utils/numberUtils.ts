/**
 * Number Formatting Utilities
 *
 * Format numbers for financial displays
 */

/**
 * Format large numbers with K, M, B suffixes
 * Example: 1,234,567 → 1.23M
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`
  }
  return num.toFixed(2)
}

/**
 * Format currency with proper symbols
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format percentage with + or - sign
 */
export function formatPercentage(value: number, decimals = 2): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * Format volume numbers
 * Example: 50,234,567 → 50.23M
 */
export function formatVolume(volume: number): string {
  return formatLargeNumber(volume)
}

/**
 * Format market cap
 */
export function formatMarketCap(marketCap: number): string {
  return formatLargeNumber(marketCap)
}

/**
 * Parse Alpha Vantage numbered keys
 * Example: "01. symbol" → "symbol"
 */
export function parseAlphaVantageKey(key: string): string {
  return key.replace(/^\d+\.\s*/, '')
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export const numberUtils = {
  formatLarge: formatLargeNumber,
  formatCurrency,
  formatPercentage,
  formatVolume,
  formatMarketCap,
  parseAlphaVantageKey,
  calculatePercentageChange,
}

export default numberUtils
