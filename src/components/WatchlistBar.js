import React from 'react';
import Watchlist from './Watchlist'

const WatchlistBar = ({ watchlist, handleStarClick }) => {
  return (
    <div className="container">
      <h2>MY WATCHLIST</h2>
      <Watchlist
        watchlist={watchlist}
        handleStarClick={handleStarClick}
      />
    </div>
  )
}
export default WatchlistBar
