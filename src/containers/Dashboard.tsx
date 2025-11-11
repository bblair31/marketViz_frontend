/**
 * Modern Dashboard - Portfolio-Ready Design
 *
 * Features:
 * - Card-based layout with glassmorphism
 * - Real-time data with TanStack Query (no polling!)
 * - Skeleton loading states
 * - Modern UI/UX patterns from 2024/2025 trends
 */
import { Grid, Header, Divider, Icon, Card, Label } from 'semantic-ui-react'
import { useTopMovers, useMarketNews, useWatchlist } from '@/hooks'
import {
  MetricCard,
  TrendIndicator,
  LiveBadge,
  SkeletonCard,
  SentimentBadge,
} from '@/components/ui/UIComponents'
import { StockPriceChart } from '@/components/charts/ChartComponents'
import { formatSmart } from '@/utils/dateUtils'
import { formatCurrency, formatVolume } from '@/utils/numberUtils'

export function Dashboard() {
  // Use TanStack Query hooks - automatic caching and refetching!
  const { data: topMovers, isLoading: isLoadingMovers } = useTopMovers()
  const { data: news = [], isLoading: isLoadingNews } = useMarketNews()
  const { data: watchlist = [] } = useWatchlist()

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header with Live Indicator */}
      <div style={{ marginBottom: '32px' }}>
        <Header as="h1" inverted style={{ fontSize: '36px', marginBottom: '8px' }}>
          <Icon name="chart line" />
          Market Dashboard
          <LiveBadge />
        </Header>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>
          Real-time market data and insights powered by Alpha Vantage
        </p>
      </div>

      {/* Market Summary Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        {isLoadingMovers ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <MetricCard
              title="Top Gainer"
              value={topMovers?.gainers[0]?.symbol || '--'}
              change={topMovers?.gainers[0]?.changePercent}
              subtitle={formatCurrency(topMovers?.gainers[0]?.price || 0)}
              icon="arrow up"
              color="#10b981"
            />
            <MetricCard
              title="Top Loser"
              value={topMovers?.losers[0]?.symbol || '--'}
              change={topMovers?.losers[0]?.changePercent}
              subtitle={formatCurrency(topMovers?.losers[0]?.price || 0)}
              icon="arrow down"
              color="#ef4444"
            />
            <MetricCard
              title="Most Active"
              value={topMovers?.mostActive[0]?.symbol || '--'}
              change={topMovers?.mostActive[0]?.changePercent}
              subtitle={`Vol: ${formatVolume(topMovers?.mostActive[0]?.volume || 0)}`}
              icon="fire"
              color="#f59e0b"
            />
          </>
        )}
      </div>

      {/* Your Watchlist */}
      {watchlist.length > 0 && (
        <>
          <Header as="h2" inverted style={{ fontSize: '24px', marginBottom: '16px' }}>
            <Icon name="star" />
            Your Watchlist
          </Header>
          <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
            {watchlist.slice(0, 6).map((item) => (
              <div key={item.id} className="modern-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                      {item.symbol}
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {item.companyName}
                    </div>
                  </div>
                  <Icon
                    name="chart line"
                    size="large"
                    style={{ color: '#3b82f6', cursor: 'pointer' }}
                    onClick={() => window.location.href = `/stocks/${item.symbol}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Divider inverted />

      {/* Top Movers Section */}
      <Grid columns={2} stackable style={{ marginTop: '32px' }}>
        <Grid.Column>
          <Header as="h2" inverted style={{ fontSize: '24px', marginBottom: '16px' }}>
            <Icon name="arrow up" color="green" />
            Top Gainers
          </Header>
          {isLoadingMovers ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <Card.Group itemsPerRow={1}>
              {topMovers?.gainers.slice(0, 5).map((stock) => (
                <Card
                  key={stock.symbol}
                  fluid
                  className="modern-card"
                  style={{ cursor: 'pointer', background: 'rgba(16, 185, 129, 0.1)' }}
                  onClick={() => window.location.href = `/stocks/${stock.symbol}`}
                >
                  <Card.Content>
                    <Card.Header style={{ color: '#fff' }}>
                      {stock.symbol}
                      <span style={{ float: 'right' }}>
                        <TrendIndicator value={stock.changePercent} size="medium" />
                      </span>
                    </Card.Header>
                    <Card.Meta style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {formatCurrency(stock.price)}
                    </Card.Meta>
                    <Card.Description style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Volume: {formatVolume(stock.volume)}
                    </Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>

        <Grid.Column>
          <Header as="h2" inverted style={{ fontSize: '24px', marginBottom: '16px' }}>
            <Icon name="arrow down" color="red" />
            Top Losers
          </Header>
          {isLoadingMovers ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <Card.Group itemsPerRow={1}>
              {topMovers?.losers.slice(0, 5).map((stock) => (
                <Card
                  key={stock.symbol}
                  fluid
                  className="modern-card"
                  style={{ cursor: 'pointer', background: 'rgba(239, 68, 68, 0.1)' }}
                  onClick={() => window.location.href = `/stocks/${stock.symbol}`}
                >
                  <Card.Content>
                    <Card.Header style={{ color: '#fff' }}>
                      {stock.symbol}
                      <span style={{ float: 'right' }}>
                        <TrendIndicator value={stock.changePercent} size="medium" />
                      </span>
                    </Card.Header>
                    <Card.Meta style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {formatCurrency(stock.price)}
                    </Card.Meta>
                    <Card.Description style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Volume: {formatVolume(stock.volume)}
                    </Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>

      <Divider inverted />

      {/* Market News Feed */}
      <Header as="h2" inverted style={{ fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>
        <Icon name="newspaper" />
        Latest Market News
      </Header>

      {isLoadingNews ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : (
        <Card.Group itemsPerRow={1}>
          {news.slice(0, 10).map((article, idx) => (
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
      )}
    </div>
  )
}

export default Dashboard
