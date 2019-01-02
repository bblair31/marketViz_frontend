import React from 'react';
import Watchlist from './Watchlist'

const WatchlistBar = ({ watchlist, handleStarClick }) => {
  return (
    <div className="container">
      <h2 style={{textAlign: "left"}}>My Watchlist</h2>
      <Watchlist
        watchlist={watchlist}
        handleStarClick={handleStarClick}
      />
    </div>
  )
}
export default WatchlistBar
