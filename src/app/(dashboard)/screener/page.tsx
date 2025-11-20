'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Zap,
  BarChart3,
  DollarSign,
  Percent,
  ChevronDown,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useScreenerPresets,
  useScreenerPreset,
  useScreenerSectors,
  useScreenStocks,
} from '@/hooks/use-screener';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';
import type { ScreenerPreset, ScreenerFilters, SortBy, SortOrder } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const presetInfo: Record<ScreenerPreset, { label: string; description: string; icon: React.ElementType }> = {
  TOP_GAINERS: { label: 'Top Gainers', description: 'Stocks with highest daily gains', icon: TrendingUp },
  TOP_LOSERS: { label: 'Top Losers', description: 'Stocks with largest daily losses', icon: TrendingDown },
  MOST_ACTIVE: { label: 'Most Active', description: 'Highest trading volume', icon: Zap },
  HIGH_VOLUME: { label: 'High Volume', description: 'Above average volume', icon: BarChart3 },
  UNDERVALUED: { label: 'Undervalued', description: 'Low P/E ratio stocks', icon: DollarSign },
  HIGH_DIVIDEND: { label: 'High Dividend', description: 'Top dividend yields', icon: Percent },
};

export default function ScreenerPage() {
  const [activePreset, setActivePreset] = useState<ScreenerPreset>('TOP_GAINERS');
  const [customFilters, setCustomFilters] = useState<ScreenerFilters>({});
  const [sortBy, setSortBy] = useState<SortBy>('changePercent');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data: presets, isLoading: presetsLoading } = useScreenerPresets();
  const { data: presetResults, isLoading: presetLoading } = useScreenerPreset(activePreset, 20);
  const { data: sectors } = useScreenerSectors();
  const screenMutation = useScreenStocks();

  const handleCustomScreen = () => {
    screenMutation.mutate({
      filters: customFilters,
      sortBy,
      sortOrder,
      limit: 50,
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Stock Screener</h1>
        <p className="text-muted-foreground">
          Filter and discover stocks based on technical and fundamental criteria
        </p>
      </motion.div>

      {/* Preset Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activePreset} onValueChange={(v) => setActivePreset(v as ScreenerPreset)}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {Object.entries(presetInfo).map(([key, info]) => {
              const Icon = info.icon;
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-1">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{info.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(presetInfo).map(([key, info]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const Icon = info.icon;
                      return <Icon className="h-5 w-5" />;
                    })()}
                    {info.label}
                  </CardTitle>
                  <CardDescription>{info.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {presetLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : presetResults && presetResults.length > 0 ? (
                    <div className="space-y-3">
                      {presetResults.map((stock, index) => (
                        <motion.div
                          key={stock.symbol}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{stock.symbol}</span>
                                <Badge variant="outline" className="text-xs">
                                  {stock.sector || 'N/A'}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {stock.companyName}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(stock.price)}</div>
                            <Badge variant={stock.changePercent >= 0 ? 'gain' : 'loss'}>
                              {stock.changePercent >= 0 ? '+' : ''}
                              {formatPercent(stock.changePercent)}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-32 items-center justify-center text-muted-foreground">
                      No results found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* Custom Screener */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Custom Screener
            </CardTitle>
            <CardDescription>Build your own screening criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={customFilters.minPrice ?? ''}
                    onChange={(e) =>
                      setCustomFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={customFilters.maxPrice ?? ''}
                    onChange={(e) =>
                      setCustomFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Market Cap */}
              <div className="space-y-2">
                <Label>Market Cap (B)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={customFilters.minMarketCap ? customFilters.minMarketCap / 1e9 : ''}
                    onChange={(e) =>
                      setCustomFilters((prev) => ({
                        ...prev,
                        minMarketCap: e.target.value ? Number(e.target.value) * 1e9 : undefined,
                      }))
                    }
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={customFilters.maxMarketCap ? customFilters.maxMarketCap / 1e9 : ''}
                    onChange={(e) =>
                      setCustomFilters((prev) => ({
                        ...prev,
                        maxMarketCap: e.target.value ? Number(e.target.value) * 1e9 : undefined,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Volume */}
              <div className="space-y-2">
                <Label>Min Volume (M)</Label>
                <Input
                  type="number"
                  placeholder="Minimum volume"
                  value={customFilters.minVolume ? customFilters.minVolume / 1e6 : ''}
                  onChange={(e) =>
                    setCustomFilters((prev) => ({
                      ...prev,
                      minVolume: e.target.value ? Number(e.target.value) * 1e6 : undefined,
                    }))
                  }
                />
              </div>

              {/* P/E Ratio */}
              <div className="space-y-2">
                <Label>P/E Ratio</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={customFilters.minPE ?? ''}
                    onChange={(e) =>
                      setCustomFilters((prev) => ({
                        ...prev,
                        minPE: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={customFilters.maxPE ?? ''}
                    onChange={(e) =>
                      setCustomFilters((prev) => ({
                        ...prev,
                        maxPE: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Dividend Yield */}
              <div className="space-y-2">
                <Label>Min Dividend Yield (%)</Label>
                <Input
                  type="number"
                  placeholder="Minimum yield"
                  value={customFilters.minDividendYield ? customFilters.minDividendYield * 100 : ''}
                  onChange={(e) =>
                    setCustomFilters((prev) => ({
                      ...prev,
                      minDividendYield: e.target.value ? Number(e.target.value) / 100 : undefined,
                    }))
                  }
                />
              </div>

              {/* Sector */}
              <div className="space-y-2">
                <Label>Sector</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={customFilters.sector ?? ''}
                  onChange={(e) =>
                    setCustomFilters((prev) => ({
                      ...prev,
                      sector: e.target.value || undefined,
                    }))
                  }
                >
                  <option value="">All Sectors</option>
                  {sectors?.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sortBy">Sort by:</Label>
                  <select
                    id="sortBy"
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                  >
                    <option value="changePercent">Change %</option>
                    <option value="price">Price</option>
                    <option value="volume">Volume</option>
                    <option value="marketCap">Market Cap</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sortOrder">Order:</Label>
                  <select
                    id="sortOrder"
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleCustomScreen} disabled={screenMutation.isPending}>
                <Search className="mr-2 h-4 w-4" />
                {screenMutation.isPending ? 'Screening...' : 'Run Screen'}
              </Button>
            </div>

            {/* Custom Results */}
            {screenMutation.data && screenMutation.data.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold">Results ({screenMutation.data.length} stocks)</h3>
                {screenMutation.data.map((stock, index) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{stock.symbol}</span>
                        {stock.sector && (
                          <Badge variant="outline" className="text-xs">
                            {stock.sector}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{stock.companyName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(stock.price)}</div>
                      <Badge variant={stock.changePercent >= 0 ? 'gain' : 'loss'}>
                        {formatPercent(stock.changePercent)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {screenMutation.isError && (
              <div className="mt-4 rounded-lg bg-destructive/10 p-4 text-destructive">
                Error running screen: {screenMutation.error?.message}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
