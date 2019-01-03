import React from 'react';
import StockCard from './StockCard'
import { Card } from 'semantic-ui-react'

const mapWatchlist = (watchlist, handleStarClick) => {
  return watchlist.map(stock => {
    return (
      <Card key={stock.symbol} style={{background: "#89d5ed"}}>
        <StockCard
          key={stock.symbol}
          stock={stock}
          handleStarClick={handleStarClick}
          active='true'
        />
      </Card>
    )
  })
}


const Watchlist = ({ watchlist, handleStarClick }) => {
  return (
    <div className="container">
      <Card.Group itemsPerRow={4}>
        {mapWatchlist(watchlist, handleStarClick)}
      </Card.Group>
    </div>
  )
}
export default Watchlist
