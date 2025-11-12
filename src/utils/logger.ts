/**
 * Modern Logger Utility for React Frontend
 *
 * A lightweight, type-safe logging abstraction that:
 * - Provides structured logging with levels
 * - Works in browser environments
 * - Can be configured per environment
 * - Sends logs to remote services in production
 * - Replaces raw console.* calls throughout the app
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = import.meta.env.DEV
  private minLevel: LogLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO

  /**
   * Format log message with timestamp and context
   */
  private format(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : ''
    return `[${timestamp}] ${level}: ${message}${contextStr}`
  }

  /**
   * Send logs to remote service (production only)
   */
  private sendToRemote(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDevelopment) {
      // TODO: Integrate with logging service (Sentry, LogRocket, etc.)
      // fetch('/api/logs', {
      //   method: 'POST',
      //   body: JSON.stringify({ level, message, context, timestamp: new Date() })
      // })
    }
  }

  /**
   * Check if log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    return levels.indexOf(level) >= levels.indexOf(this.minLevel)
  }

  /**
   * Debug level logging (development only)
   */
  debug(message: string, context?: LogContext) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.format(LogLevel.DEBUG, message, context))
    }
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.format(LogLevel.INFO, message, context))
      this.sendToRemote(LogLevel.INFO, message, context)
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.format(LogLevel.WARN, message, context))
      this.sendToRemote(LogLevel.WARN, message, context)
    }
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error, context?: LogContext) {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorContext = {
        ...context,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : undefined,
      }
      console.error(this.format(LogLevel.ERROR, message, errorContext))
      this.sendToRemote(LogLevel.ERROR, message, errorContext)
    }
  }

  /**
   * Log API requests
   */
  apiRequest(method: string, url: string, data?: any) {
    this.debug(`API ${method} ${url}`, { data })
  }

  /**
   * Log API responses
   */
  apiResponse(method: string, url: string, status: number, data?: any) {
    if (status >= 200 && status < 300) {
      this.debug(`API ${method} ${url} - ${status}`, { data })
    } else {
      this.warn(`API ${method} ${url} - ${status}`, { data })
    }
  }

  /**
   * Log API errors
   */
  apiError(method: string, url: string, error: Error) {
    this.error(`API ${method} ${url} failed`, error)
  }

  /**
   * Log component lifecycle events
   */
  component(componentName: string, event: string, data?: any) {
    this.debug(`[${componentName}] ${event}`, data)
  }

  /**
   * Log performance metrics
   */
  performance(metric: string, duration: number) {
    this.info(`Performance: ${metric}`, { duration: `${duration}ms` })
  }

  /**
   * Log user actions
   */
  userAction(action: string, context?: LogContext) {
    this.info(`User action: ${action}`, context)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export default
export default logger
