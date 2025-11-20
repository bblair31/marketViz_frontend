/**
 * WebSocket Client for Real-Time Market Data
 *
 * This module provides a WebSocket client infrastructure for real-time market data.
 * The backend needs to implement the corresponding WebSocket server.
 *
 * See /docs/WEBSOCKET_BACKEND_REQUIREMENTS.md for backend implementation details.
 */

import type { WebSocketMessage, WebSocketMessageType } from '@/types';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

type MessageHandler<T = unknown> = (payload: T) => void;
type StatusHandler = (status: ConnectionStatus) => void;

interface WebSocketClientConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketClientConfig>;
  private reconnectAttempts = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private messageHandlers = new Map<WebSocketMessageType, Set<MessageHandler>>();
  private statusHandlers = new Set<StatusHandler>();
  private subscriptions = new Set<string>();
  private _status: ConnectionStatus = 'disconnected';

  constructor(config: WebSocketClientConfig) {
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config,
    };
  }

  get status(): ConnectionStatus {
    return this._status;
  }

  private setStatus(status: ConnectionStatus): void {
    this._status = status;
    this.statusHandlers.forEach((handler) => handler(status));
  }

  /**
   * Connect to the WebSocket server
   */
  connect(token?: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.setStatus('connecting');

    // Build URL with auth token if provided
    let url = this.config.url;
    if (token) {
      url += `?token=${encodeURIComponent(token)}`;
    }

    try {
      this.ws = new WebSocket(url);
      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.setStatus('error');
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    this.clearTimers();
    this.reconnectAttempts = 0;

    if (this.ws) {
      this.ws.onclose = null; // Prevent reconnect on intentional close
      this.ws.close();
      this.ws = null;
    }

    this.setStatus('disconnected');
  }

  /**
   * Subscribe to a message type
   */
  on<T = unknown>(type: WebSocketMessageType, handler: MessageHandler<T>): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    this.messageHandlers.get(type)!.add(handler as MessageHandler);

    // Return unsubscribe function
    return () => {
      this.messageHandlers.get(type)?.delete(handler as MessageHandler);
    };
  }

  /**
   * Subscribe to connection status changes
   */
  onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  /**
   * Subscribe to stock price updates
   */
  subscribeToStock(symbol: string): void {
    const normalizedSymbol = symbol.toUpperCase();
    this.subscriptions.add(normalizedSymbol);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send({
        type: 'subscribe',
        payload: { symbols: [normalizedSymbol] },
      });
    }
  }

  /**
   * Unsubscribe from stock price updates
   */
  unsubscribeFromStock(symbol: string): void {
    const normalizedSymbol = symbol.toUpperCase();
    this.subscriptions.delete(normalizedSymbol);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send({
        type: 'unsubscribe',
        payload: { symbols: [normalizedSymbol] },
      });
    }
  }

  /**
   * Send a message to the server
   */
  send(message: Record<string, unknown>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.setStatus('connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();

      // Re-subscribe to previous subscriptions
      if (this.subscriptions.size > 0) {
        this.send({
          type: 'subscribe',
          payload: { symbols: Array.from(this.subscriptions) },
        });
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        const handlers = this.messageHandlers.get(message.type);

        if (handlers) {
          handlers.forEach((handler) => handler(message.payload));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.setStatus('error');
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.clearTimers();

      if (event.code !== 1000) {
        // Abnormal closure - attempt reconnect
        this.scheduleReconnect();
      } else {
        this.setStatus('disconnected');
      }
    };
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    }, this.config.heartbeatInterval);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.setStatus('error');
      return;
    }

    this.setStatus('reconnecting');
    this.reconnectAttempts++;

    const delay = this.config.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1);
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private clearTimers(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

// Create a singleton instance
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3000/ws';

export const wsClient = new WebSocketClient({ url: WS_URL });
