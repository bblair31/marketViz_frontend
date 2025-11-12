/**
 * Modern Error Boundary using react-error-boundary
 *
 * Functional approach (no class components!) with better API
 */
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary'
import { ReactNode } from 'react'
import { Header, Button, Icon } from 'semantic-ui-react'
import { logger } from '@/utils/logger'

/**
 * Error Fallback Component
 */
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div style={{
      padding: '48px',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    }}>
      <Icon name="warning sign" size="massive" style={{ color: '#ef4444', marginBottom: '24px' }} />
      <Header as="h1" inverted style={{ marginBottom: '16px' }}>
        Oops! Something went wrong
      </Header>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px', maxWidth: '600px', marginBottom: '24px' }}>
        We encountered an unexpected error. Don't worry, your data is safe.
        Click below to return to the dashboard.
      </p>
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          maxWidth: '600px',
          textAlign: 'left',
        }}>
          <code style={{ color: '#ef4444', fontSize: '14px', wordBreak: 'break-word' }}>
            {error.message}
          </code>
        </div>
      )}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button
          primary
          size="large"
          icon="refresh"
          content="Try Again"
          onClick={resetErrorBoundary}
        />
        <Button
          size="large"
          icon="home"
          content="Go to Dashboard"
          onClick={() => window.location.href = '/dashboard'}
        />
      </div>
    </div>
  )
}

/**
 * Error handler function
 */
function errorHandler(error: Error, info: { componentStack: string }) {
  // Log error with context
  logger.error('React Error Boundary caught an error', error, {
    componentStack: info.componentStack,
    userAgent: navigator.userAgent,
    url: window.location.href,
  })

  // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  // Sentry.captureException(error, { contexts: { react: info } })
}

/**
 * ErrorBoundary wrapper component (FUNCTIONAL, not a class!)
 */
interface ErrorBoundaryProps {
  children: ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={errorHandler}
      onReset={() => {
        // Reset app state if needed
        logger.info('Error boundary reset')
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}

export default ErrorBoundary
