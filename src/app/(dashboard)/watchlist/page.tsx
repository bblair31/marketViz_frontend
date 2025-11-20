'use client';

import { motion } from 'framer-motion';
import { Star, Trash2, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkline } from '@/components/charts';
import {
  useWatchlist,
  useRemoveFromWatchlist,
  useMultipleQuotes,
} from '@/hooks/use-stock-data';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function WatchlistPage() {
  const { data: watchlist, isLoading: watchlistLoading } = useWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  // Get quotes for all watchlist symbols
  const symbols = watchlist?.map((item) => item.symbol) ?? [];
  const { data: quotes, isLoading: quotesLoading } = useMultipleQuotes(symbols);

  const isLoading = watchlistLoading || quotesLoading;

  // Create a map of symbol to quote data
  const quoteMap = new Map(quotes?.map((q) => [q.symbol, q]));

  // Generate mock sparkline data
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

  const handleRemove = (symbol: string) => {
    removeFromWatchlist.mutate(symbol);
  };

  if (isLoading) {
    return <WatchlistSkeleton />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Watchlist</h1>
          <p className="text-muted-foreground">
            Track your favorite stocks in one place
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Stocks
          </Button>
        </Link>
      </motion.div>

      {/* Watchlist content */}
      {!watchlist || watchlist.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Star className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No stocks in watchlist</h3>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Start adding stocks to your watchlist to track them here
              </p>
              <Link href="/dashboard">
                <Button className="mt-4">Browse Stocks</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-3">
          {watchlist.map((item, index) => {
            const quote = quoteMap.get(item.symbol);
            const isPositive = (quote?.change ?? 0) >= 0;

            return (
              <motion.div
                key={item.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="flex items-center justify-between p-4">
                    <Link
                      href={`/stocks/${item.symbol}`}
                      className="flex flex-1 items-center"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.symbol}</span>
                          <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {item.name}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </div>
                      </div>

                      {quote && (
                        <>
                          <div className="mx-4 hidden w-24 sm:block">
                            <Sparkline
                              data={getSparklineData(quote.changePercent)}
                              height={30}
                            />
                          </div>

                          <div className="mr-4 text-right">
                            <div className="font-medium">
                              {formatCurrency(quote.price)}
                            </div>
                            <Badge
                              variant={isPositive ? 'gain' : 'loss'}
                              className="mt-1"
                            >
                              {isPositive ? (
                                <TrendingUp className="mr-1 h-3 w-3" />
                              ) : (
                                <TrendingDown className="mr-1 h-3 w-3" />
                              )}
                              {formatPercent(quote.changePercent)}
                            </Badge>
                          </div>
                        </>
                      )}
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.symbol)}
                      disabled={removeFromWatchlist.isPending}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Summary */}
      {watchlist && watchlist.length > 0 && quotes && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Summary</CardTitle>
              <CardDescription>Overview of your watchlist performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Stocks</p>
                  <p className="text-2xl font-bold">{watchlist.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gainers</p>
                  <p className="text-2xl font-bold text-gain">
                    {quotes.filter((q) => q.change > 0).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Losers</p>
                  <p className="text-2xl font-bold text-loss">
                    {quotes.filter((q) => q.change < 0).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unchanged</p>
                  <p className="text-2xl font-bold">
                    {quotes.filter((q) => q.change === 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

function WatchlistSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-10 w-32" />
          <Skeleton className="mt-2 h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}
