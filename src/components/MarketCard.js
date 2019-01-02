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
    <div className="market-card">
      <h4 style={{color: (market.changePercent >= 0 ? "green" : "red")}}>
        {checkMarketName(market.symbol)}<br></br>
        {(market.changePercent * 100).toFixed(2)}%
      </h4>
    </div>
  )
} /// End of Dashboard Class
export default MarketCard
