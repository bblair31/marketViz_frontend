import React from 'react';
import StockCard from './StockCard'

const mapWatchlist = (watchlist, handleStarClick) => {
  return watchlist.map(stock => {
    return <StockCard
      key={stock.symbol}
      stock={stock}
      handleStarClick={handleStarClick}
    />
  })
}


const Watchlist = ({ watchlist, handleStarClick }) => {
  console.log(watchlist)
  return (
    <div className="watchlist" style={{display: "inline-block"}}>
      {mapWatchlist(watchlist, handleStarClick)}
    </div>
  )
}
export default Watchlist
