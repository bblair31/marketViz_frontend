import React from 'react';
import StockCard from './StockCard'

const mapWatchlist = (watchlist) => {
  return watchlist.map(stock => {
    return <StockCard key={stock.symbol} stock={stock} />
  })
}


const Watchlist = ({ watchlist }) => {
  return (
    <div className="watchlist" style={{display: "inline-block"}}>
      {mapWatchlist(watchlist)}
    </div>
  )
}
export default Watchlist
