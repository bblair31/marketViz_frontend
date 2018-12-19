import React from 'react';

const StockCard = ({ stock }) => {
  return (
    <div className="stock-card" style={{display: "inline-block"}}>
      <b>{stock.symbol}</b>
      <p>{stock.companyName.substring(0,20)}</p>
      <p>{(stock.changePercent * 100).toFixed(2)}%</p>
      <p>${(stock.latestPrice * 1).toFixed(2)}</p>
    </div>
  )
}
export default StockCard
