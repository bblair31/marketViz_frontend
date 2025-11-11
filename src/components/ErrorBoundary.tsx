/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the component tree and displays a fallback UI
 */
import { Component, ReactNode } from 'react'
import { Header, Button, Icon } from 'semantic-ui-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/dashboard'
  }

  render() {
    if (this.state.hasError) {
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
          {this.state.error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              maxWidth: '600px',
              textAlign: 'left',
            }}>
              <code style={{ color: '#ef4444', fontSize: '14px' }}>
                {this.state.error.message}
              </code>
            </div>
          )}
          <Button
            primary
            size="large"
            icon="home"
            content="Return to Dashboard"
            onClick={this.handleReset}
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
