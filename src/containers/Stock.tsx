/**
 * Stock Detail Page - Modern Design with Charts
 *
 * Features:
 * - Real-time quote with TanStack Query
 * - Interactive price chart
 * - Company overview
 * - Add to watchlist functionality
 * - News feed for the stock
 */
import { useParams } from 'react-router-dom'
import { Grid, Header, Button, Icon, Card, Statistic, Divider } from 'semantic-ui-react'
import {
  useStockQuote,
  useDailyData,
  useCompanyOverview,
  useMarketNews,
  useIsInWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
} from '@/hooks'
import {
  MetricCard,
  TrendIndicator,
  LiveBadge,
  SkeletonCard,
  PriceDisplay,
  SentimentBadge,
} from '@/components/ui/UIComponents'
import { StockPriceChart, VolumeChart } from '@/components/charts/ChartComponents'
import { formatSmart } from '@/utils/dateUtils'
import { formatVolume, formatMarketCap } from '@/utils/numberUtils'

export function Stock() {
  const { symbol = '' } = useParams<{ symbol: string }>()

  // Fetch all data with TanStack Query
  const { data: quote, isLoading: isLoadingQuote } = useStockQuote(symbol)
  const { data: dailyData = [], isLoading: isLoadingDaily } = useDailyData(symbol, 'compact')
  const { data: overview, isLoading: isLoadingOverview } = useCompanyOverview(symbol)
  const { data: news = [] } = useMarketNews(symbol)

  // Watchlist management
  const isInWatchlist = useIsInWatchlist(symbol)
  const addToWatchlist = useAddToWatchlist()
  const removeFromWatchlist = useRemoveFromWatchlist()

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist.mutate(symbol)
    } else {
      addToWatchlist.mutate({
        symbol,
        companyName: overview?.name || symbol,
      })
    }
  }

  if (isLoadingQuote) {
    return (
      <div style={{ padding: '24px' }}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (!quote) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#fff' }}>
        <Header as="h2" inverted>
          <Icon name="warning sign" />
          Stock not found
        </Header>
        <p>Unable to find data for symbol: {symbol}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Header as="h1" inverted style={{ fontSize: '36px', marginBottom: '8px' }}>
            {symbol}
            <LiveBadge />
          </Header>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '18px' }}>
            {overview?.name || 'Loading company name...'}
          </p>
        </div>
        <Button
          size="large"
          icon={isInWatchlist ? 'star' : 'star outline'}
          content={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          color={isInWatchlist ? 'yellow' : undefined}
          onClick={handleWatchlistToggle}
          loading={addToWatchlist.isPending || removeFromWatchlist.isPending}
        />
      </div>

      {/* Price Display */}
      <div className="modern-card" style={{ marginBottom: '24px', padding: '32px' }}>
        <Grid columns={2} stackable>
          <Grid.Column width={10}>
            <PriceDisplay price={quote.price} size="large" />
            <div style={{ marginTop: '8px' }}>
              <TrendIndicator value={quote.changePercent} size="large" />
              <span style={{ marginLeft: '16px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '18px' }}>
                ${quote.change.toFixed(2)}
              </span>
            </div>
            <div style={{ marginTop: '16px', color: 'rgba(255, 255, 255, 0.6)' }}>
              {quote.latestTradingDay}
            </div>
          </Grid.Column>
          <Grid.Column width={6}>
            <Statistic.Group size="small" widths="two" inverted>
              <Statistic>
                <Statistic.Label>Open</Statistic.Label>
                <Statistic.Value>${quote.open.toFixed(2)}</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>Previous Close</Statistic.Label>
                <Statistic.Value>${quote.previousClose.toFixed(2)}</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>Day High</Statistic.Label>
                <Statistic.Value>${quote.high.toFixed(2)}</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>Day Low</Statistic.Label>
                <Statistic.Value>${quote.low.toFixed(2)}</Statistic.Value>
              </Statistic>
            </Statistic.Group>
          </Grid.Column>
        </Grid>
      </div>

      {/* Key Metrics */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Volume"
          value={formatVolume(quote.volume)}
          icon="chart bar"
          color="#3b82f6"
          loading={isLoadingQuote}
        />
        {overview && (
          <>
            <MetricCard
              title="Market Cap"
              value={formatMarketCap(overview.marketCap)}
              icon="building"
              color="#8b5cf6"
              loading={isLoadingOverview}
            />
            <MetricCard
              title="P/E Ratio"
              value={overview.peRatio.toFixed(2)}
              icon="calculator"
              color="#f59e0b"
              loading={isLoadingOverview}
            />
          </>
        )}
      </div>

      {/* Price Chart */}
      <div className="modern-card" style={{ marginBottom: '24px', padding: '24px' }}>
        <Header as="h3" inverted>
          <Icon name="chart line" />
          Price History (90 days)
        </Header>
        {isLoadingDaily ? (
          <SkeletonCard />
        ) : (
          <StockPriceChart data={dailyData.slice(-90)} symbol={symbol} height={400} />
        )}
      </div>

      <Divider inverted />

      {/* Company Overview */}
      {overview && (
        <>
          <Header as="h2" inverted style={{ fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>
            <Icon name="info circle" />
            Company Overview
          </Header>
          <div className="modern-card" style={{ marginBottom: '24px' }}>
            <Grid columns={2} stackable>
              <Grid.Column>
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Sector:</strong>
                  <div style={{ color: '#fff', fontSize: '16px' }}>{overview.sector}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Industry:</strong>
                  <div style={{ color: '#fff', fontSize: '16px' }}>{overview.industry}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Exchange:</strong>
                  <div style={{ color: '#fff', fontSize: '16px' }}>{overview.exchange}</div>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ color: 'rgba(255, 255, 255, 0.6)' }}>52 Week High:</strong>
                  <div style={{ color: '#fff', fontSize: '16px' }}>${overview['52WeekHigh'].toFixed(2)}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ color: 'rgba(255, 255, 255, 0.6)' }}>52 Week Low:</strong>
                  <div style={{ color: '#fff', fontSize: '16px' }}>${overview['52WeekLow'].toFixed(2)}</div>
                </div>
                {overview.dividendYield > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Dividend Yield:</strong>
                    <div style={{ color: '#fff', fontSize: '16px' }}>{(overview.dividendYield * 100).toFixed(2)}%</div>
                  </div>
                )}
              </Grid.Column>
            </Grid>
            <Divider inverted />
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
              {overview.description}
            </p>
          </div>
        </>
      )}

      {/* News */}
      {news.length > 0 && (
        <>
          <Header as="h2" inverted style={{ fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>
            <Icon name="newspaper" />
            Related News
          </Header>
          <Card.Group itemsPerRow={1}>
            {news.slice(0, 5).map((article, idx) => (
              <Card
                key={idx}
                fluid
                className="modern-card"
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card.Content>
                  <Card.Header style={{ color: '#fff', marginBottom: '8px' }}>
                    {article.title}
                    {article.sentiment && (
                      <span style={{ float: 'right' }}>
                        <SentimentBadge sentiment={article.sentiment} />
                      </span>
                    )}
                  </Card.Header>
                  <Card.Meta style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                    {article.source} • {formatSmart(article.publishedAt)}
                  </Card.Meta>
                  <Card.Description style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {article.summary}
                  </Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </>
      )}
    </div>
  )
}

export default Stock
