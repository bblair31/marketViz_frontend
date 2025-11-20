import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '@/lib/api-client';
import type { PerformancePeriod } from '@/types';

export const portfolioKeys = {
  summary: () => ['portfolio', 'summary'] as const,
  metrics: () => ['portfolio', 'metrics'] as const,
  correlation: () => ['portfolio', 'correlation'] as const,
  performance: (period: PerformancePeriod) => ['portfolio', 'performance', period] as const,
};

export function usePortfolioSummary() {
  return useQuery({
    queryKey: portfolioKeys.summary(),
    queryFn: async () => {
      const response = await portfolioApi.getSummary();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePortfolioMetrics() {
  return useQuery({
    queryKey: portfolioKeys.metrics(),
    queryFn: async () => {
      const response = await portfolioApi.getMetrics();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCorrelationMatrix() {
  return useQuery({
    queryKey: portfolioKeys.correlation(),
    queryFn: async () => {
      const response = await portfolioApi.getCorrelation();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function usePortfolioPerformance(period: PerformancePeriod = '1M') {
  return useQuery({
    queryKey: portfolioKeys.performance(period),
    queryFn: async () => {
      const response = await portfolioApi.getPerformance(period);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
