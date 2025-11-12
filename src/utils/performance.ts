/**
 * Performance Monitoring Utilities
 *
 * Measure and log performance metrics
 */
import { logger } from './logger'

/**
 * Measure execution time of a function
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start
    logger.performance(name, duration)
    return result
  } catch (error) {
    const duration = performance.now() - start
    logger.error(`${name} failed after ${duration}ms`, error as Error)
    throw error
  }
}

/**
 * Measure execution time of a synchronous function
 */
export function measure<T>(name: string, fn: () => T): T {
  const start = performance.now()
  try {
    const result = fn()
    const duration = performance.now() - start
    logger.performance(name, duration)
    return result
  } catch (error) {
    const duration = performance.now() - start
    logger.error(`${name} failed after ${duration}ms`, error as Error)
    throw error
  }
}

/**
 * Performance mark for custom timing
 */
export function mark(name: string) {
  performance.mark(name)
}

/**
 * Measure duration between two marks
 */
export function measureBetween(name: string, startMark: string, endMark: string) {
  try {
    performance.measure(name, startMark, endMark)
    const entries = performance.getEntriesByName(name)
    if (entries.length > 0) {
      const duration = entries[entries.length - 1].duration
      logger.performance(name, duration)
    }
  } catch (error) {
    logger.error('Failed to measure performance', error as Error, { name, startMark, endMark })
  }
}

/**
 * Clear performance marks and measures
 */
export function clearMarks() {
  performance.clearMarks()
  performance.clearMeasures()
}

/**
 * Monitor component render time (use with useEffect)
 */
export function monitorComponentRender(componentName: string, startTime: number) {
  const duration = performance.now() - startTime
  if (duration > 16) { // Warn if render takes longer than one frame (16ms)
    logger.warn(`Slow render: ${componentName}`, { duration: `${duration.toFixed(2)}ms` })
  } else {
    logger.debug(`Render: ${componentName}`, { duration: `${duration.toFixed(2)}ms` })
  }
}

/**
 * Export performance utilities
 */
export const perf = {
  measureAsync,
  measure,
  mark,
  measureBetween,
  clearMarks,
  monitorComponentRender,
}

export default perf
