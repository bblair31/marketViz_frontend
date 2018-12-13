import React from 'react';

const MarketCard = ({ market }) => {
  return (
    <div className="market-card" style={{display: "inline-block"}}>
      <p>{market.venueName}</p>
      <p>{market.marketPercent}</p>
    </div>
  )
} /// End of Dashboard Class
export default MarketCard
