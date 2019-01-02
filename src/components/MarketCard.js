import React from 'react';

const checkMarketName = symbol => {
  switch (symbol) {
    case 'DIA':
      return 'DOW'
    case 'SPY':
      return 'S&P 500'
    case 'IWM':
      return 'RUSSELL 2000'
    default:
      return symbol
  }
}

const MarketCard = ({ market }) => {
  return (
    <div className="market-card" style={{display: "inline-block"}}>
      <p>{checkMarketName(market.symbol)}</p>
      <p>${(market.latestPrice).toFixed(2)}</p>
      <p>${(market.change).toFixed(2)}</p>
      <p>{(market.changePercent * 100).toFixed(2)}%</p>
    </div>
  )
} /// End of Dashboard Class
export default MarketCard
