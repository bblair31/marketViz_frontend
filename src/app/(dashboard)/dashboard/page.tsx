'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Newspaper } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkline } from '@/components/charts';
import { useTopMovers, useMarketNews } from '@/hooks/use-stock-data';
import { formatCurrency, formatPercent, formatVolume, cn } from '@/lib/utils';
import Link from 'next/link';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

function MarketMoversSection() {
  const { data: movers, isLoading, error } = useTopMovers();

  if (isLoading) {
    return <MarketMoversSkeleton />;
  }

  if (error || !movers) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Failed to load market movers</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="gainers" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="gainers" className="gap-2">
          <TrendingUp className="h-4 w-4 text-gain" />
          Gainers
        </TabsTrigger>
        <TabsTrigger value="losers" className="gap-2">
          <TrendingDown className="h-4 w-4 text-loss" />
          Losers
        </TabsTrigger>
        <TabsTrigger value="active" className="gap-2">
          <Activity className="h-4 w-4 text-neutral" />
          Most Active
        </TabsTrigger>
      </TabsList>

      <TabsContent value="gainers" className="mt-4">
        <StockList stocks={movers.gainers} type="gainers" />
      </TabsContent>

      <TabsContent value="losers" className="mt-4">
        <StockList stocks={movers.losers} type="losers" />
      </TabsContent>

      <TabsContent value="active" className="mt-4">
        <StockList stocks={movers.mostActive} type="active" />
      </TabsContent>
    </Tabs>
  );
}

interface StockListProps {
  stocks: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
  }>;
  type: 'gainers' | 'losers' | 'active';
}

function StockList({ stocks, type }: StockListProps) {
  // Generate mock sparkline data based on type
  const getSparklineData = (change: number) => {
    const baseValue = 100;
    const points = 20;
    const data: number[] = [];

    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const noise = (Math.random() - 0.5) * 5;
      const trend = baseValue + (change / 100) * baseValue * progress + noise;
      data.push(Math.max(0, trend));
    }

    return data;
  };

  return (
    <div className="space-y-2">
      {stocks.map((stock, index) => (
        <motion.div
          key={stock.symbol}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link href={`/stocks/${stock.symbol}`}>
            <Card className="transition-colors hover:bg-accent/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{stock.symbol}</span>
                    <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                      {stock.name}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Vol: {formatVolume(stock.volume)}
                  </div>
                </div>

                <div className="mx-4 hidden w-24 sm:block">
                  <Sparkline
                    data={getSparklineData(stock.changePercent)}
                    height={30}
                  />
                </div>

                <div className="text-right">
                  <div className="font-medium">{formatCurrency(stock.price)}</div>
                  <Badge
                    variant={stock.change >= 0 ? 'gain' : 'loss'}
                    className="mt-1"
                  >
                    {formatPercent(stock.changePercent)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function NewsSection() {
  const { data: news, isLoading, error } = useMarketNews();

  if (isLoading) {
    return <NewsSkeleton />;
  }

  if (error || !news) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Failed to load news</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {news.slice(0, 5).map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="transition-colors hover:bg-accent/50">
            <CardContent className="p-4">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium leading-tight line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {article.sentiment && (
                    <Badge
                      variant={
                        article.sentiment === 'bullish'
                          ? 'gain'
                          : article.sentiment === 'bearish'
                          ? 'loss'
                          : 'neutral'
                      }
                    >
                      {article.sentiment}
                    </Badge>
                  )}
                </div>
              </a>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function MarketMoversSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time market overview and top movers
        </p>
      </motion.div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Market Movers */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Market Movers
              </CardTitle>
              <CardDescription>
                Top performing and most active stocks today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<MarketMoversSkeleton />}>
                <MarketMoversSection />
              </Suspense>
            </CardContent>
          </Card>
        </motion.div>

        {/* Market News */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                Market News
              </CardTitle>
              <CardDescription>
                Latest financial news and market updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<NewsSkeleton />}>
                <NewsSection />
              </Suspense>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
