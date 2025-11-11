/**
 * 404 Not Found Page
 */
import { Header, Icon, Button } from 'semantic-ui-react'

export function NotFound() {
  return (
    <div style={{
      padding: '48px',
      textAlign: 'center',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Icon name="search" size="massive" style={{ color: 'rgba(255, 255, 255, 0.3)', marginBottom: '24px' }} />
      <Header as="h1" inverted style={{ fontSize: '72px', marginBottom: '8px' }}>
        404
      </Header>
      <Header as="h2" inverted style={{ marginBottom: '16px' }}>
        Page Not Found
      </Header>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px', marginBottom: '32px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        primary
        size="large"
        icon="home"
        content="Go to Dashboard"
        onClick={() => window.location.href = '/dashboard'}
      />
    </div>
  )
}

export default NotFound
