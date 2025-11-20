'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { wsClient, type ConnectionStatus } from '@/lib/websocket-client';
import type { QuoteUpdatePayload, PriceAlertPayload } from '@/types';
import { useAuthStore } from '@/stores/auth-store';
import { tokenStorage } from '@/lib/api-client';

/**
 * Hook to manage WebSocket connection status
 */
export function useWebSocketStatus() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  useEffect(() => {
    // Set initial status
    setStatus(wsClient.status);

    // Subscribe to status changes
    const unsubscribe = wsClient.onStatusChange(setStatus);

    return unsubscribe;
  }, []);

  return status;
}

/**
 * Hook to automatically connect/disconnect WebSocket based on auth state
 */
export function useWebSocketConnection() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const token = tokenStorage.getAccessToken();
      wsClient.connect(token ?? undefined);
    } else {
      wsClient.disconnect();
    }

    return () => {
      // Don't disconnect on unmount - let the auth state handle it
    };
  }, [isAuthenticated]);
}

/**
 * Hook to subscribe to real-time stock quote updates
 */
export function useRealtimeQuote(symbol: string) {
  const [quote, setQuote] = useState<QuoteUpdatePayload | null>(null);
  const status = useWebSocketStatus();

  useEffect(() => {
    if (!symbol || status !== 'connected') return;

    // Subscribe to the stock
    wsClient.subscribeToStock(symbol);

    // Listen for quote updates
    const unsubscribe = wsClient.on<QuoteUpdatePayload>('quote_update', (payload) => {
      if (payload.symbol === symbol.toUpperCase()) {
        setQuote(payload);
      }
    });

    return () => {
      wsClient.unsubscribeFromStock(symbol);
      unsubscribe();
    };
  }, [symbol, status]);

  return {
    quote,
    isConnected: status === 'connected',
    status,
  };
}

/**
 * Hook to subscribe to multiple stock quotes
 */
export function useRealtimeQuotes(symbols: string[]) {
  const [quotes, setQuotes] = useState<Map<string, QuoteUpdatePayload>>(new Map());
  const status = useWebSocketStatus();
  const symbolsRef = useRef<string[]>([]);

  useEffect(() => {
    if (status !== 'connected') return;

    // Unsubscribe from old symbols
    symbolsRef.current.forEach((symbol) => {
      if (!symbols.includes(symbol)) {
        wsClient.unsubscribeFromStock(symbol);
      }
    });

    // Subscribe to new symbols
    symbols.forEach((symbol) => {
      if (!symbolsRef.current.includes(symbol)) {
        wsClient.subscribeToStock(symbol);
      }
    });

    symbolsRef.current = [...symbols];

    // Listen for quote updates
    const unsubscribe = wsClient.on<QuoteUpdatePayload>('quote_update', (payload) => {
      if (symbols.map((s) => s.toUpperCase()).includes(payload.symbol)) {
        setQuotes((prev) => new Map(prev).set(payload.symbol, payload));
      }
    });

    return () => {
      symbols.forEach((symbol) => wsClient.unsubscribeFromStock(symbol));
      unsubscribe();
    };
  }, [symbols, status]);

  return {
    quotes: Array.from(quotes.values()),
    quotesMap: quotes,
    isConnected: status === 'connected',
    status,
  };
}

/**
 * Hook to receive price alerts
 */
export function usePriceAlerts(onAlert: (alert: PriceAlertPayload) => void) {
  const status = useWebSocketStatus();
  const callbackRef = useRef(onAlert);

  // Keep callback reference updated
  useEffect(() => {
    callbackRef.current = onAlert;
  }, [onAlert]);

  useEffect(() => {
    if (status !== 'connected') return;

    const unsubscribe = wsClient.on<PriceAlertPayload>('price_alert', (payload) => {
      callbackRef.current(payload);
    });

    return unsubscribe;
  }, [status]);

  return { isConnected: status === 'connected' };
}

/**
 * Hook for manual WebSocket control
 */
export function useWebSocketControl() {
  const status = useWebSocketStatus();

  const connect = useCallback((token?: string) => {
    wsClient.connect(token);
  }, []);

  const disconnect = useCallback(() => {
    wsClient.disconnect();
  }, []);

  const subscribe = useCallback((symbols: string | string[]) => {
    const symbolArray = Array.isArray(symbols) ? symbols : [symbols];
    symbolArray.forEach((symbol) => wsClient.subscribeToStock(symbol));
  }, []);

  const unsubscribe = useCallback((symbols: string | string[]) => {
    const symbolArray = Array.isArray(symbols) ? symbols : [symbols];
    symbolArray.forEach((symbol) => wsClient.unsubscribeFromStock(symbol));
  }, []);

  return {
    status,
    isConnected: status === 'connected',
    connect,
    disconnect,
    subscribe,
    unsubscribe,
  };
}
