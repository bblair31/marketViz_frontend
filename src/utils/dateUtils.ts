/**
 * Date Formatting Utilities using date-fns
 *
 * Replaces deprecated Moment.js with modern date-fns
 */
import {
  format,
  formatDistance,
  formatRelative,
  parseISO,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
} from 'date-fns'

/**
 * Format date as "Jan 15, 2025"
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM d, yyyy')
}

/**
 * Format date as "01/15/2025"
 */
export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MM/dd/yyyy')
}

/**
 * Format date and time as "Jan 15, 2025 3:45 PM"
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM d, yyyy h:mm a')
}

/**
 * Format time as "3:45 PM"
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'h:mm a')
}

/**
 * Format as relative time "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(dateObj, new Date(), { addSuffix: true })
}

/**
 * Smart format: "Today at 3:45 PM", "Yesterday at 2:30 PM", "Jan 15 at 4:00 PM"
 */
export function formatSmart(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date

  if (isToday(dateObj)) {
    return `Today at ${formatTime(dateObj)}`
  }

  if (isYesterday(dateObj)) {
    return `Yesterday at ${formatTime(dateObj)}`
  }

  if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEEE \'at\' h:mm a') // "Monday at 3:45 PM"
  }

  if (isThisYear(dateObj)) {
    return format(dateObj, 'MMM d \'at\' h:mm a') // "Jan 15 at 3:45 PM"
  }

  return formatDateTime(dateObj)
}

/**
 * Format for charts: "Jan 15"
 */
export function formatChartDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM d')
}

/**
 * Format market hours: "Market Closed" or "Market Open"
 */
export function getMarketStatus(): { isOpen: boolean; message: string } {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()
  const minute = now.getMinutes()

  // Weekend
  if (day === 0 || day === 6) {
    return { isOpen: false, message: 'Market Closed (Weekend)' }
  }

  // Convert to minutes since midnight
  const currentMinutes = hour * 60 + minute
  const marketOpen = 9 * 60 + 30 // 9:30 AM
  const marketClose = 16 * 60 // 4:00 PM

  if (currentMinutes >= marketOpen && currentMinutes < marketClose) {
    return { isOpen: true, message: 'Market Open' }
  }

  if (currentMinutes < marketOpen) {
    return { isOpen: false, message: 'Pre-Market' }
  }

  return { isOpen: false, message: 'After Hours' }
}

/**
 * Export all utilities
 */
export const dateUtils = {
  format: formatDate,
  formatShort: formatDateShort,
  formatDateTime,
  formatTime,
  formatRelative: formatRelativeTime,
  formatSmart,
  formatChart: formatChartDate,
  getMarketStatus,
}

export default dateUtils
