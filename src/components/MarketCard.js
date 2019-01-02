import React from 'react';

const MarketCard = ({ market }) => {
  return (
    <div className="market-card" style={{display: "inline-block"}}>
      <p>{market.companyName}</p>
      <p>${(market.latestPrice).toFixed(2)}</p>
      <p>{(market.changePercent * 100).toFixed(2)}%</p>
    </div>
  )
} /// End of Dashboard Class
export default MarketCard
