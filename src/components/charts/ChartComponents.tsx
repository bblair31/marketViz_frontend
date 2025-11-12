/**
 * Chart.js v4 Wrapper Components
 *
 * Modern, reusable chart components following Chart.js v4 API
 */
import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { formatChartDate } from '@/utils/dateUtils'
import { formatCurrency } from '@/utils/numberUtils'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// ============================================
// Stock Price Line Chart (Modern Design)
// ============================================

interface StockPriceChartProps {
  data: Array<{ date: string; close: number }>
  symbol: string
  height?: number
}

export function StockPriceChart({ data, symbol, height = 300 }: StockPriceChartProps) {
  const chartData = useMemo(() => {
    const labels = data.map(d => formatChartDate(d.date))
    const prices = data.map(d => d.close)

    // Determine if stock is up or down for gradient color
    const isPositive = prices[prices.length - 1] >= prices[0]

    return {
      labels,
      datasets: [
        {
          label: symbol,
          data: prices,
          fill: true,
          backgroundColor: isPositive
            ? 'rgba(16, 185, 129, 0.1)' // Green gradient
            : 'rgba(239, 68, 68, 0.1)',  // Red gradient
          borderColor: isPositive ? '#10b981' : '#ef4444',
          borderWidth: 2,
          tension: 0.4, // Smooth curves
          pointRadius: 0, // Hide points for cleaner look
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderWidth: 2,
        },
      ],
    }
  }, [data, symbol])

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            return `Price: ${formatCurrency(context.parsed.y)}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          maxRotation: 0,
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          callback: (value) => formatCurrency(value as number),
        },
      },
    },
  }

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

// ============================================
// Sparkline Chart (Mini Trend Indicator)
// ============================================

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
}

export function Sparkline({ data, width = 100, height = 40, color }: SparklineProps) {
  const isPositive = data[data.length - 1] >= data[0]
  const lineColor = color || (isPositive ? '#10b981' : '#ef4444')

  const chartData = {
    labels: data.map((_, i) => i.toString()),
    datasets: [
      {
        data,
        borderColor: lineColor,
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  }

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

// ============================================
// Volume Bar Chart
// ============================================

interface VolumeChartProps {
  data: Array<{ date: string; volume: number }>
  height?: number
}

export function VolumeChart({ data, height = 150 }: VolumeChartProps) {
  const chartData = useMemo(() => {
    const labels = data.map(d => formatChartDate(d.date))
    const volumes = data.map(d => d.volume)

    return {
      labels,
      datasets: [
        {
          label: 'Volume',
          data: volumes,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    }
  }, [data])

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: {
          label: (context) => `Volume: ${(context.parsed.y / 1000000).toFixed(2)}M`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          callback: (value) => `${(value as number / 1000000).toFixed(1)}M`,
        },
      },
    },
  }

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={chartData} options={options} />
    </div>
  )
}

// Export all chart components
export default {
  StockPriceChart,
  Sparkline,
  VolumeChart,
}
