/**
 * Watchlist Container - Modern Design
 *
 * Features:
 * - Grid layout of watchlist stocks
 * - Real-time quotes with TanStack Query
 * - Quick remove functionality
 * - Empty state with helpful message
 */
import { Header, Icon, Card, Button, Grid } from 'semantic-ui-react'
import {
  useWatchlist,
  useRemoveFromWatchlist,
  useMultipleQuotes,
} from '@/hooks'
import {
  TrendIndicator,
  SkeletonCard,
  PriceDisplay,
} from '@/components/ui/UIComponents'
import { formatVolume } from '@/utils/numberUtils'

export function WatchlistContainer() {
  const { data: watchlist = [], isLoading } = useWatchlist()
  const removeFromWatchlist = useRemoveFromWatchlist()

  // Get quotes for all watchlist symbols
  const symbols = watchlist.map(item => item.symbol)
  const { data: quotes = [] } = useMultipleQuotes(symbols, symbols.length > 0)

  const handleRemove = (symbol: string) => {
    if (confirm(`Remove ${symbol} from your watchlist?`)) {
      removeFromWatchlist.mutate(symbol)
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '24px' }}>
        <div className="dashboard-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  if (watchlist.length === 0) {
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
        <Icon name="star outline" size="massive" style={{ color: 'rgba(255, 255, 255, 0.3)', marginBottom: '24px' }} />
        <Header as="h2" inverted style={{ marginBottom: '16px' }}>
          Your Watchlist is Empty
        </Header>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px', marginBottom: '24px' }}>
          Search for stocks and add them to your watchlist to track their performance.
        </p>
        <Button
          primary
          size="large"
          icon="search"
          content="Search Stocks"
          onClick={() => window.location.href = '/dashboard'}
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Header as="h1" inverted style={{ fontSize: '36px', marginBottom: '32px' }}>
        <Icon name="star" />
        Your Watchlist
        <Header.Subheader style={{ marginTop: '8px', color: 'rgba(255, 255, 255, 0.6)' }}>
          Tracking {watchlist.length} {watchlist.length === 1 ? 'stock' : 'stocks'}
        </Header.Subheader>
      </Header>

      <Grid columns={3} stackable>
        {watchlist.map((item, index) => {
          const quote = quotes[index]

          return (
            <Grid.Column key={item.id}>
              <Card
                fluid
                className="modern-card"
                style={{ cursor: 'pointer' }}
                onClick={() => window.location.href = `/stocks/${item.symbol}`}
              >
                <Card.Content>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <Card.Header style={{ color: '#fff', fontSize: '24px', marginBottom: '4px' }}>
                        {item.symbol}
                      </Card.Header>
                      <Card.Meta style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '16px' }}>
                        {item.companyName}
                      </Card.Meta>

                      {quote ? (
                        <>
                          <div style={{ marginBottom: '8px' }}>
                            <span style={{ color: '#fff', fontSize: '28px', fontWeight: 700 }}>
                              ${quote.price.toFixed(2)}
                            </span>
                          </div>
                          <TrendIndicator value={quote.changePercent} size="medium" />
                          <div style={{ marginTop: '12px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                            Vol: {formatVolume(quote.volume)}
                          </div>
                        </>
                      ) : (
                        <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Loading quote...
                        </div>
                      )}
                    </div>

                    <Icon
                      name="star"
                      size="large"
                      style={{ color: '#fbbf24', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(item.symbol)
                      }}
                    />
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          )
        })}
      </Grid>
    </div>
  )
}

export default WatchlistContainer
