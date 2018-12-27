import React from 'react';

const StockCard = ({ stock, handleStarClick }) => {
  return (
    <div className="stock-card" style={{display: "inline-block"}}>
      <button name="watchlist-star"
        onClick={() => handleStarClick(stock.symbol, stock.companyName, stock.latestPrice)}>⭐️
      </button>

      <b>{stock.symbol}</b>
      <p>{stock.companyName.substring(0,20)}</p>
      <p>{(stock.changePercent * 100).toFixed(2)}%</p>
      <p>${(stock.latestPrice * 1).toFixed(2)}</p>
    </div>
  )
}
export default StockCard
