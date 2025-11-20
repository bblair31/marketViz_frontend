import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '@/lib/api-client';
import type { CreateAlertInput, AlertStatus } from '@/types';

export const alertKeys = {
  all: () => ['alerts'] as const,
  list: (status?: AlertStatus) => ['alerts', 'list', status] as const,
  stats: () => ['alerts', 'stats'] as const,
};

export function useAlerts(status?: AlertStatus) {
  return useQuery({
    queryKey: alertKeys.list(status),
    queryFn: async () => {
      const response = await alertsApi.getAlerts(status);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useAlertStats() {
  return useQuery({
    queryKey: alertKeys.stats(),
    queryFn: async () => {
      const response = await alertsApi.getStats();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAlertInput) => {
      const response = await alertsApi.createAlert(data);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all() });
    },
  });
}

export function useUpdateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAlertInput> }) => {
      const response = await alertsApi.updateAlert(id, data);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all() });
    },
  });
}

export function useCancelAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await alertsApi.cancelAlert(id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all() });
    },
  });
}

export function useDeleteAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await alertsApi.deleteAlert(id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all() });
    },
  });
}

export function useCheckAlerts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await alertsApi.checkAlerts();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all() });
    },
  });
}
