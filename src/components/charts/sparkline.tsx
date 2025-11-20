'use client';

import { memo } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}

function SparklineComponent({
  data,
  color = '#3b82f6',
  height = 40,
  className,
}: SparklineProps) {
  // Determine if trend is positive (last value > first value)
  const isPositive = data.length >= 2 && data[data.length - 1]! >= data[0]!;
  const lineColor = color === '#3b82f6' ? (isPositive ? '#22c55e' : '#ef4444') : color;

  const chartData = data.map((value, index) => ({
    index,
    value,
  }));

  return (
    <div className={className} style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sparkline-gradient-${lineColor}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={1.5}
            fill={`url(#sparkline-gradient-${lineColor})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export const Sparkline = memo(SparklineComponent);
