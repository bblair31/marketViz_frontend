/**
 * Socket.IO Client for Real-Time Market Data
 *
 * Connects to backend WebSocket for:
 * - Live price updates
 * - Alert notifications
 * - Portfolio updates
 */

import { io, Socket } from 'socket.io-client';
import { tokenStorage } from '@/lib/api-client';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Event payloads
export interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface AlertTriggered {
  id: string;
  symbol: string;
  condition: 'ABOVE' | 'BELOW' | 'CROSSES_ABOVE' | 'CROSSES_BELOW';
  targetPrice: number;
  currentPrice: number;
  triggeredAt: string;
}

export interface PortfolioUpdate {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface ConnectedEvent {
  socketId: string;
  authenticated: boolean;
}

class SocketIOClient {
  private socket: Socket | null = null;
  private _status: ConnectionStatus = 'disconnected';
  private statusHandlers = new Set<(status: ConnectionStatus) => void>();
  private subscribedSymbols = new Set<string>();

  get status(): ConnectionStatus {
    return this._status;
  }

  private setStatus(status: ConnectionStatus): void {
    this._status = status;
    this.statusHandlers.forEach((handler) => handler(status));
  }

  /**
   * Connect to the Socket.IO server
   */
  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    const token = tokenStorage.getAccessToken();
    const url = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') ?? 'http://localhost:3000';

    this.setStatus('connecting');

    this.socket = io(url, {
      auth: {
        token: token ?? '',
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventHandlers();
  }

  /**
   * Disconnect from the server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.subscribedSymbols.clear();
    this.setStatus('disconnected');
  }

  /**
   * Subscribe to connection status changes
   */
  onStatusChange(handler: (status: ConnectionStatus) => void): () => void {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  /**
   * Subscribe to price updates for symbols (max 20)
   */
  subscribeToPrices(symbols: string[]): void {
    if (!this.socket?.connected) return;

    const normalizedSymbols = symbols.map((s) => s.toUpperCase());
    normalizedSymbols.forEach((s) => this.subscribedSymbols.add(s));

    this.socket.emit('subscribe:prices', { symbols: normalizedSymbols });
  }

  /**
   * Unsubscribe from price updates
   */
  unsubscribeFromPrices(symbols: string[]): void {
    if (!this.socket?.connected) return;

    const normalizedSymbols = symbols.map((s) => s.toUpperCase());
    normalizedSymbols.forEach((s) => this.subscribedSymbols.delete(s));

    this.socket.emit('unsubscribe:prices', { symbols: normalizedSymbols });
  }

  /**
   * Subscribe to alert notifications
   */
  subscribeToAlerts(): void {
    if (!this.socket?.connected) return;
    this.socket.emit('subscribe:alerts');
  }

  /**
   * Subscribe to portfolio updates
   */
  subscribeToPortfolio(): void {
    if (!this.socket?.connected) return;
    this.socket.emit('subscribe:portfolio');
  }

  /**
   * Listen for price updates
   */
  onPriceUpdate(handler: (data: PriceUpdate) => void): () => void {
    if (!this.socket) return () => {};

    this.socket.on('price:update', handler);
    return () => this.socket?.off('price:update', handler);
  }

  /**
   * Listen for alert triggers
   */
  onAlertTriggered(handler: (alert: AlertTriggered) => void): () => void {
    if (!this.socket) return () => {};

    this.socket.on('alert:triggered', handler);
    return () => this.socket?.off('alert:triggered', handler);
  }

  /**
   * Listen for portfolio updates
   */
  onPortfolioUpdate(handler: (data: PortfolioUpdate) => void): () => void {
    if (!this.socket) return () => {};

    this.socket.on('portfolio:update', handler);
    return () => this.socket?.off('portfolio:update', handler);
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket.IO connected');
      this.setStatus('connected');

      // Re-subscribe to previous subscriptions
      if (this.subscribedSymbols.size > 0) {
        this.subscribeToPrices(Array.from(this.subscribedSymbols));
      }
    });

    this.socket.on('connected', (data: ConnectedEvent) => {
      console.log('Authenticated:', data.authenticated, 'Socket ID:', data.socketId);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      this.setStatus('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error.message);
      this.setStatus('error');
    });

    this.socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });
  }

  /**
   * Get the underlying socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Singleton instance
export const socketClient = new SocketIOClient();
