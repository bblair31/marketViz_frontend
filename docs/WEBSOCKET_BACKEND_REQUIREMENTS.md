# WebSocket Backend Requirements

This document outlines the WebSocket server requirements for the MarketViz frontend's real-time features.

## Overview

The frontend is built with WebSocket infrastructure ready to receive real-time market data. The backend needs to implement a WebSocket server that follows the protocol described below.

## Connection Details

### Endpoint
```
ws://localhost:3000/ws
wss://your-production-domain.com/ws
```

### Authentication
- Token is passed as a query parameter: `ws://localhost:3000/ws?token=<jwt_token>`
- The backend should validate the JWT token and associate the connection with the user
- Reject unauthorized connections with appropriate close codes

### Close Codes
- `1000`: Normal closure
- `1008`: Policy violation (auth failure)
- `1011`: Server error

## Message Protocol

All messages are JSON objects with the following structure:

### Client → Server Messages

#### Subscribe to Stocks
```json
{
  "type": "subscribe",
  "payload": {
    "symbols": ["AAPL", "MSFT", "GOOGL"]
  }
}
```

#### Unsubscribe from Stocks
```json
{
  "type": "unsubscribe",
  "payload": {
    "symbols": ["AAPL"]
  }
}
```

#### Heartbeat/Ping
```json
{
  "type": "ping"
}
```

### Server → Client Messages

#### Quote Update
Sent when a stock price changes (for subscribed symbols):
```json
{
  "type": "quote_update",
  "payload": {
    "symbol": "AAPL",
    "price": 185.92,
    "change": 2.45,
    "changePercent": 1.34,
    "volume": 45678900
  },
  "timestamp": "2025-11-20T14:30:00.000Z"
}
```

#### Price Alert
Sent when a user-configured price alert is triggered:
```json
{
  "type": "price_alert",
  "payload": {
    "symbol": "AAPL",
    "price": 185.00,
    "alertType": "above",
    "targetPrice": 185.00
  },
  "timestamp": "2025-11-20T14:30:00.000Z"
}
```

#### News Update
Sent when relevant news is available for subscribed symbols:
```json
{
  "type": "news_update",
  "payload": {
    "id": "news-123",
    "title": "Apple Announces New Product",
    "summary": "...",
    "source": "Reuters",
    "url": "https://...",
    "publishedAt": "2025-11-20T14:00:00.000Z",
    "sentiment": "bullish",
    "symbols": ["AAPL"]
  },
  "timestamp": "2025-11-20T14:30:00.000Z"
}
```

#### Connection Status (optional)
```json
{
  "type": "connection_status",
  "payload": {
    "status": "connected",
    "userId": "user-123",
    "subscriptions": ["AAPL", "MSFT"]
  },
  "timestamp": "2025-11-20T14:30:00.000Z"
}
```

#### Heartbeat/Pong
```json
{
  "type": "pong"
}
```

## Implementation Guidelines

### Connection Management
1. Maintain a map of user connections
2. Handle multiple connections per user
3. Clean up stale connections
4. Implement connection rate limiting

### Subscription Management
```typescript
// Example subscription tracking
interface UserSubscriptions {
  userId: string;
  connections: Set<WebSocket>;
  symbols: Set<string>;
}

const subscriptions = new Map<string, UserSubscriptions>();
```

### Broadcasting Updates
```typescript
// Broadcast quote update to all subscribed users
function broadcastQuoteUpdate(symbol: string, quote: QuoteUpdate) {
  const message = JSON.stringify({
    type: 'quote_update',
    payload: quote,
    timestamp: new Date().toISOString(),
  });

  // Find all users subscribed to this symbol
  for (const [userId, userSubs] of subscriptions) {
    if (userSubs.symbols.has(symbol)) {
      for (const ws of userSubs.connections) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      }
    }
  }
}
```

### Market Data Source Options

Since AlphaVantage doesn't offer free WebSocket data, consider these alternatives:

1. **Finnhub** (https://finnhub.io)
   - Free tier: 60 API calls/minute
   - WebSocket for real-time trades
   - Good for US stocks

2. **Polygon.io** (https://polygon.io)
   - Free tier available
   - WebSocket streaming
   - Comprehensive market data

3. **IEX Cloud** (https://iexcloud.io)
   - Free tier: 50,000 API calls/month
   - Real-time streaming available

4. **Yahoo Finance** (unofficial)
   - Free but unofficial
   - No WebSocket (would need polling)

5. **Simulated Data** (for development)
   - Generate realistic mock data
   - Useful for portfolio demos

### Sample Node.js Implementation

```typescript
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';

const wss = new WebSocketServer({ noServer: true });

// Handle upgrade request (integrate with your HTTP server)
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    socket.destroy();
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.userId = user.id;
      wss.emit('connection', ws, request);
    });
  } catch (err) {
    socket.destroy();
  }
});

wss.on('connection', (ws) => {
  console.log(`User ${ws.userId} connected`);

  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());

    switch (message.type) {
      case 'subscribe':
        handleSubscribe(ws, message.payload.symbols);
        break;
      case 'unsubscribe':
        handleUnsubscribe(ws, message.payload.symbols);
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
    }
  });

  ws.on('close', () => {
    console.log(`User ${ws.userId} disconnected`);
    cleanupConnection(ws);
  });
});
```

## Testing

### Manual Testing
```javascript
// Browser console
const ws = new WebSocket('ws://localhost:3000/ws?token=YOUR_TOKEN');

ws.onopen = () => {
  console.log('Connected');
  ws.send(JSON.stringify({
    type: 'subscribe',
    payload: { symbols: ['AAPL'] }
  }));
};

ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};
```

### Load Testing
- Use tools like `ws` or `artillery` for WebSocket load testing
- Test concurrent connections
- Test subscription limits
- Test reconnection behavior

## Security Considerations

1. **Authentication**: Validate JWT on every connection
2. **Rate Limiting**: Limit subscriptions per user
3. **Input Validation**: Validate all incoming messages
4. **DoS Protection**: Limit message frequency
5. **Secure Transport**: Use WSS in production

## Metrics to Track

- Active connections
- Subscriptions per symbol
- Messages sent/received
- Connection errors
- Latency

## Questions for Backend Team

1. What market data provider will be used?
2. What's the update frequency for quotes?
3. Are there limits on subscriptions per user?
4. How will price alerts be stored/managed?
5. What's the reconnection policy?

---

**Frontend Implementation Status**: Ready
**Backend Implementation Status**: Pending
**Last Updated**: November 2025
