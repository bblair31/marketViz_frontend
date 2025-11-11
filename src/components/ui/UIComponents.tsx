/**
 * Modern UI Helper Components
 *
 * Reusable components following 2024-2025 fintech design trends
 */
import { CSSProperties } from 'react'
import { Icon, Label } from 'semantic-ui-react'

// ============================================
// Skeleton Loading States (Modern UX)
// ============================================

export function SkeletonCard() {
  return (
    <div className="skeleton-card" style={{
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '8px',
      height: '120px',
      marginBottom: '16px',
    }} />
  )
}

export function SkeletonText({ width = '100%' }: { width?: string }) {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '4px',
      height: '16px',
      width,
      marginBottom: '8px',
    }} />
  )
}

// ============================================
// Trend Indicator with Color Psychology
// ============================================

interface TrendIndicatorProps {
  value: number
  showIcon?: boolean
  showPercentage?: boolean
  size?: 'small' | 'medium' | 'large'
}

export function TrendIndicator({
  value,
  showIcon = true,
  showPercentage = true,
  size = 'medium'
}: TrendIndicatorProps) {
  const isPositive = value >= 0
  const color = isPositive ? '#10b981' : '#ef4444' // Modern green/red

  const fontSize = {
    small: '14px',
    medium: '16px',
    large: '20px',
  }[size]

  return (
    <span style={{
      color,
      fontWeight: 600,
      fontSize,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      {showIcon && (
        <Icon
          name={isPositive ? 'arrow up' : 'arrow down'}
          style={{ margin: 0 }}
        />
      )}
      {showPercentage && `${isPositive ? '+' : ''}${value.toFixed(2)}%`}
    </span>
  )
}

// ============================================
// Metric Card (Card-based Layout Trend)
// ============================================

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  subtitle?: string
  icon?: string
  color?: string
  loading?: boolean
}

export function MetricCard({
  title,
  value,
  change,
  subtitle,
  icon,
  color = '#3b82f6',
  loading = false
}: MetricCardProps) {
  if (loading) return <SkeletonCard />

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px',
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '4px',
          }}>
            {value}
          </div>
          {change !== undefined && (
            <TrendIndicator value={change} size="small" />
          )}
          {subtitle && (
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: '4px',
            }}>
              {subtitle}
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon name={icon as any} size="large" style={{ color, margin: 0 }} />
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Sentiment Badge (AI Sentiment Indicator)
// ============================================

interface SentimentBadgeProps {
  sentiment: 'positive' | 'negative' | 'neutral'
  score?: number
}

export function SentimentBadge({ sentiment, score }: SentimentBadgeProps) {
  const config = {
    positive: { color: 'green', icon: 'smile', text: 'Bullish' },
    negative: { color: 'red', icon: 'frown', text: 'Bearish' },
    neutral: { color: 'grey', icon: 'meh', text: 'Neutral' },
  }[sentiment]

  return (
    <Label color={config.color as any} size="small">
      <Icon name={config.icon as any} />
      {config.text}
      {score !== undefined && ` (${(score * 100).toFixed(0)}%)`}
    </Label>
  )
}

// ============================================
// Live Badge (Real-time Indicator)
// ============================================

export function LiveBadge() {
  return (
    <Label color="red" size="tiny" style={{ marginLeft: '8px' }}>
      <span style={{
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#ef4444',
        marginRight: '6px',
        animation: 'pulse 2s infinite',
      }} />
      LIVE
    </Label>
  )
}

// ============================================
// Price Display with Formatting
// ============================================

interface PriceDisplayProps {
  price: number
  currency?: string
  size?: 'small' | 'medium' | 'large'
}

export function PriceDisplay({ price, currency = 'USD', size = 'medium' }: PriceDisplayProps) {
  const fontSize = {
    small: '20px',
    medium: '32px',
    large: '48px',
  }[size]

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div style={{ fontSize, fontWeight: 700, color: '#fff' }}>
      {formatter.format(price)}
    </div>
  )
}
