export * from './use-stock-data';
export * from './use-websocket';

// Re-export socket client for convenience
export { socketClient } from '@/lib/socket-client';
export type { PriceUpdate, AlertTriggered, PortfolioUpdate, ConnectionStatus } from '@/lib/socket-client';
