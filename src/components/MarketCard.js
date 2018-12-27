import React from 'react';

const MarketCard = ({ market }) => {
  return (
    <div className="market-card" style={{display: "inline-block"}}>
      <p>{market.venueName}</p>
      <p>{(market.marketPercent * 100).toFixed(2)}%</p>
    </div>
  )
} /// End of Dashboard Class
export default MarketCard
