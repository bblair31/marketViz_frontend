'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart } from '@/components/charts';
import {
  usePortfolioSummary,
  usePortfolioMetrics,
  usePortfolioPerformance,
  useCorrelationMatrix,
} from '@/hooks/use-portfolio';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';
import type { PerformancePeriod } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PortfolioPage() {
  const [period, setPeriod] = useState<PerformancePeriod>('1M');

  const { data: summary, isLoading: summaryLoading } = usePortfolioSummary();
  const { data: metrics, isLoading: metricsLoading } = usePortfolioMetrics();
  const { data: performance, isLoading: performanceLoading } = usePortfolioPerformance(period);
  const { data: correlation } = useCorrelationMatrix();

  const isLoading = summaryLoading || metricsLoading;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        <p className="text-muted-foreground">
          Track your holdings and analyze performance
        </p>
      </motion.div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : summary ? (
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Cost basis: {formatCurrency(summary.totalCost)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Gain</CardTitle>
              {summary.totalGain >= 0 ? (
                <TrendingUp className="h-4 w-4 text-gain" />
              ) : (
                <TrendingDown className="h-4 w-4 text-loss" />
              )}
            </CardHeader>
            <CardContent>
              <div className={cn('text-2xl font-bold', summary.totalGain >= 0 ? 'text-gain' : 'text-loss')}>
                {formatCurrency(summary.totalGain)}
              </div>
              <p className={cn('text-xs', summary.totalGainPercent >= 0 ? 'text-gain' : 'text-loss')}>
                {formatPercent(summary.totalGainPercent)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Day Change</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={cn('text-2xl font-bold', summary.dayChange >= 0 ? 'text-gain' : 'text-loss')}>
                {formatCurrency(summary.dayChange)}
              </div>
              <p className={cn('text-xs', summary.dayChangePercent >= 0 ? 'text-gain' : 'text-loss')}>
                {formatPercent(summary.dayChangePercent)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Holdings</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.holdings.length}</div>
              <p className="text-xs text-muted-foreground">Positions</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      {/* Risk Metrics */}
      {metrics && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Metrics
              </CardTitle>
              <CardDescription>Portfolio risk and diversification analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                  <p className="text-xl font-semibold">{metrics.sharpeRatio.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Beta</p>
                  <p className="text-xl font-semibold">{metrics.beta.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Std Deviation</p>
                  <p className="text-xl font-semibold">{(metrics.standardDeviation * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diversification</p>
                  <p className="text-xl font-semibold">{metrics.diversificationScore.toFixed(0)}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Performance Chart */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Portfolio value over time</CardDescription>
              </div>
              <Tabs value={period} onValueChange={(v) => setPeriod(v as PerformancePeriod)}>
                <TabsList>
                  <TabsTrigger value="1W">1W</TabsTrigger>
                  <TabsTrigger value="1M">1M</TabsTrigger>
                  <TabsTrigger value="3M">3M</TabsTrigger>
                  <TabsTrigger value="6M">6M</TabsTrigger>
                  <TabsTrigger value="1Y">1Y</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {performanceLoading ? (
              <Skeleton className="h-[300px]" />
            ) : performance ? (
              <AreaChart
                data={performance.map((p) => ({ date: p.date, value: p.value }))}
                height={300}
              />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No performance data available
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Holdings Table */}
      {summary && summary.holdings.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Holdings</CardTitle>
              <CardDescription>Your current positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.holdings.map((holding) => (
                  <div
                    key={holding.symbol}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="font-semibold">{holding.symbol}</div>
                      <div className="text-sm text-muted-foreground">{holding.companyName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(holding.currentPrice)}</div>
                      <Badge variant={holding.gain >= 0 ? 'gain' : 'loss'}>
                        {formatPercent(holding.gainPercent)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
