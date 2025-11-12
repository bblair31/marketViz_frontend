/**
 * Crypto Container - Placeholder for Future Feature
 *
 * Alpha Vantage supports cryptocurrency data,
 * this is a placeholder for future implementation
 */
import { Header, Icon, Button } from 'semantic-ui-react'

export function Crypto() {
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
      <Icon name="bitcoin" size="massive" style={{ color: '#f7931a', marginBottom: '24px' }} />
      <Header as="h1" inverted style={{ marginBottom: '16px' }}>
        Cryptocurrency Tracking
      </Header>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '18px', maxWidth: '600px', marginBottom: '24px' }}>
        Cryptocurrency tracking is coming soon! We'll be integrating Alpha Vantage's crypto APIs
        to provide real-time data for Bitcoin, Ethereum, and other major cryptocurrencies.
      </p>
      <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginBottom: '24px' }}>
        <strong>Planned Features:</strong>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '12px' }}>
          <li>✨ Real-time cryptocurrency prices</li>
          <li>📊 Historical price charts</li>
          <li>📰 Crypto news and sentiment analysis</li>
          <li>💱 Currency conversion</li>
        </ul>
      </div>
      <Button
        primary
        size="large"
        icon="arrow left"
        content="Back to Dashboard"
        onClick={() => window.location.href = '/dashboard'}
      />
    </div>
  )
}

export default Crypto
