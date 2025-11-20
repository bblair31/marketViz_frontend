'use client';

import { memo } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatCompactNumber } from '@/lib/utils';

interface DataPoint {
  date: string;
  value: number;
  [key: string]: string | number;
}

interface AreaChartProps {
  data: DataPoint[];
  dataKey?: string;
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  gradient?: boolean;
  color?: string;
  className?: string;
}

function AreaChartComponent({
  data,
  dataKey = 'value',
  xAxisKey = 'date',
  height = 300,
  showGrid = true,
  showAxis = true,
  gradient = true,
  color = '#3b82f6',
  className,
}: AreaChartProps) {
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {gradient && (
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />
          )}
          {showAxis && (
            <>
              <XAxis
                dataKey={xAxisKey}
                stroke="rgba(255, 255, 255, 0.3)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.3)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => formatCompactNumber(value)}
              />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'white',
            }}
            formatter={(value: number) => [formatCurrency(value), 'Price']}
            labelStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={gradient ? `url(#gradient-${dataKey})` : color}
            fillOpacity={gradient ? 1 : 0.1}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export const AreaChart = memo(AreaChartComponent);
