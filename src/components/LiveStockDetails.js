import React from 'react';

const LiveStockDetails = ({ stock, handleStarClick }) => {
  return (
    <div name="live-stock-info">
      <button name="watchlist-star"
        onClick={() => handleStarClick(stock.symbol, stock.companyName, stock.latestPrice)}>⭐️
      </button>

      <h5>{stock.companyName}</h5>
      <h3>Current Price: ${stock.latestPrice}</h3>
      <i>Change: {stock.change}</i>
      <p>% Change: {(stock.changePercent * 100).toFixed(2)}%</p>
      <i>Updated {stock.latestTime}</i>
    </div>
  )
}
export default LiveStockDetails
