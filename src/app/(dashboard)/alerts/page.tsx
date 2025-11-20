'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useAlerts,
  useAlertStats,
  useCreateAlert,
  useCancelAlert,
  useDeleteAlert,
} from '@/hooks/use-alerts';
import { formatCurrency, cn } from '@/lib/utils';
import type { AlertCondition, AlertStatus, PriceAlert } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const conditionLabels: Record<AlertCondition, { label: string; icon: React.ElementType }> = {
  ABOVE: { label: 'Price Above', icon: TrendingUp },
  BELOW: { label: 'Price Below', icon: TrendingDown },
  CROSSES_ABOVE: { label: 'Crosses Above', icon: TrendingUp },
  CROSSES_BELOW: { label: 'Crosses Below', icon: TrendingDown },
};

const statusColors: Record<AlertStatus, string> = {
  ACTIVE: 'bg-green-500/10 text-green-500',
  TRIGGERED: 'bg-blue-500/10 text-blue-500',
  CANCELLED: 'bg-gray-500/10 text-gray-500',
  EXPIRED: 'bg-yellow-500/10 text-yellow-500',
};

export default function AlertsPage() {
  const [statusFilter, setStatusFilter] = useState<AlertStatus | undefined>(undefined);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    condition: 'ABOVE' as AlertCondition,
    targetPrice: '',
    note: '',
  });

  const { data: alerts, isLoading: alertsLoading } = useAlerts(statusFilter);
  const { data: stats, isLoading: statsLoading } = useAlertStats();
  const createMutation = useCreateAlert();
  const cancelMutation = useCancelAlert();
  const deleteMutation = useDeleteAlert();

  const handleCreateAlert = () => {
    if (!newAlert.symbol || !newAlert.targetPrice) return;

    createMutation.mutate(
      {
        symbol: newAlert.symbol.toUpperCase(),
        condition: newAlert.condition,
        targetPrice: Number(newAlert.targetPrice),
        note: newAlert.note || undefined,
      },
      {
        onSuccess: () => {
          setNewAlert({ symbol: '', condition: 'ABOVE', targetPrice: '', note: '' });
          setShowCreateForm(false);
        },
      }
    );
  };

  const handleCancelAlert = (id: string) => {
    cancelMutation.mutate(id);
  };

  const handleDeleteAlert = (id: string) => {
    deleteMutation.mutate(id);
  };

  const filteredAlerts = alerts || [];

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
          <h1 className="text-3xl font-bold tracking-tight">Price Alerts</h1>
          <p className="text-muted-foreground">
            Get notified when stocks reach your target prices
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="mr-2 h-4 w-4" />
          New Alert
        </Button>
      </motion.div>

      {/* Stats Cards */}
      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : stats ? (
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-500">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-500">Triggered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.triggered}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      {/* Create Alert Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Create New Alert</CardTitle>
                <CardDescription>Set up a price alert for any stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      placeholder="AAPL"
                      value={newAlert.symbol}
                      onChange={(e) =>
                        setNewAlert((prev) => ({ ...prev, symbol: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <select
                      id="condition"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={newAlert.condition}
                      onChange={(e) =>
                        setNewAlert((prev) => ({
                          ...prev,
                          condition: e.target.value as AlertCondition,
                        }))
                      }
                    >
                      {Object.entries(conditionLabels).map(([key, { label }]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetPrice">Target Price</Label>
                    <Input
                      id="targetPrice"
                      type="number"
                      placeholder="150.00"
                      value={newAlert.targetPrice}
                      onChange={(e) =>
                        setNewAlert((prev) => ({ ...prev, targetPrice: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">Note (optional)</Label>
                    <Input
                      id="note"
                      placeholder="Reminder note"
                      value={newAlert.note}
                      onChange={(e) =>
                        setNewAlert((prev) => ({ ...prev, note: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAlert}
                    disabled={
                      createMutation.isPending || !newAlert.symbol || !newAlert.targetPrice
                    }
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Alert'}
                  </Button>
                </div>
                {createMutation.isError && (
                  <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {createMutation.error?.message}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Alerts</CardTitle>
                <CardDescription>Manage your price alerts</CardDescription>
              </div>
              <Tabs
                value={statusFilter ?? 'all'}
                onValueChange={(v) => setStatusFilter(v === 'all' ? undefined : (v as AlertStatus))}
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="ACTIVE">Active</TabsTrigger>
                  <TabsTrigger value="TRIGGERED">Triggered</TabsTrigger>
                  <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {alertsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : filteredAlerts.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredAlerts.map((alert) => {
                    const conditionInfo = conditionLabels[alert.condition];
                    const Icon = conditionInfo.icon;

                    return (
                      <motion.div
                        key={alert.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-full',
                              alert.status === 'ACTIVE'
                                ? 'bg-green-500/10 text-green-500'
                                : alert.status === 'TRIGGERED'
                                  ? 'bg-blue-500/10 text-blue-500'
                                  : 'bg-gray-500/10 text-gray-500'
                            )}
                          >
                            {alert.status === 'ACTIVE' ? (
                              <Bell className="h-5 w-5" />
                            ) : alert.status === 'TRIGGERED' ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <BellOff className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{alert.symbol}</span>
                              <Badge className={statusColors[alert.status]}>
                                {alert.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Icon className="h-3 w-3" />
                              {conditionInfo.label} {formatCurrency(alert.targetPrice)}
                            </div>
                            {alert.note && (
                              <div className="text-xs text-muted-foreground">{alert.note}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {alert.currentPrice && (
                            <div className="text-right text-sm">
                              <div className="text-muted-foreground">Current</div>
                              <div className="font-medium">
                                {formatCurrency(alert.currentPrice)}
                              </div>
                            </div>
                          )}
                          {alert.status === 'ACTIVE' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCancelAlert(alert.id)}
                              disabled={cancelMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAlert(alert.id)}
                            disabled={deleteMutation.isPending}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center gap-2 text-muted-foreground">
                <AlertCircle className="h-8 w-8" />
                <p>No alerts found</p>
                <Button variant="outline" size="sm" onClick={() => setShowCreateForm(true)}>
                  Create your first alert
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
