import React from 'react';
import Watchlist from './Watchlist'

const WatchlistBar = ({ watchlist, handleStarClick }) => {
  return (
    <div className="watchlist-bar">
      <h3>Watchlist</h3>
      <Watchlist
        watchlist={watchlist}
        handleStarClick={handleStarClick}
      />
    </div>
  )
}
export default WatchlistBar
