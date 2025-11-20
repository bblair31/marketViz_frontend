'use client';

import { use, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  StarOff,
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  BarChart3,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CandlestickChart, VolumeChart, AreaChart } from '@/components/charts';
import {
  useStockQuote,
  useCompanyOverview,
  useHistoricalData,
  useMarketNews,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useIsInWatchlist,
} from '@/hooks/use-stock-data';
import {
  formatCurrency,
  formatPercent,
  formatVolume,
  formatCompactNumber,
  cn,
} from '@/lib/utils';
import type { CandlestickData, VolumeData, TimeRange } from '@/types';

interface StockPageProps {
  params: Promise<{ symbol: string }>;
}

export default function StockPage({ params }: StockPageProps) {
  const { symbol } = use(params);
  const upperSymbol = symbol.toUpperCase();

  const { data: quote, isLoading: quoteLoading } = useStockQuote(upperSymbol);
  const { data: overview, isLoading: overviewLoading } = useCompanyOverview(upperSymbol);
  const { data: historicalData, isLoading: historyLoading } = useHistoricalData(upperSymbol, 'full');
  const { data: news } = useMarketNews(upperSymbol);

  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const isInWatchlist = useIsInWatchlist(upperSymbol);

  // Transform historical data for charts
  const chartData = useMemo(() => {
    if (!historicalData) return { candlestick: [], volume: [], area: [] };

    const candlestick: CandlestickData[] = historicalData.map((d) => ({
      time: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    const volume: VolumeData[] = historicalData.map((d) => ({
      time: d.date,
      value: d.volume,
      color: d.close >= d.open ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
    }));

    const area = historicalData.map((d) => ({
      date: d.date,
      value: d.close,
    }));

    return { candlestick, volume, area };
  }, [historicalData]);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist.mutate(upperSymbol);
    } else {
      addToWatchlist.mutate({ symbol: upperSymbol, name: overview?.name ?? upperSymbol });
    }
  };

  if (quoteLoading || overviewLoading) {
    return <StockPageSkeleton />;
  }

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Stock not found</h2>
        <p className="text-muted-foreground">Could not find data for {upperSymbol}</p>
        <Link href="/dashboard">
          <Button className="mt-4">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isPositive = quote.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Back button */}
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Stock header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{upperSymbol}</h1>
            {overview && (
              <Badge variant="outline" className="hidden sm:inline-flex">
                {overview.exchange}
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            {overview?.name ?? 'Loading...'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleWatchlistToggle}
            disabled={addToWatchlist.isPending || removeFromWatchlist.isPending}
          >
            {isInWatchlist ? (
              <>
                <StarOff className="mr-2 h-4 w-4" />
                Remove from Watchlist
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" />
                Add to Watchlist
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Price section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-baseline gap-4">
            <span className="text-4xl font-bold">{formatCurrency(quote.price)}</span>
            <div className={cn('flex items-center gap-2', isPositive ? 'text-gain' : 'text-loss')}>
              {isPositive ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              <span className="text-xl font-semibold">
                {isPositive ? '+' : ''}
                {formatCurrency(quote.change)} ({formatPercent(quote.changePercent)})
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="font-medium">{formatCurrency(quote.open)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Previous Close</p>
              <p className="font-medium">{formatCurrency(quote.previousClose)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Day Range</p>
              <p className="font-medium">
                {formatCurrency(quote.low)} - {formatCurrency(quote.high)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Volume</p>
              <p className="font-medium">{formatVolume(quote.volume)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
          <CardDescription>Historical price and volume data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="candlestick">
            <TabsList>
              <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
            </TabsList>

            <TabsContent value="candlestick" className="mt-4">
              {historyLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="space-y-4">
                  <CandlestickChart data={chartData.candlestick} height={400} />
                  <VolumeChart data={chartData.volume} height={100} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="area" className="mt-4">
              {historyLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <AreaChart data={chartData.area} height={400} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Company Overview */}
      {overview && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Sector</p>
                <p className="font-medium">{overview.sector}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium">{overview.industry}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm line-clamp-4">{overview.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Key Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="font-medium">{formatCompactNumber(overview.marketCap)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">P/E Ratio</p>
                  <p className="font-medium">{overview.peRatio?.toFixed(2) ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">EPS</p>
                  <p className="font-medium">{formatCurrency(overview.eps)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dividend Yield</p>
                  <p className="font-medium">{(overview.dividendYield * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">52 Week High</p>
                  <p className="font-medium">{formatCurrency(overview.week52High)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">52 Week Low</p>
                  <p className="font-medium">{formatCurrency(overview.week52Low)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* News */}
      {news && news.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {news.slice(0, 3).map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border p-4 transition-colors hover:bg-accent/50"
                >
                  <h4 className="font-medium line-clamp-2">{article.title}</h4>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

function StockPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-10 w-32" />
          <Skeleton className="mt-2 h-6 w-48" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-[500px] w-full" />
    </div>
  );
}
