import { useQuery, useMutation } from '@tanstack/react-query';
import { screenerApi } from '@/lib/api-client';
import type { ScreenerRequest, ScreenerPreset } from '@/types';

export const screenerKeys = {
  results: (filters: ScreenerRequest) => ['screener', 'results', filters] as const,
  presets: () => ['screener', 'presets'] as const,
  preset: (preset: ScreenerPreset) => ['screener', 'preset', preset] as const,
  sectors: () => ['screener', 'sectors'] as const,
};

export function useScreenerPresets() {
  return useQuery({
    queryKey: screenerKeys.presets(),
    queryFn: async () => {
      const response = await screenerApi.getPresets();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useScreenerPreset(preset: ScreenerPreset, limit = 20) {
  return useQuery({
    queryKey: screenerKeys.preset(preset),
    queryFn: async () => {
      const response = await screenerApi.runPreset(preset, limit);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useScreenerSectors() {
  return useQuery({
    queryKey: screenerKeys.sectors(),
    queryFn: async () => {
      const response = await screenerApi.getSectors();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useScreenStocks() {
  return useMutation({
    mutationFn: async (request: ScreenerRequest) => {
      const response = await screenerApi.screen(request);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
}
