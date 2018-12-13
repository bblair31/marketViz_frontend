import React from 'react';

const StockCard = ({ stock }) => {
  return (
    <div className="stock-card" style={{display: "inline-block"}}>
      <b>{stock.symbol}</b>
      <p>{stock.changePercent}</p>
      <p>{stock.latestPrice}</p>
    </div>
  )
} /// End of Dashboard Class
export default StockCard
