import React from 'react';

const StockCard = ({ stock }) => {
  return (
    <div className="stock-card" style={{display: "inline-block"}}>
      <b>{stock.symbol}</b>
      <p>{stock.companyName.substring(0,20)}</p>
      <p>{stock.changePercent}</p>
      <p>{stock.latestPrice}</p>
    </div>
  )
}
export default StockCard
